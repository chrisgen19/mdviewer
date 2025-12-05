# Backend Development Examples

Examples of server-side code, databases, and APIs.

## PHP Backend

### Basic PHP Class

```php
<?php
class UserController {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    public function getUser($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function createUser($data) {
        $stmt = $this->db->prepare(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
        );

        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt->bind_param("sss", $data['name'], $data['email'], $hashedPassword);

        if ($stmt->execute()) {
            return $this->db->insert_id;
        }

        return false;
    }

    public function updateUser($id, $data) {
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }

        $values[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";

        $stmt = $this->db->prepare($sql);
        $types = str_repeat('s', count($values) - 1) . 'i';
        $stmt->bind_param($types, ...$values);

        return $stmt->execute();
    }
}

// Usage
$controller = new UserController($db);
$user = $controller->getUser(1);
echo json_encode($user);
?>
```

## Node.js Express API

```javascript
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myapp',
    waitForConnections: true,
    connectionLimit: 10
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication Middleware
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Routes
app.get('/api/users', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## Python Flask API

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SECRET_KEY'] = 'your-secret-key'
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

# Routes
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()

    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])

        return jsonify({'token': token})

    return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)
```

## SQL Database Examples

### MySQL Schema

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'guest') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Posts Table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Comments Table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Complex Queries

```sql
-- Join with Aggregation
SELECT
    u.id,
    u.username,
    u.email,
    COUNT(p.id) as post_count,
    AVG(c.id) as avg_comments
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE u.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.username, u.email
HAVING post_count > 0
ORDER BY post_count DESC
LIMIT 10;

-- Subquery Example
SELECT
    p.*,
    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
FROM posts p
WHERE p.user_id IN (
    SELECT id FROM users WHERE role = 'admin'
);

-- Window Functions
SELECT
    username,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num,
    RANK() OVER (ORDER BY created_at) as rank_num
FROM users;
```

## Project Structure

```
backend-project/
├── src/
│   ├── controllers/
│   │   ├── UserController.js
│   │   ├── PostController.js
│   │   └── AuthController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── tests/
│   ├── unit/
│   └── integration/
├── config/
│   ├── database.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Best Practices

1. **Security**
   - Always hash passwords
   - Use prepared statements to prevent SQL injection
   - Implement rate limiting
   - Validate and sanitize user input

2. **Performance**
   - Use database indexes
   - Implement caching (Redis)
   - Optimize queries
   - Use connection pooling

3. **Code Organization**
   - Follow MVC pattern
   - Keep routes thin, controllers fat
   - Use middleware for cross-cutting concerns
   - Implement proper error handling
