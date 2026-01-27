/* ============================================================================
   📄 STEP 3: Resume Parsing Service
   ============================================================================
   
   This service handles:
   1. Text extraction from PDF/DOCX files
   2. Text normalization (lowercase, remove noise)
   3. Skill matching against the skills table (binary: found/not found)
   4. Storing suggestions in resume_skill_suggestions table
   
   KEY PRINCIPLES:
   - Rule-based matching, NOT ML/NLP
   - Binary matching: skill is found or not found
   - NO confidence scores
   - Do NOT invent new skills - only match existing skills
   ============================================================================ */

const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// PDF and DOCX parsing libraries
let PDFParse, mammoth;

try {
  // pdf-parse v2 uses PDFParse class
  const pdfParseModule = require('pdf-parse');
  PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule;
  console.log('[resumeParser] pdf-parse loaded successfully, PDFParse type:', typeof PDFParse);
} catch (e) {
  console.warn('[resumeParser] pdf-parse not installed. Run: npm install pdf-parse');
  console.warn('[resumeParser] Error:', e.message);
}

try {
  mammoth = require('mammoth');
  console.log('[resumeParser] mammoth loaded successfully');
} catch (e) {
  console.warn('[resumeParser] mammoth not installed. Run: npm install mammoth');
}

/* ============================================================================
   TEXT EXTRACTION FUNCTIONS
   ============================================================================ */

/**
 * Extract text from a PDF file
 * @param {string} filePath - Full path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(filePath) {
  if (!PDFParse) {
    throw new Error('pdf-parse library not installed. Run: npm install pdf-parse');
  }
  
  const dataBuffer = fs.readFileSync(filePath);
  
  // pdf-parse v2 uses PDFParse class with { data: buffer }
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  
  // Clean up parser resources
  if (parser.destroy) {
    await parser.destroy();
  }
  
  return result.text || '';
}

/**
 * Extract text from a DOCX file
 * @param {string} filePath - Full path to the DOCX file
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromDOCX(filePath) {
  if (!mammoth) {
    throw new Error('mammoth library not installed. Run: npm install mammoth');
  }
  
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '';
}

/**
 * Extract text from any supported resume file
 * @param {string} filePath - Full path to the file
 * @param {string} fileType - File extension (pdf, doc, docx)
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromResume(filePath, fileType) {
  const ext = fileType.toLowerCase();
  
  if (ext === 'pdf') {
    return await extractTextFromPDF(filePath);
  } else if (ext === 'docx' || ext === 'doc') {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/* ============================================================================
   TEXT NORMALIZATION
   ============================================================================ */

/**
 * Normalize text for skill matching
 * - Lowercase
 * - Remove special characters (keep alphanumeric, spaces, common tech symbols)
 * - Collapse multiple spaces
 * - Trim
 * 
 * @param {string} text - Raw text from resume
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    // Keep letters, numbers, spaces, and common tech characters (+, #, .)
    .replace(/[^a-z0-9\s\+\#\.\_\-]/g, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize a skill name for matching
 * Same normalization as text to ensure consistent matching
 * 
 * @param {string} skillName - Skill name from database
 * @returns {string} - Normalized skill name
 */
function normalizeSkillName(skillName) {
  return normalizeText(skillName);
}

/* ============================================================================
   SKILL MATCHING (RULE-BASED, BINARY)
   ============================================================================ */

/**
 * Check if a skill appears in the normalized text
 * Uses word boundary matching to avoid partial matches
 * 
 * @param {string} normalizedText - Normalized resume text
 * @param {string} normalizedSkill - Normalized skill name
 * @returns {boolean} - True if skill is found
 */
function isSkillInText(normalizedText, normalizedSkill) {
  if (!normalizedSkill || normalizedSkill.length < 2) return false;
  
  // For very short skills (2-3 chars), require exact word match
  // For longer skills, allow them to appear as part of compound words
  if (normalizedSkill.length <= 3) {
    // Use word boundary matching for short skills like "c#", "go", "r"
    const regex = new RegExp(`\\b${escapeRegex(normalizedSkill)}\\b`, 'i');
    return regex.test(normalizedText);
  } else {
    // For longer skills, simple includes is fine
    // Also check word boundary for accuracy
    const regex = new RegExp(`\\b${escapeRegex(normalizedSkill)}\\b`, 'i');
    return regex.test(normalizedText);
  }
}

