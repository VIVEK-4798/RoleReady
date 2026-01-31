const express = require('express');
const router = express.Router();
const db = require('../db');
const { generateRoadmap, fetchRoadmapInputData } = require('./roadmapService');


const STATUS_TIERS = {
  NOT_READY: { min: 0, max: 39, label: 'Not Ready', color: 'danger', emoji: '🔴' },
  DEVELOPING: { min: 40, max: 69, label: 'Developing', color: 'warning', emoji: '🟡' },
  READY: { min: 70, max: 89, label: 'Ready', color: 'success', emoji: '🟢' },
  EXCELLENT: { min: 90, max: 100, label: 'Excellent', color: 'primary', emoji: '🌟' }
};

/**
 * Get status label and color from percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {Object} - { label, color, emoji }
 */
function getStatusLabel(percentage) {
  if (percentage < 40) return STATUS_TIERS.NOT_READY;
  if (percentage < 70) return STATUS_TIERS.DEVELOPING;
  if (percentage < 90) return STATUS_TIERS.READY;
  return STATUS_TIERS.EXCELLENT;
}

/* ============================================================================
   CORE REPORT ASSEMBLY FUNCTIONS
   ============================================================================ */

/**
 * Fetch user information for report header
 * @param {number} user_id 
 * @returns {Promise<Object>}
 */
function fetchUserInfo(user_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        pi.target_category_id,
        c.category_name as target_role_name
      FROM user u
      LEFT JOIN profile_info pi ON u.user_id = pi.user_id
      LEFT JOIN categories c ON pi.target_category_id = c.category_id
      WHERE u.user_id = ?
    `;
    
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.error('[reportService] fetchUserInfo error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch user info' });
      }
      
      if (results.length === 0) {
        return reject({ error: 'USER_NOT_FOUND', message: 'User not found' });
      }
      
      const user = results[0];
      resolve({
        user_id: user.user_id,
        name: user.name || 'Unknown User',
        email: user.email || '',
        target_role: user.target_category_id ? {
          category_id: user.target_category_id,
          category_name: user.target_role_name || 'Unknown Role'
        } : null
      });
    });
  });
}

/**
 * Fetch latest readiness score for a user
 * @param {number} user_id 
 * @param {number|null} readiness_id - Optional specific readiness to fetch
 * @returns {Promise<Object>}
 */
function fetchReadinessScore(user_id, readiness_id = null) {
  return new Promise((resolve, reject) => {
    let query, params;
    
    if (readiness_id) {
      query = `
        SELECT 
          rs.readiness_id,
          rs.user_id,
          rs.category_id,
          rs.total_score,
          rs.max_possible_score,
          rs.calculated_at,
          rs.trigger_source,
          c.category_name as role_name
        FROM readiness_scores rs
        LEFT JOIN categories c ON rs.category_id = c.category_id
        WHERE rs.readiness_id = ? AND rs.user_id = ?
      `;
      params = [readiness_id, user_id];
    } else {
      query = `
        SELECT 
          rs.readiness_id,
          rs.user_id,
          rs.category_id,
          rs.total_score,
          rs.max_possible_score,
          rs.calculated_at,
          rs.trigger_source,
          c.category_name as role_name
        FROM readiness_scores rs
        LEFT JOIN categories c ON rs.category_id = c.category_id
        WHERE rs.user_id = ?
        ORDER BY rs.calculated_at DESC
        LIMIT 1
      `;
      params = [user_id];
    }
    
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('[reportService] fetchReadinessScore error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch readiness score' });
      }
      
      if (results.length === 0) {
        return resolve(null); // No readiness calculated yet
      }
      
      const score = results[0];
      const percentage = score.max_possible_score > 0 
        ? Math.round((score.total_score / score.max_possible_score) * 100)
        : 0;
      const status = getStatusLabel(percentage);
      
      resolve({
        readiness_id: score.readiness_id,
        score: score.total_score,
        max_score: score.max_possible_score,
        percentage: percentage,
        status_label: status.label,
        status_color: status.color,
        status_emoji: status.emoji,
        calculated_at: score.calculated_at,
        trigger_source: score.trigger_source,
        role: {
          category_id: score.category_id,
          category_name: score.role_name
        }
      });
    });
  });
}

/**
 * Fetch skill breakdown for a readiness calculation
 * @param {number} readiness_id 
 * @param {number} user_id
 * @returns {Promise<Object>}
 */
function fetchSkillBreakdown(readiness_id, user_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT DISTINCT
        rsb.skill_id,
        s.name as skill_name,
        rsb.required_weight,
        rsb.achieved_weight,
        rsb.status,
        rsb.skill_source,
        us.validation_status,
        cs.importance
      FROM readiness_score_breakdown rsb
      JOIN skills s ON rsb.skill_id = s.skill_id
      LEFT JOIN user_skills us ON us.skill_id = rsb.skill_id AND us.user_id = ?
      LEFT JOIN category_skills cs ON cs.skill_id = rsb.skill_id
        AND cs.category_id IN (SELECT category_id FROM readiness_scores WHERE readiness_id = ?)
      WHERE rsb.readiness_id = ?
      ORDER BY rsb.status ASC, rsb.required_weight DESC
    `;
    
    db.query(query, [user_id, readiness_id, readiness_id], (err, results) => {
      if (err) {
        console.error('[reportService] fetchSkillBreakdown error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch skill breakdown' });
      }
      
      const metSkills = [];
      const missingSkills = [];
      
      results.forEach(skill => {
        const skillData = {
          skill_id: skill.skill_id,
          skill_name: skill.skill_name,
          weight: skill.required_weight,
          source: skill.skill_source || 'unknown',
          is_validated: skill.validation_status === 'validated',
          validation_status: skill.validation_status || 'none',
          importance: skill.importance || 'optional'
        };
        
        if (skill.status === 'met') {
          metSkills.push(skillData);
        } else {
          missingSkills.push(skillData);
        }
      });
      
      resolve({
        total_skills: results.length,
        met_count: metSkills.length,
        missing_count: missingSkills.length,
        met_skills: metSkills,
        missing_skills: missingSkills
      });
    });
  });
}

