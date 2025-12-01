-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Storing plain text for now as requested
    role VARCHAR(20) DEFAULT 'family',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial users
-- Passwords are set to '12345678'
INSERT INTO users (username, password_hash, role) VALUES
('Don Falcone', '0634935384', 'admin'),
('Antone Snusone', '2KC2wjud_', 'member'),
('Dimone de Patrone', '0952012070', 'member'),
('Maxone Povarone', '26121968M@x', 'member'),
('Gast', '12345678', 'guest');
ON CONFLICT (username) DO NOTHING;

-- Example query to authenticate a user
-- SELECT * FROM users WHERE username = 'Don Falcone' AND password_hash = '12345678';

-- Example query to change a password
-- UPDATE users SET password_hash = 'new_password' WHERE username = 'Don Falcone';