/**
 * Escape special regex characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Match resume text against skills from database
 * 
 * @param {string} normalizedText - Normalized resume text
 * @param {Array} skills - Array of skills from database [{skill_id, name, category_id}]
 * @returns {Array} - Array of matched skill IDs with names
 */
function matchSkillsInText(normalizedText, skills) {
  const matchedSkills = [];
  
  for (const skill of skills) {
    const normalizedSkill = normalizeSkillName(skill.name);
    
    if (isSkillInText(normalizedText, normalizedSkill)) {
      matchedSkills.push({
        skill_id: skill.skill_id,
        skill_name: skill.name,
        category_id: skill.category_id
      });
    }
  }
  
  return matchedSkills;
}

/* ============================================================================
   DATABASE OPERATIONS
   ============================================================================ */

/**
 * Get all skills from database (optionally filtered by category)
 * @param {number|null} categoryId - Optional category filter
 * @returns {Promise<Array>} - Array of skills
 */
function getAllSkills(categoryId = null) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT skill_id, name, category_id 
      FROM skills 
      WHERE 1=1
    `;
    const params = [];
    
    if (categoryId) {
      query += ` AND category_id = ?`;
      params.push(categoryId);
    }
    
    query += ` ORDER BY name`;
    
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

/**
 * Get resume info by ID
 * @param {number} resumeId - Resume ID
 * @returns {Promise<Object>} - Resume record
 */
function getResumeById(resumeId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT resume_id, user_id, file_name, file_path, file_type
      FROM resumes 
      WHERE resume_id = ? AND is_active = 1
    `;
    
    db.query(query, [resumeId], (err, results) => {
      if (err) reject(err);
      else resolve(results[0] || null);
    });
  });
}

/**
 * Get user's active resume
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Resume record
 */
function getActiveResumeByUser(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT resume_id, user_id, file_name, file_path, file_type
      FROM resumes 
      WHERE user_id = ? AND is_active = 1
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results[0] || null);
    });
  });
}

/**
 * Save parsed text to resume record
 * @param {number} resumeId - Resume ID
 * @param {string} parsedText - Extracted text
 * @returns {Promise<void>}
 */
function saveParsedText(resumeId, parsedText) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE resumes 
      SET parsed_text = ?, parsed_at = NOW()
      WHERE resume_id = ?
    `;
    
    db.query(query, [parsedText, resumeId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Clear existing suggestions for a resume (before re-parsing)
 * @param {number} resumeId - Resume ID
 * @returns {Promise<void>}
 */
function clearExistingSuggestions(resumeId) {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM resume_skill_suggestions 
      WHERE resume_id = ?
    `;
    
    db.query(query, [resumeId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Save skill suggestions to database
 * @param {number} userId - User ID
 * @param {number} resumeId - Resume ID
 * @param {Array} matchedSkills - Array of matched skills
 * @returns {Promise<number>} - Number of suggestions saved
 */
function saveSkillSuggestions(userId, resumeId, matchedSkills) {
  return new Promise((resolve, reject) => {
    if (!matchedSkills || matchedSkills.length === 0) {
      return resolve(0);
    }
    
    // Build bulk insert query
    const values = matchedSkills.map(skill => [
      userId,
      resumeId,
      skill.skill_id,
      skill.skill_name,
      skill.category_id,
      'pending'
    ]);
    
    const query = `
      INSERT INTO resume_skill_suggestions 
        (user_id, resume_id, skill_id, skill_name, category_id, status)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        skill_name = VALUES(skill_name),
        status = CASE 
          WHEN status = 'rejected' THEN 'rejected'  -- Keep rejected status
          ELSE 'pending'
        END
    `;
    
    db.query(query, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows);
    });
  });
}

/**
 * Get user's existing skills to exclude from suggestions
 * @param {number} userId - User ID
 * @returns {Promise<Set>} - Set of skill IDs user already has
 */