/**
 * Fetch validation summary for a user's skills
 * @param {number} user_id 
 * @param {number} category_id 
 * @returns {Promise<Object>}
 */
function fetchValidationSummary(user_id, category_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        us.source,
        us.validation_status,
        COUNT(*) as count
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ?
        AND s.category_id = ?
        AND us.source IN ('self', 'resume', 'validated')
      GROUP BY us.source, us.validation_status
    `;
    
    db.query(query, [user_id, category_id], (err, results) => {
      if (err) {
        console.error('[reportService] fetchValidationSummary error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch validation summary' });
      }
      
      // Initialize counts
      const summary = {
        total_skills: 0,
        self_claimed: 0,
        resume_parsed: 0,
        mentor_validated: 0,
        pending_validation: 0,
        rejected: 0
      };
      
      results.forEach(row => {
        summary.total_skills += row.count;
        
        // Count by source
        if (row.source === 'self') {
          if (row.validation_status === 'validated') {
            summary.mentor_validated += row.count;
          } else if (row.validation_status === 'pending') {
            summary.pending_validation += row.count;
          } else if (row.validation_status === 'rejected') {
            summary.rejected += row.count;
          } else {
            summary.self_claimed += row.count;
          }
        } else if (row.source === 'resume') {
          if (row.validation_status === 'validated') {
            summary.mentor_validated += row.count;
          } else {
            summary.resume_parsed += row.count;
          }
        } else if (row.source === 'validated') {
          summary.mentor_validated += row.count;
        }
      });
      
      resolve(summary);
    });
  });
}

/**
 * Fetch roadmap priorities for a user
 * @param {number} user_id 
 * @returns {Promise<Object>}
 */
async function fetchRoadmapPriorities(user_id) {
  try {
    // Step 1: Fetch the input contract (same as roadmap page)
    const inputData = await fetchRoadmapInputData(user_id, null);
    
    // Step 2: Generate fresh roadmap
    const roadmap = generateRoadmap(inputData);
    
    if (!roadmap || !roadmap.items) {
      console.log('[reportService] No roadmap data available for user:', user_id);
      return null;
    }
    
    // Extract summary data
    const byPriority = {
      high: roadmap.summary?.by_priority?.high || 0,
      medium: roadmap.summary?.by_priority?.medium || 0,
      low: roadmap.summary?.by_priority?.low || 0
    };
    
    console.log('[reportService] Roadmap generated successfully');
    console.log('[reportService] Total items:', roadmap.summary?.total_items);
    console.log('[reportService] byPriority:', byPriority);
    
    // Get top 3 high priority items for summary
    const highPriorityItems = roadmap.items
      .filter(i => i.priority === 'HIGH')
      .slice(0, 3)
      .map(i => ({
        skill_name: i.skill_name,
        reason: i.reason,
        category: i.category
      }));
    
    return {
      roadmap_id: roadmap.roadmap_id || null,
      generated_at: new Date().toISOString(),
      total_items: roadmap.summary?.total_items || 0,
      by_priority: byPriority,
      high_priority_items: highPriorityItems
    };
    
  } catch (error) {
    console.error('[reportService] fetchRoadmapPriorities error:', error);
    // Return null instead of rejecting, so report can still be generated without roadmap
    return null;
  }
}


/**
 * Fetch readiness history for a user
 * @param {number} user_id 
 * @param {number} limit - Number of entries to fetch
 * @returns {Promise<Array>}
 */
function fetchReadinessHistory(user_id, limit = 5) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        rs.readiness_id,
        rs.total_score as score,
        rs.max_possible_score,
        rs.calculated_at,
        c.category_name as role_name
      FROM readiness_scores rs
      LEFT JOIN categories c ON rs.category_id = c.category_id
      WHERE rs.user_id = ?
      ORDER BY rs.calculated_at DESC
      LIMIT ?
    `;
    
    db.query(query, [user_id, limit], (err, results) => {
      if (err) {
        console.error('[reportService] fetchReadinessHistory error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch readiness history' });
      }
      
      const history = results.map(entry => {
        const percentage = entry.max_possible_score > 0
          ? Math.round((entry.score / entry.max_possible_score) * 100)
          : 0;
        const status = getStatusLabel(percentage);
        
        return {
          readiness_id: entry.readiness_id,
          score: entry.score,
          max_score: entry.max_possible_score,
          percentage: percentage,
          status_label: status.label,
          status_color: status.color,
          calculated_at: entry.calculated_at,
          role_name: entry.role_name
        };
      });
      
      resolve(history);
    });
  });
}

