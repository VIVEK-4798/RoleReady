-- ============================================================================
-- ROLE SELECTION & CHANGE IMPACT SYSTEM MIGRATION
-- ============================================================================
-- Purpose: Add fields to track role selection history and changes
-- 
-- TABLES MODIFIED:
-- - profile_info: Add target_role_set_at, target_role_set_by, previous_target_role
-- 
-- NEW TABLE:
-- - role_change_history: Track all role changes for a user
-- ============================================================================

-- ============================================================================
-- STEP 1: EXTEND PROFILE_INFO TABLE
-- ============================================================================

-- Add target_role_set_at column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "profile_info";
SET @columnname = "target_role_set_at";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TIMESTAMP DEFAULT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add target_role_set_by column if it doesn't exist (self, admin)
SET @columnname = "target_role_set_by";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " ENUM('self', 'admin') DEFAULT 'self'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================================================
-- STEP 2: CREATE ROLE CHANGE HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS role_change_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  previous_role_id INT DEFAULT NULL,
  new_role_id INT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by ENUM('self', 'admin') DEFAULT 'self',
  readiness_score_at_change FLOAT DEFAULT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_changed_at (changed_at),
  
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (previous_role_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (new_role_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'profile_info' AND column_name IN ('target_role_set_at', 'target_role_set_by');
-- DESCRIBE role_change_history;