function getUserExistingSkillIds(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT skill_id FROM user_skills 
      WHERE user_id = ?
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(new Set(results.map(r => r.skill_id)));
    });
  });
}

/* ============================================================================
   MAIN PARSING FUNCTION
   ============================================================================ */

/**
 * Parse a resume and extract skill suggestions
 * 
 * @param {number} userId - User ID
 * @param {number} resumeId - Resume ID (optional, will use active resume if not provided)
 * @param {number} categoryId - Optional category filter (only match skills in this category)
 * @returns {Promise<Object>} - Parsing result
 */
async function parseResumeAndExtractSkills(userId, resumeId = null, categoryId = null) {
  // 1. Get resume record
  let resume;
  if (resumeId) {
    resume = await getResumeById(resumeId);
  } else {
    resume = await getActiveResumeByUser(userId);
  }
  
  if (!resume) {
    throw { error: 'NO_RESUME', message: 'No resume found to parse' };
  }
  
  // Verify ownership
  if (resume.user_id !== parseInt(userId)) {
    throw { error: 'UNAUTHORIZED', message: 'Resume does not belong to this user' };
  }
  
  // 2. Build file path and extract text
  const filePath = path.join(__dirname, '..', 'uploads', 'resumes', resume.file_path);
  
  if (!fs.existsSync(filePath)) {
    throw { error: 'FILE_NOT_FOUND', message: 'Resume file not found on server' };
  }
  
  console.log(`[resumeParser] Extracting text from: ${resume.file_name}`);
  const rawText = await extractTextFromResume(filePath, resume.file_type);
  
  if (!rawText || rawText.trim().length === 0) {
    throw { error: 'EXTRACTION_FAILED', message: 'Could not extract text from resume' };
  }
  
  // 3. Normalize text
  const normalizedText = normalizeText(rawText);
  console.log(`[resumeParser] Extracted ${rawText.length} chars, normalized to ${normalizedText.length} chars`);
  
  // 4. Save parsed text to resume record
  await saveParsedText(resume.resume_id, rawText);
  
  // 5. Get skills to match against
  const allSkills = await getAllSkills(categoryId);
  console.log(`[resumeParser] Matching against ${allSkills.length} skills`);
  
  // 6. Match skills in text
  const matchedSkills = matchSkillsInText(normalizedText, allSkills);
  console.log(`[resumeParser] Found ${matchedSkills.length} skill matches`);
  
  // 7. Filter out skills user already has
  const existingSkillIds = await getUserExistingSkillIds(userId);
  const newSkillSuggestions = matchedSkills.filter(
    skill => !existingSkillIds.has(skill.skill_id)
  );
  console.log(`[resumeParser] After filtering existing skills: ${newSkillSuggestions.length} new suggestions`);
  
  // 8. Clear old suggestions and save new ones
  await clearExistingSuggestions(resume.resume_id);
  const savedCount = await saveSkillSuggestions(userId, resume.resume_id, newSkillSuggestions);
  
  return {
    success: true,
    resume_id: resume.resume_id,
    file_name: resume.file_name,
    text_length: rawText.length,
    total_skills_checked: allSkills.length,
    total_matches: matchedSkills.length,
    new_suggestions: newSkillSuggestions.length,
    already_have: matchedSkills.length - newSkillSuggestions.length,
    suggestions: newSkillSuggestions.map(s => ({
      skill_id: s.skill_id,
      skill_name: s.skill_name,
      category_id: s.category_id
    }))
  };
}

/* ============================================================================
   API ENDPOINTS
   ============================================================================ */

/**
 * POST /resume-parser/parse
 * 
 * Parse user's resume and extract skill suggestions.
 * Optionally filter by category to only match relevant skills.
 */
router.post('/parse', async (req, res) => {
  const { user_id, resume_id, category_id } = req.body;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const result = await parseResumeAndExtractSkills(user_id, resume_id, category_id);
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('[resumeParser] Error:', error);
    
    if (error.error) {
      return res.status(400).json({
        success: false,
        error: error.error,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'PARSE_ERROR',
      message: error.message || 'Failed to parse resume'
    });
  }
});