/**
 * 🎯 MAIN REPORT GENERATION FUNCTION
 * 
 * Assembles all report data without recalculating anything.
 * This is a pure snapshot of existing data.
 * 
 * @param {number} user_id - User to generate report for
 * @param {number|null} readiness_id - Optional specific readiness snapshot
 * @returns {Promise<Object>} - Complete report object
 */
async function generateReadinessReport(user_id, readiness_id = null) {
  try {
    // 1️⃣ Fetch user info
    const userInfo = await fetchUserInfo(user_id);
    
    // 2️⃣ Fetch readiness score
    const readiness = await fetchReadinessScore(user_id, readiness_id);
    
    if (!readiness) {
      return {
        success: false,
        error: 'NO_READINESS',
        message: 'No readiness calculation found. Please calculate your readiness first.',
        user: userInfo
      };
    }
    
    // 3️⃣ Fetch skill breakdown
    const skillBreakdown = await fetchSkillBreakdown(readiness.readiness_id, user_id);
    
    // 4️⃣ Fetch validation summary
    const validation = await fetchValidationSummary(user_id, readiness.role.category_id);
    
    // 5️⃣ Fetch roadmap priorities
    const roadmap = await fetchRoadmapPriorities(user_id);
    
    // 6️⃣ Fetch readiness history
    const history = await fetchReadinessHistory(user_id, 5);
    
    // 7️⃣ Assemble complete report
    return {
      success: true,
      generated_at: new Date().toISOString(),
      report: {
        user: userInfo,
        readiness: readiness,
        skill_breakdown: skillBreakdown,
        validation: validation,
        roadmap: roadmap,
        history: history
      }
    };
    
  } catch (error) {
    console.error('[reportService] generateReadinessReport error:', error);
    throw error;
  }
}

/* ============================================================================
   API ROUTES
   ============================================================================ */

/**
 * GET /api/report/:user_id
 * 
 * Generate a complete readiness report for the user
 */
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const report = await generateReadinessReport(parseInt(user_id));
    
    if (!report.success) {
      return res.status(404).json(report);
    }
    
    return res.status(200).json(report);
    
  } catch (error) {
    console.error('[GET /report/:user_id] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate report'
    });
  }
});

/**
 * GET /api/report/:user_id/readiness/:readiness_id
 * 
 * Generate a report for a specific readiness snapshot
 */
router.get('/:user_id/readiness/:readiness_id', async (req, res) => {
  const { user_id, readiness_id } = req.params;
  
  if (!user_id || !readiness_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PARAMS',
      message: 'user_id and readiness_id are required'
    });
  }
  
  try {
    const report = await generateReadinessReport(
      parseInt(user_id), 
      parseInt(readiness_id)
    );
    
    if (!report.success) {
      return res.status(404).json(report);
    }
    
    return res.status(200).json(report);
    
  } catch (error) {
    console.error('[GET /report/:user_id/readiness/:readiness_id] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate report'
    });
  }
});

/**
 * GET /api/report/:user_id/history
 * 
 * Get readiness history for report timeline
 */
router.get('/:user_id/history', async (req, res) => {
  const { user_id } = req.params;
  const { limit } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const history = await fetchReadinessHistory(
      parseInt(user_id), 
      limit ? parseInt(limit) : 5
    );
    
    return res.status(200).json({
      success: true,
      user_id: parseInt(user_id),
      count: history.length,
      history: history
    });
    
  } catch (error) {
    console.error('[GET /report/:user_id/history] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch history'
    });
  }
});

/**
 * GET /api/report/:user_id/status
 * 
 * Quick check if user can generate a report
 */
router.get('/:user_id/status', async (req, res) => {
  const { user_id } = req.params;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    // Check for user
    const userInfo = await fetchUserInfo(parseInt(user_id));
    
    // Check for readiness
    const readiness = await fetchReadinessScore(parseInt(user_id));
    
    return res.status(200).json({
      success: true,
      user_id: parseInt(user_id),
      can_generate_report: !!readiness,
      has_target_role: !!userInfo.target_role,
      has_readiness: !!readiness,
      readiness_info: readiness ? {
        readiness_id: readiness.readiness_id,
        percentage: readiness.percentage,
        status_label: readiness.status_label,
        calculated_at: readiness.calculated_at
      } : null
    });
    
  } catch (error) {
    console.error('[GET /report/:user_id/status] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to check report status'
    });
  }
});

module.exports = router;
