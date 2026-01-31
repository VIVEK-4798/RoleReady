const express = require('express');
const router = express.Router();
const db = require('../db');

/* ============================================================================
   🔐 ADMIN BENCHMARK & ROLE MANAGEMENT SERVICE
   ============================================================================
   
   PURPOSE: Give admins full control over how readiness is defined
   
   CORE PRINCIPLE (DO NOT VIOLATE):
   - Admins define truth
   - The engine only evaluates against that truth
   
   ADMIN CAN:
   ✅ Create / edit roles (categories)
   ✅ Assign skills to roles (benchmarks)
   ✅ Set importance (REQUIRED / OPTIONAL) and weights
   ✅ Activate / deactivate roles or skills
   
   ADMIN CANNOT:
   ❌ Edit user skills
   ❌ Edit readiness scores
   ❌ Override mentor validation
   
   ============================================================================ */

/* ============================================================================
   HELPER: Wrap DB query in Promise
   ============================================================================ */
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

/* ============================================================================
   STEP 3: ROLES (CATEGORIES) MANAGEMENT
   ============================================================================ */

/**
 * GET /admin/roles
 * Get all roles with statistics
 */
router.get('/roles', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.category_id,
        c.category_name,
        c.category_color_class,
        c.description,
        c.is_active,
        c.updated_by,
        c.updated_at,
        u.name as updated_by_name,
        COUNT(DISTINCT cs.skill_id) as skill_count,
        COUNT(DISTINCT CASE WHEN cs.importance = 'required' THEN cs.skill_id END) as required_count,
        COUNT(DISTINCT CASE WHEN cs.importance = 'optional' THEN cs.skill_id END) as optional_count,
        COUNT(DISTINCT pi.user_id) as user_count
      FROM categories c
      LEFT JOIN category_skills cs ON c.category_id = cs.category_id AND cs.is_active = TRUE
      LEFT JOIN profile_info pi ON c.category_id = pi.target_category_id
      LEFT JOIN user u ON c.updated_by = u.user_id
      GROUP BY c.category_id
      ORDER BY c.category_name
    `;
    
    const roles = await queryAsync(query);
    
    res.json({
      success: true,
      count: roles.length,
      roles
    });
    
  } catch (error) {
    console.error('[adminService] GET /roles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
});

/**
 * GET /admin/roles/:id
 * Get single role with full details
 */
router.get('/roles/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const roleQuery = `
      SELECT 
        c.*,
        u.name as updated_by_name
      FROM categories c
      LEFT JOIN user u ON c.updated_by = u.user_id
      WHERE c.category_id = ?
    `;
    
    const roles = await queryAsync(roleQuery, [id]);
    
    if (roles.length === 0) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    
    res.json({
      success: true,
      role: roles[0]
    });
    
  } catch (error) {
    console.error('[adminService] GET /roles/:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch role' });
  }
});

/**
 * POST /admin/roles
 * Create a new role
 */
router.post('/roles', async (req, res) => {
  const { category_name, description, category_color_class, admin_id } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ success: false, message: 'category_name is required' });
  }
  
  try {
    const query = `
      INSERT INTO categories (category_name, description, category_color_class, is_active, updated_by, updated_at)
      VALUES (?, ?, ?, TRUE, ?, NOW())
    `;
    
    const result = await queryAsync(query, [
      category_name.trim(),
      description || null,
      category_color_class || 'bg-blue-1',
      admin_id || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      role_id: result.insertId
    });
    
  } catch (error) {
    console.error('[adminService] POST /roles error:', error);
    res.status(500).json({ success: false, message: 'Failed to create role' });
  }
});

/**
 * PUT /admin/roles/:id
 * Update a role
 */
router.put('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { category_name, description, category_color_class, admin_id } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ success: false, message: 'category_name is required' });
  }
  
  try {
    const query = `
      UPDATE categories 
      SET 
        category_name = ?,
        description = ?,
        category_color_class = ?,
        updated_by = ?,
        updated_at = NOW()
      WHERE category_id = ?
    `;
    
    const result = await queryAsync(query, [
      category_name.trim(),
      description || null,
      category_color_class || 'bg-blue-1',
      admin_id || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    
    res.json({
      success: true,
      message: 'Role updated successfully'
    });
    
  } catch (error) {
    console.error('[adminService] PUT /roles/:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
});

/**
 * PATCH /admin/roles/:id/status
 * Toggle role active status
 */
router.patch('/roles/:id/status', async (req, res) => {
  const { id } = req.params;
  const { is_active, admin_id } = req.body;
  
  try {
    // Check if role has users targeting it
    if (is_active === false) {
      const usersQuery = `SELECT COUNT(*) as count FROM profile_info WHERE target_category_id = ?`;
      const users = await queryAsync(usersQuery, [id]);
      
      if (users[0].count > 0) {
        return res.status(400).json({
          success: false,
          error: 'ROLE_IN_USE',
          message: `Cannot deactivate: ${users[0].count} user(s) have this as their target role`,
          user_count: users[0].count
        });
      }
    }
    
    const query = `
      UPDATE categories 
      SET is_active = ?, updated_by = ?, updated_at = NOW()
      WHERE category_id = ?
    `;
    
    const result = await queryAsync(query, [is_active, admin_id || null, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    
    res.json({
      success: true,
      message: `Role ${is_active ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('[adminService] PATCH /roles/:id/status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update role status' });
  }
});

