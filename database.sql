CREATE DATABASE IF NOT EXISTS military_asset_system;
USE military_asset_system;

-- =========================
-- USERS (RBAC)
-- =========================
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','COMMANDER','LOGISTICS') NOT NULL,
  base_id INT
);

-- =========================
-- BASES
-- =========================
CREATE TABLE bases (
  base_id INT AUTO_INCREMENT PRIMARY KEY,
  base_name VARCHAR(100) NOT NULL
);

-- =========================
-- EQUIPMENT
-- =========================
CREATE TABLE equipment (
  equipment_id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_name VARCHAR(100),
  type VARCHAR(50)
);

-- =========================
-- PURCHASES
-- =========================
CREATE TABLE purchases (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  base_id INT,
  equipment_id INT,
  quantity INT,
  purchase_date DATE,
  FOREIGN KEY (base_id) REFERENCES bases(base_id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);

-- =========================
-- TRANSFERS
-- =========================
CREATE TABLE transfers (
  transfer_id INT AUTO_INCREMENT PRIMARY KEY,
  from_base INT,
  to_base INT,
  equipment_id INT,
  quantity INT,
  transfer_date DATE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);

-- =========================
-- ASSIGNMENTS & EXPENDITURE
-- =========================
CREATE TABLE assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  base_id INT,
  equipment_id INT,
  quantity INT,
  status ENUM('ASSIGNED','EXPENDED'),
  assignment_date DATE,
  FOREIGN KEY (base_id) REFERENCES bases(base_id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);

-- =========================
-- AUDIT LOGS
-- =========================
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100),
  user_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SEED DATA
-- =========================
INSERT INTO bases (base_name) VALUES ('Base Alpha'), ('Base Bravo');

INSERT INTO equipment (equipment_name, type)
VALUES ('Rifle', 'Weapon'), ('Tank', 'Vehicle'), ('Ammo Box', 'Ammunition');

INSERT INTO users (username, password, role, base_id)
VALUES
('admin', 'admin123', 'ADMIN', NULL),
('commander1', 'cmd123', 'COMMANDER', 1),
('logistics1', 'log123', 'LOGISTICS', 1);
