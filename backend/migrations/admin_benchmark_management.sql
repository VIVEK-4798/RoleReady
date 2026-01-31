-- ============================================================================
-- ADMIN BENCHMARK MANAGEMENT MIGRATION
-- ============================================================================
-- Purpose: Extend existing tables to support admin benchmark management
-- 
-- TABLES MODIFIED:
-- - categories: Add is_active, description, updated_by, updated_at
-- - skills: Add is_active, normalized_name, domain, updated_by, updated_at  
-- - category_skills: Add is_active, updated_by, updated_at
--
-- PRINCIPLE: No new tables needed - extend existing ones
-- ============================================================================

-- ============================================================================
-- STEP 1: EXTEND CATEGORIES TABLE (Roles)
-- ============================================================================
ALTER TABLE categories 
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_by INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ============================================================================
-- STEP 2: EXTEND SKILLS TABLE (Master Skills List)
-- ============================================================================
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS normalized_name VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS domain VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_by INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Populate normalized_name from existing name (lowercase, trimmed)
UPDATE skills SET normalized_name = LOWER(TRIM(name)) WHERE normalized_name IS NULL;

-- ============================================================================
-- STEP 3: EXTEND CATEGORY_SKILLS TABLE (Benchmarks)
-- ============================================================================
-- Check if importance column exists, if not add it
ALTER TABLE category_skills
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_by INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure importance column exists with proper ENUM
-- If it doesn't exist, add it
ALTER TABLE category_skills
  MODIFY COLUMN importance ENUM('required', 'optional') DEFAULT 'optional';

-- Ensure weight column exists with default
ALTER TABLE category_skills
  MODIFY COLUMN weight FLOAT DEFAULT 1.0;

-- ============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
-- Index for active status filtering
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_skills_is_active ON skills(is_active);
CREATE INDEX IF NOT EXISTS idx_category_skills_is_active ON category_skills(is_active);

-- Index for skill domain filtering
CREATE INDEX IF NOT EXISTS idx_skills_domain ON skills(domain);

-- Index for normalized name searches
CREATE INDEX IF NOT EXISTS idx_skills_normalized_name ON skills(normalized_name);

-- ============================================================================
-- VERIFICATION QUERIES (Run after migration to verify)
-- ============================================================================
-- SELECT 'categories' as tbl, COUNT(*) as total, SUM(is_active) as active FROM categories
-- UNION ALL
-- SELECT 'skills', COUNT(*), SUM(is_active) FROM skills
-- UNION ALL  
-- SELECT 'category_skills', COUNT(*), SUM(is_active) FROM category_skills;
