-- ============================================
-- Système de Présence par Reconnaissance Faciale
-- Base de données PostgreSQL
-- ============================================

-- Supprimer les tables existantes (ordre inverse des dépendances)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS training_images CASCADE;
DROP TABLE IF EXISTS student_logins CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================
-- 1. Table roles
-- ============================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL CHECK (role_name IN ('admin', 'prof', 'student'))
);

-- Insertion des rôles par défaut
INSERT INTO roles (role_name) VALUES ('admin'), ('prof'), ('student');

-- ============================================
-- 2. Table users (pour admin et professeurs)
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role_id ON users(role_id);

-- ============================================
-- 3. Table students
-- ============================================
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    enrollment_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_enrollment ON students(enrollment_number);

-- ============================================
-- 4. Table student_logins
-- ============================================
CREATE TABLE student_logins (
    login_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE INDEX idx_student_logins_username ON student_logins(username);
CREATE INDEX idx_student_logins_student_id ON student_logins(student_id);

-- ============================================
-- 5. Table training_images
-- ============================================
CREATE TABLE training_images (
    image_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE INDEX idx_training_images_student_id ON training_images(student_id);

-- ============================================
-- 6. Table courses
-- ============================================
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    prof_id INTEGER NOT NULL,
    description TEXT,
    credits INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (prof_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE INDEX idx_courses_prof_id ON courses(prof_id);
CREATE INDEX idx_courses_code ON courses(course_code);

-- ============================================
-- 7. Table sessions
-- ============================================
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

CREATE INDEX idx_sessions_course_id ON sessions(course_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);

-- ============================================
-- 8. Table attendance
-- ============================================
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Présent', 'Absent')),
    detection_method VARCHAR(50) DEFAULT 'facial_recognition',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    UNIQUE (student_id, session_id)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_session_id ON attendance(session_id);
CREATE INDEX idx_attendance_status ON attendance(status);

-- ============================================
-- 9. Table logs
-- ============================================
CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_action ON logs(action);

-- ============================================
-- 10. Table notifications
-- ============================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message VARCHAR(500) NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'info',
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);

-- ============================================
-- Table de liaison : course_enrollments
-- (Pour gérer l'inscription des étudiants aux cours)
-- ============================================
CREATE TABLE course_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

CREATE INDEX idx_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);

-- ============================================
-- Vues utiles
-- ============================================

-- Vue pour les statistiques de présence par étudiant
CREATE VIEW student_attendance_stats AS
SELECT 
    s.student_id,
    s.full_name,
    s.email,
    COUNT(a.attendance_id) as total_sessions,
    SUM(CASE WHEN a.status = 'Présent' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
    ROUND(
        (SUM(CASE WHEN a.status = 'Présent' THEN 1 ELSE 0 END)::NUMERIC / 
         NULLIF(COUNT(a.attendance_id), 0) * 100), 2
    ) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.student_id = a.student_id
GROUP BY s.student_id, s.full_name, s.email;

-- Vue pour les sessions avec informations complètes
CREATE VIEW session_details AS
SELECT 
    ses.session_id,
    ses.session_date,
    ses.start_time,
    ses.end_time,
    ses.location,
    c.course_name,
    c.course_code,
    u.full_name as professor_name,
    COUNT(DISTINCT a.student_id) as students_present
FROM sessions ses
JOIN courses c ON ses.course_id = c.course_id
JOIN users u ON c.prof_id = u.user_id
LEFT JOIN attendance a ON ses.session_id = a.session_id AND a.status = 'Présent'
GROUP BY ses.session_id, ses.session_date, ses.start_time, ses.end_time, 
         ses.location, c.course_name, c.course_code, u.full_name;

-- ============================================
-- Données de test (optionnel)
-- ============================================

-- Admin par défaut (mot de passe: admin123)
INSERT INTO users (username, password_hash, full_name, role_id) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeQCyQfOuWaW', 'Administrateur', 1);

-- Professeur de test (mot de passe: prof123)
INSERT INTO users (username, password_hash, full_name, role_id) 
VALUES ('prof.martin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeQCyQfOuWaW', 'Prof. Martin Dubois', 2);

-- Cours de test
INSERT INTO courses (course_name, course_code, prof_id, description, credits) 
VALUES ('Base de Données Avancées', 'BD101', 2, 'Cours sur PostgreSQL et NoSQL', 4);

-- ============================================
-- Fonctions utiles
-- ============================================

-- Fonction pour marquer automatiquement les absents
CREATE OR REPLACE FUNCTION mark_absent_students(p_session_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    absent_count INTEGER;
BEGIN
    -- Marquer comme absent tous les étudiants inscrits qui ne sont pas présents
    INSERT INTO attendance (student_id, session_id, status, confidence)
    SELECT 
        ce.student_id,
        p_session_id,
        'Absent',
        0.0
    FROM course_enrollments ce
    JOIN sessions ses ON ce.course_id = ses.course_id
    WHERE ses.session_id = p_session_id
    AND NOT EXISTS (
        SELECT 1 FROM attendance a 
        WHERE a.student_id = ce.student_id 
        AND a.session_id = p_session_id
    );
    
    GET DIAGNOSTICS absent_count = ROW_COUNT;
    RETURN absent_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le taux de présence d'un étudiant
CREATE OR REPLACE FUNCTION get_student_attendance_rate(p_student_id INTEGER)
RETURNS FLOAT AS $$
DECLARE
    attendance_rate FLOAT;
BEGIN
    SELECT 
        COALESCE(
            ROUND(
                (SUM(CASE WHEN status = 'Présent' THEN 1 ELSE 0 END)::FLOAT / 
                 NULLIF(COUNT(*), 0) * 100), 2
            ), 0.0
        ) INTO attendance_rate
    FROM attendance
    WHERE student_id = p_student_id;
    
    RETURN attendance_rate;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers
-- ============================================

-- Trigger pour logger les connexions
CREATE OR REPLACE FUNCTION log_user_login()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs (user_id, action, details)
    VALUES (NEW.user_id, 'LOGIN', 'User logged in');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour marquer les notifications comme lues
CREATE OR REPLACE FUNCTION update_notification_read_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.read_status = TRUE AND OLD.read_status = FALSE THEN
        NEW.read_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notification_read
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_notification_read_time();

-- ============================================
-- Permissions (à adapter selon vos besoins)
-- ============================================

-- Créer les rôles PostgreSQL si nécessaire
-- CREATE ROLE app_admin WITH LOGIN PASSWORD 'your_secure_password';
-- CREATE ROLE app_user WITH LOGIN PASSWORD 'your_secure_password';

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;

COMMENT ON TABLE roles IS 'Table des rôles utilisateurs (admin, prof, student)';
COMMENT ON TABLE users IS 'Table des utilisateurs (admin et professeurs)';
COMMENT ON TABLE students IS 'Table des étudiants';
COMMENT ON TABLE student_logins IS 'Table des identifiants de connexion des étudiants';
COMMENT ON TABLE training_images IS 'Table des images d\'entraînement pour la reconnaissance faciale';
COMMENT ON TABLE courses IS 'Table des cours';
COMMENT ON TABLE sessions IS 'Table des séances de cours';
COMMENT ON TABLE attendance IS 'Table de présence';
COMMENT ON TABLE logs IS 'Table des logs système';
COMMENT ON TABLE notifications IS 'Table des notifications utilisateurs';
COMMENT ON TABLE course_enrollments IS 'Table d\'inscription des étudiants aux cours';