/* ============================================================================
   STEP 4: SKILLS MANAGEMENT (Master List)
   ============================================================================ */

/**
 * GET /admin/skills
 * Get all skills with usage statistics
 */
router.get('/skills', async (req, res) => {
  const { domain, is_active, search } = req.query;
  
  try {
    let query = `
      SELECT 
        s.skill_id,
        s.name,
        s.normalized_name,
        s.domain,
        s.is_active,
        s.updated_by,
        s.updated_at,
        u.name as updated_by_name,
        COUNT(DISTINCT cs.category_id) as role_count,
        COUNT(DISTINCT us.user_id) as user_count
      FROM skills s
      LEFT JOIN category_skills cs ON s.skill_id = cs.skill_id AND cs.is_active = TRUE
      LEFT JOIN user_skills us ON s.skill_id = us.skill_id
      LEFT JOIN user u ON s.updated_by = u.user_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (domain) {
      query += ` AND s.domain = ?`;
      params.push(domain);
    }
    
    if (is_active !== undefined) {
      query += ` AND s.is_active = ?`;
      params.push(is_active === 'true');
    }
    
    if (search) {
      query += ` AND (s.name LIKE ? OR s.normalized_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` GROUP BY s.skill_id ORDER BY s.name`;
    
    const skills = await queryAsync(query, params);
    
    // Get unique domains for filter
    const domains = await queryAsync(`SELECT DISTINCT domain FROM skills WHERE domain IS NOT NULL ORDER BY domain`);
    
    res.json({
      success: true,
      count: skills.length,
      domains: domains.map(d => d.domain),
      skills
    });
    
  } catch (error) {
    console.error('[adminService] GET /skills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills' });
  }
});

/**
 * POST /admin/skills
 * Create a new skill
 */
router.post('/skills', async (req, res) => {
  const { name, domain, admin_id } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'name is required' });
  }
  
  const normalized_name = name.toLowerCase().trim();
  
  try {
    // Check for duplicate
    const existing = await queryAsync(
      `SELECT skill_id FROM skills WHERE normalized_name = ?`,
      [normalized_name]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'DUPLICATE_SKILL',
        message: 'A skill with this name already exists',
        existing_id: existing[0].skill_id
      });
    }
    
    const query = `
      INSERT INTO skills (name, normalized_name, domain, is_active, updated_by, updated_at)
      VALUES (?, ?, ?, TRUE, ?, NOW())
    `;
    
    const result = await queryAsync(query, [
      name.trim(),
      normalized_name,
      domain || null,
      admin_id || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill_id: result.insertId
    });
    
  } catch (error) {
    console.error('[adminService] POST /skills error:', error);
    res.status(500).json({ success: false, message: 'Failed to create skill' });
  }
});

/**
 * PUT /admin/skills/:id
 * Update a skill
 */
router.put('/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { name, domain, admin_id } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'name is required' });
  }
  
  const normalized_name = name.toLowerCase().trim();
  
  try {
    // Check for duplicate (excluding current skill)
    const existing = await queryAsync(
      `SELECT skill_id FROM skills WHERE normalized_name = ? AND skill_id != ?`,
      [normalized_name, id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'DUPLICATE_SKILL',
        message: 'A skill with this name already exists'
      });
    }
    
    const query = `
      UPDATE skills 
      SET name = ?, normalized_name = ?, domain = ?, updated_by = ?, updated_at = NOW()
      WHERE skill_id = ?
    `;
    
    const result = await queryAsync(query, [
      name.trim(),
      normalized_name,
      domain || null,
      admin_id || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    
    res.json({
      success: true,
      message: 'Skill updated successfully'
    });
    
  } catch (error) {
    console.error('[adminService] PUT /skills/:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to update skill' });
  }
});