/**
 * GET /resume-parser/suggestions/:user_id
 * 
 * Get pending skill suggestions for a user.
 * Optionally filter by status or category.
 */
router.get('/suggestions/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { status, category_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    let query = `
      SELECT 
        rss.suggestion_id,
        rss.skill_id,
        rss.skill_name,
        rss.category_id,
        c.category_name,
        rss.status,
        rss.created_at
      FROM resume_skill_suggestions rss
      LEFT JOIN categories c ON c.category_id = rss.category_id
      WHERE rss.user_id = ?
    `;
    const params = [user_id];
    
    if (status) {
      query += ` AND rss.status = ?`;
      params.push(status);
    }
    
    if (category_id) {
      query += ` AND rss.category_id = ?`;
      params.push(category_id);
    }
    
    query += ` ORDER BY rss.created_at DESC`;
    
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('[resumeParser] Error fetching suggestions:', err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to fetch suggestions'
        });
      }
      
      return res.status(200).json({
        success: true,
        count: results.length,
        suggestions: results
      });
    });
    
  } catch (error) {
    console.error('[resumeParser] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch suggestions'
    });
  }
});

/**
 * GET /resume-parser/status/:user_id
 * 
 * Get resume parsing status for a user.
 * Shows if resume is parsed, how many suggestions are pending.
 */
router.get('/status/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    // Get resume info
    const resume = await getActiveResumeByUser(user_id);
    
    if (!resume) {
      return res.status(200).json({
        success: true,
        has_resume: false,
        is_parsed: false,
        pending_suggestions: 0
      });
    }
    
    // Check if parsed
    const parsedQuery = `
      SELECT parsed_at FROM resumes WHERE resume_id = ?
    `;
    
    db.query(parsedQuery, [resume.resume_id], (err, parsedResult) => {
      if (err) {
        console.error('[resumeParser] Error:', err);
        return res.status(500).json({ success: false, error: 'DATABASE_ERROR' });
      }
      
      const isParsed = parsedResult[0]?.parsed_at != null;
      
      // Get pending count
      const countQuery = `
        SELECT COUNT(*) as pending_count 
        FROM resume_skill_suggestions 
        WHERE user_id = ? AND status = 'pending'
      `;
      
      db.query(countQuery, [user_id], (err2, countResult) => {
        if (err2) {
          console.error('[resumeParser] Error:', err2);
          return res.status(500).json({ success: false, error: 'DATABASE_ERROR' });
        }
        
        return res.status(200).json({
          success: true,
          has_resume: true,
          resume_id: resume.resume_id,
          file_name: resume.file_name,
          is_parsed: isParsed,
          parsed_at: parsedResult[0]?.parsed_at,
          pending_suggestions: countResult[0]?.pending_count || 0
        });
      });
    });
    
  } catch (error) {
    console.error('[resumeParser] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to get status'
    });
  }
});

/* ============================================================================
   🛡️ STEP 4: CONFIRM SKILL SUGGESTIONS
   ============================================================================
   
   This endpoint moves accepted suggestions to user_skills table.
   Key principles:
   - User explicitly selects which skills to add
   - Skills are added with source = 'resume'
   - Rejected skills are marked as rejected (won't reappear)
   ============================================================================ */

/**
 * POST /resume-parser/confirm
 * 
 * Confirm selected skill suggestions and add them to user_skills.
 * 
 * Body:
 * - user_id: User ID
 * - accepted_skill_ids: Array of skill IDs to accept
 * - rejected_skill_ids: Array of skill IDs to reject (optional)
 */
router.post('/confirm', async (req, res) => {
  const { user_id, accepted_skill_ids = [], rejected_skill_ids = [] } = req.body;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  if (!Array.isArray(accepted_skill_ids)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_INPUT',
      message: 'accepted_skill_ids must be an array'
    });
  }
  
  try {
    let acceptedCount = 0;
    let rejectedCount = 0;
    
    // 1. Add accepted skills to user_skills with source = 'resume'
    if (accepted_skill_ids.length > 0) {
      // First, get the skill details from suggestions
      const getSkillsQuery = `
        SELECT skill_id, skill_name, category_id
        FROM resume_skill_suggestions
        WHERE user_id = ? AND skill_id IN (?) AND status = 'pending'
      `;
      
      const skillsToAdd = await new Promise((resolve, reject) => {
        db.query(getSkillsQuery, [user_id, accepted_skill_ids], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      
      if (skillsToAdd.length > 0) {
        // Insert into user_skills with source = 'resume'
        const insertValues = skillsToAdd.map(skill => [
          user_id,
          skill.skill_id,
          'intermediate', // Default level
          'resume'        // Source = resume
        ]);
        
        const insertQuery = `
          INSERT INTO user_skills (user_id, skill_id, level, source)
          VALUES ?
          ON DUPLICATE KEY UPDATE 
            source = CASE 
              WHEN source = 'demo' THEN 'resume'  -- Upgrade from demo
              ELSE source  -- Keep existing source
            END
        `;
        
        await new Promise((resolve, reject) => {
          db.query(insertQuery, [insertValues], (err, result) => {
            if (err) reject(err);
            else {
              acceptedCount = result.affectedRows;
              resolve();
            }
          });
        });
        
        // Mark suggestions as accepted
        const updateAcceptedQuery = `
          UPDATE resume_skill_suggestions
          SET status = 'accepted', reviewed_at = NOW()
          WHERE user_id = ? AND skill_id IN (?)
        `;
        
        await new Promise((resolve, reject) => {
          db.query(updateAcceptedQuery, [user_id, accepted_skill_ids], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }
    
    // 2. Mark rejected skills
    if (rejected_skill_ids.length > 0) {
      const updateRejectedQuery = `
        UPDATE resume_skill_suggestions
        SET status = 'rejected', reviewed_at = NOW()
        WHERE user_id = ? AND skill_id IN (?) AND status = 'pending'
      `;
      
      await new Promise((resolve, reject) => {
        db.query(updateRejectedQuery, [user_id, rejected_skill_ids], (err, result) => {
          if (err) reject(err);
          else {
            rejectedCount = result.affectedRows;
            resolve();
          }
        });
      });
    }
    
    // 3. Get remaining pending count
    const countQuery = `
      SELECT COUNT(*) as pending_count 
      FROM resume_skill_suggestions 
      WHERE user_id = ? AND status = 'pending'
    `;
    
    const countResult = await new Promise((resolve, reject) => {
      db.query(countQuery, [user_id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]?.pending_count || 0);
      });
    });
    
    return res.status(200).json({
      success: true,
      accepted_count: acceptedCount,
      rejected_count: rejectedCount,
      remaining_pending: countResult,
      message: `Added ${acceptedCount} skills from resume`
    });
    
  } catch (error) {
    console.error('[resumeParser] Confirm error:', error);
    return res.status(500).json({
      success: false,
      error: 'CONFIRM_ERROR',
      message: 'Failed to confirm skill suggestions'
    });
  }
});

/**
 * POST /resume-parser/reject-all
 * 
 * Reject all pending suggestions (user doesn't want any)
 */
router.post('/reject-all', async (req, res) => {
  const { user_id } = req.body;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const updateQuery = `
      UPDATE resume_skill_suggestions
      SET status = 'rejected', reviewed_at = NOW()
      WHERE user_id = ? AND status = 'pending'
    `;
    
    db.query(updateQuery, [user_id], (err, result) => {
      if (err) {
        console.error('[resumeParser] Reject all error:', err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to reject suggestions'
        });
      }
      
      return res.status(200).json({
        success: true,
        rejected_count: result.affectedRows,
        message: 'All pending suggestions rejected'
      });
    });
    
  } catch (error) {
    console.error('[resumeParser] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to reject suggestions'
    });
  }
});

// Export router and functions for testing
module.exports = router;
module.exports.parseResumeAndExtractSkills = parseResumeAndExtractSkills;
module.exports.normalizeText = normalizeText;
module.exports.matchSkillsInText = matchSkillsInText;
