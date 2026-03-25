USE xtb_pro;

CREATE TABLE IF NOT EXISTS login_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  login_type VARCHAR(20) NOT NULL,
  admin_user_id BIGINT DEFAULT NULL,
  app_user_id BIGINT DEFAULT NULL,
  username VARCHAR(50) DEFAULT NULL,
  role VARCHAR(30) DEFAULT NULL,
  login_status TINYINT NOT NULL DEFAULT 1,
  ip VARCHAR(64) DEFAULT NULL,
  country_name VARCHAR(100) DEFAULT NULL,
  region_name VARCHAR(100) DEFAULT NULL,
  city_name VARCHAR(100) DEFAULT NULL,
  org_name VARCHAR(150) DEFAULT NULL,
  location_text VARCHAR(255) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  message VARCHAR(255) DEFAULT NULL,
  login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_login_log_type (login_type),
  KEY idx_login_log_admin_user (admin_user_id),
  KEY idx_login_log_app_user (app_user_id),
  KEY idx_login_log_login_at (login_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