/**
 * PATCH /admin/skills/:id/status
 * Toggle skill active status
 */
router.patch('/skills/:id/status', async (req, res) => {
  const { id } = req.params;
  const { is_active, admin_id, force } = req.body;
  
  try {
    // Check if skill is used in active benchmarks
    if (is_active === false && !force) {
      const benchmarksQuery = `
        SELECT c.category_name, cs.importance
        FROM category_skills cs
        JOIN categories c ON cs.category_id = c.category_id
        WHERE cs.skill_id = ? AND cs.is_active = TRUE AND c.is_active = TRUE
      `;
      const benchmarks = await queryAsync(benchmarksQuery, [id]);
      
      if (benchmarks.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'SKILL_IN_USE',
          message: `Skill is used in ${benchmarks.length} active role(s)`,
          roles: benchmarks.map(b => ({ role: b.category_name, importance: b.importance })),
          hint: 'Set force=true to deactivate anyway, or remove from roles first'
        });
      }
    }
    
    const query = `
      UPDATE skills 
      SET is_active = ?, updated_by = ?, updated_at = NOW()
      WHERE skill_id = ?
    `;
    
    const result = await queryAsync(query, [is_active, admin_id || null, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    
    res.json({
      success: true,
      message: `Skill ${is_active ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('[adminService] PATCH /skills/:id/status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update skill status' });
  }
});

/* ============================================================================
   STEP 5: BENCHMARKS MANAGEMENT (Category Skills)
   ============================================================================ */

/**
 * GET /admin/benchmarks/:role_id
 * Get all benchmarks for a role
 */
router.get('/benchmarks/:role_id', async (req, res) => {
  const { role_id } = req.params;
  
  try {
    // Get role info
    const roleQuery = `SELECT * FROM categories WHERE category_id = ?`;
    const roles = await queryAsync(roleQuery, [role_id]);
    
    if (roles.length === 0) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    
    // Get benchmarks for this role
    const benchmarksQuery = `
      SELECT 
        cs.category_skill_id as benchmark_id,
        cs.skill_id,
        cs.category_id,
        cs.importance,
        cs.weight,
        cs.is_active,
        cs.updated_by,
        cs.updated_at,
        s.name as skill_name,
        s.domain as skill_domain,
        s.is_active as skill_is_active,
        u.name as updated_by_name
      FROM category_skills cs
      JOIN skills s ON cs.skill_id = s.skill_id
      LEFT JOIN user u ON cs.updated_by = u.user_id
      WHERE cs.category_id = ?
      ORDER BY cs.importance DESC, cs.weight DESC, s.name
    `;
    
    const benchmarks = await queryAsync(benchmarksQuery, [role_id]);
    
    // Calculate summary
    const summary = {
      total: benchmarks.length,
      active: benchmarks.filter(b => b.is_active).length,
      required: benchmarks.filter(b => b.importance === 'required' && b.is_active).length,
      optional: benchmarks.filter(b => b.importance === 'optional' && b.is_active).length,
      total_weight: benchmarks.filter(b => b.is_active).reduce((sum, b) => sum + (b.weight || 0), 0)
    };
    
    res.json({
      success: true,
      role: roles[0],
      summary,
      benchmarks
    });
    
  } catch (error) {
    console.error('[adminService] GET /benchmarks/:role_id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch benchmarks' });
  }
});

/**
 * POST /admin/benchmarks
 * Add a skill to a role (create benchmark)
 */
router.post('/benchmarks', async (req, res) => {
  const { role_id, skill_id, importance, weight, admin_id } = req.body;
  
  if (!role_id || !skill_id) {
    return res.status(400).json({ success: false, message: 'role_id and skill_id are required' });
  }
  
  try {
    // Check if benchmark already exists
    const existing = await queryAsync(
      `SELECT category_skill_id FROM category_skills WHERE category_id = ? AND skill_id = ?`,
      [role_id, skill_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'BENCHMARK_EXISTS',
        message: 'This skill is already assigned to this role',
        existing_id: existing[0].category_skill_id
      });
    }
    
    const query = `
      INSERT INTO category_skills (category_id, skill_id, importance, weight, is_active, updated_by, updated_at)
      VALUES (?, ?, ?, ?, TRUE, ?, NOW())
    `;
    
    const result = await queryAsync(query, [
      role_id,
      skill_id,
      importance || 'optional',
      weight || 1.0,
      admin_id || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Benchmark created successfully',
      benchmark_id: result.insertId
    });
    
  } catch (error) {
    console.error('[adminService] POST /benchmarks error:', error);
    res.status(500).json({ success: false, message: 'Failed to create benchmark' });
  }
});

/**
 * PUT /admin/benchmarks/:id
 * Update a benchmark
 */
router.put('/benchmarks/:id', async (req, res) => {
  const { id } = req.params;
  const { importance, weight, admin_id } = req.body;
  
  try {
    const query = `
      UPDATE category_skills 
      SET importance = ?, weight = ?, updated_by = ?, updated_at = NOW()
      WHERE category_skill_id = ?
    `;
    
    const result = await queryAsync(query, [
      importance || 'optional',
      weight || 1.0,
      admin_id || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Benchmark not found' });
    }
    
    res.json({
      success: true,
      message: 'Benchmark updated successfully'
    });
    
  } catch (error) {
    console.error('[adminService] PUT /benchmarks/:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to update benchmark' });
  }
});

/**
 * PATCH /admin/benchmarks/:id/status
 * Toggle benchmark active status
 */
router.patch('/benchmarks/:id/status', async (req, res) => {
  const { id } = req.params;
  const { is_active, admin_id } = req.body;
  
  try {
    const query = `
      UPDATE category_skills 
      SET is_active = ?, updated_by = ?, updated_at = NOW()
      WHERE category_skill_id = ?
    `;
    
    const result = await queryAsync(query, [is_active, admin_id || null, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Benchmark not found' });
    }
    
    res.json({
      success: true,
      message: `Benchmark ${is_active ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('[adminService] PATCH /benchmarks/:id/status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update benchmark status' });
  }
});

/**
 * DELETE /admin/benchmarks/:id
 * Remove a benchmark (soft delete - sets is_active = false)
 */
router.delete('/benchmarks/:id', async (req, res) => {
  const { id } = req.params;
  const { admin_id, hard_delete } = req.body;
  
  try {
    if (hard_delete) {
      // Hard delete - actually remove the record
      const result = await queryAsync(`DELETE FROM category_skills WHERE category_skill_id = ?`, [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Benchmark not found' });
      }
      
      res.json({
        success: true,
        message: 'Benchmark permanently deleted'
      });
    } else {
      // Soft delete - just deactivate
      const result = await queryAsync(
        `UPDATE category_skills SET is_active = FALSE, updated_by = ?, updated_at = NOW() WHERE category_skill_id = ?`,
        [admin_id || null, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Benchmark not found' });
      }
      
      res.json({
        success: true,
        message: 'Benchmark deactivated (soft delete)'
      });
    }
    
  } catch (error) {
    console.error('[adminService] DELETE /benchmarks/:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete benchmark' });
  }
});

/* ============================================================================
   STEP 6: ADMIN SAFEGUARDS & VALIDATION
   ============================================================================ */

/**
 * GET /admin/validate/role/:role_id
 * Validate a role's benchmark configuration
 */
router.get('/validate/role/:role_id', async (req, res) => {
  const { role_id } = req.params;
  
  try {
    const benchmarks = await queryAsync(`
      SELECT cs.*, s.name as skill_name
      FROM category_skills cs
      JOIN skills s ON cs.skill_id = s.skill_id
      WHERE cs.category_id = ? AND cs.is_active = TRUE
    `, [role_id]);
    
    const warnings = [];
    const errors = [];
    
    // Check: Role has at least one required skill
    const requiredCount = benchmarks.filter(b => b.importance === 'required').length;
    if (requiredCount === 0) {
      errors.push({
        code: 'NO_REQUIRED_SKILLS',
        message: 'Role has no required skills. Users cannot be "Not Ready" without at least one required skill.'
      });
    }
    
    // Check: Total weight is reasonable
    const totalWeight = benchmarks.reduce((sum, b) => sum + (b.weight || 0), 0);
    if (totalWeight > 100) {
      warnings.push({
        code: 'HIGH_TOTAL_WEIGHT',
        message: `Total weight (${totalWeight}) exceeds 100. This is allowed but may affect score interpretation.`,
        current_value: totalWeight
      });
    }
    
    if (totalWeight < 10 && benchmarks.length > 0) {
      warnings.push({
        code: 'LOW_TOTAL_WEIGHT',
        message: `Total weight (${totalWeight}) is very low. Consider increasing weights.`,
        current_value: totalWeight
      });
    }
    
    // Check: Skills with 0 weight
    const zeroWeightSkills = benchmarks.filter(b => b.weight === 0);
    if (zeroWeightSkills.length > 0) {
      warnings.push({
        code: 'ZERO_WEIGHT_SKILLS',
        message: `${zeroWeightSkills.length} skill(s) have weight of 0. They won't affect readiness score.`,
        skills: zeroWeightSkills.map(s => s.skill_name)
      });
    }
    
    // Check: Inactive skills in benchmarks
    const inactiveSkillBenchmarks = await queryAsync(`
      SELECT cs.*, s.name as skill_name
      FROM category_skills cs
      JOIN skills s ON cs.skill_id = s.skill_id
      WHERE cs.category_id = ? AND cs.is_active = TRUE AND s.is_active = FALSE
    `, [role_id]);
    
    if (inactiveSkillBenchmarks.length > 0) {
      warnings.push({
        code: 'INACTIVE_SKILLS_IN_BENCHMARK',
        message: `${inactiveSkillBenchmarks.length} benchmark(s) reference inactive skills.`,
        skills: inactiveSkillBenchmarks.map(s => s.skill_name)
      });
    }
    
    const isValid = errors.length === 0;
    
    res.json({
      success: true,
      role_id: parseInt(role_id),
      is_valid: isValid,
      summary: {
        total_benchmarks: benchmarks.length,
        required_count: requiredCount,
        optional_count: benchmarks.length - requiredCount,
        total_weight: totalWeight
      },
      errors,
      warnings
    });
    
  } catch (error) {
    console.error('[adminService] GET /validate/role/:role_id error:', error);
    res.status(500).json({ success: false, message: 'Failed to validate role' });
  }
});

/**
 * GET /admin/stats
 * Get overall admin statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      rolesStats,
      skillsStats,
      benchmarksStats
    ] = await Promise.all([
      queryAsync(`
        SELECT 
          COUNT(*) as total,
          SUM(is_active = TRUE) as active,
          SUM(is_active = FALSE) as inactive
        FROM categories
      `),
      queryAsync(`
        SELECT 
          COUNT(*) as total,
          SUM(is_active = TRUE) as active,
          SUM(is_active = FALSE) as inactive,
          COUNT(DISTINCT domain) as domains
        FROM skills
      `),
      queryAsync(`
        SELECT 
          COUNT(*) as total,
          SUM(cs.is_active = TRUE) as active,
          SUM(cs.importance = 'required' AND cs.is_active = TRUE) as required,
          SUM(cs.importance = 'optional' AND cs.is_active = TRUE) as optional
        FROM category_skills cs
      `)
    ]);
    
    res.json({
      success: true,
      stats: {
        roles: rolesStats[0],
        skills: skillsStats[0],
        benchmarks: benchmarksStats[0]
      }
    });
    
  } catch (error) {
    console.error('[adminService] GET /stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

/**
 * GET /admin/skills/available/:role_id
 * Get skills not yet assigned to a role (for "Add Skill" dropdown)
 */
router.get('/skills/available/:role_id', async (req, res) => {
  const { role_id } = req.params;
  const { search } = req.query;
  
  try {
    let query = `
      SELECT s.skill_id, s.name, s.domain
      FROM skills s
      WHERE s.is_active = TRUE
        AND s.skill_id NOT IN (
          SELECT skill_id FROM category_skills WHERE category_id = ?
        )
    `;
    
    const params = [role_id];
    
    if (search) {
      query += ` AND (s.name LIKE ? OR s.normalized_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY s.name LIMIT 50`;
    
    const skills = await queryAsync(query, params);
    
    res.json({
      success: true,
      count: skills.length,
      skills
    });
    
  } catch (error) {
    console.error('[adminService] GET /skills/available/:role_id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available skills' });
  }
});

module.exports = router;
