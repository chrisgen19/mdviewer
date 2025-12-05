# Frontend Development Examples

This document showcases various frontend code examples and formatting.

## HTML Structure

Here's a basic HTML5 template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <h1>Welcome to My Site</h1>
            <p>This is a modern web application.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 My Web App</p>
    </footer>

    <script src="app.js"></script>
</body>
</html>
```

## CSS Styling

Modern CSS with Flexbox and Grid:

```css
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --text-color: #1f2937;
    --bg-color: #ffffff;
}

/* Navbar Styling */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.navbar ul {
    display: flex;
    gap: 2rem;
    list-style: none;
}

/* Grid Layout */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

/* Card Component */
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
    }
}
```

## JavaScript (ES6+)

Modern JavaScript patterns:

```javascript
// Class-based Component
class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.loadTodos();
        this.attachEventListeners();
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.render();
        } catch (error) {
            console.error('Failed to load todos:', error);
        }
    }

    addTodo(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        this.render();
    }

    render() {
        const container = document.getElementById('todo-list');
        container.innerHTML = this.todos
            .map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span>${todo.text}</span>
                </div>
            `)
            .join('');
    }
}

// Arrow Functions & Destructuring
const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
];

const activeUsers = users
    .filter(({ age }) => age >= 30)
    .map(({ name, age }) => ({ name, age }));

// Async/Await Pattern
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('User not found');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

## React Component

```jsx
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profile-card">
            <img src={user.avatar} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.bio}</p>
            <button onClick={() => alert('Follow clicked!')}>
                Follow
            </button>
        </div>
    );
};

export default UserProfile;
```

## TypeScript

```typescript
// Interface Definition
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
}

// Generic Function
function fetchData<T>(url: string): Promise<T> {
    return fetch(url).then(response => response.json());
}

// Type Guards
function isAdmin(user: User): user is User & { role: 'admin' } {
    return user.role === 'admin';
}

// Usage
const user = await fetchData<User>('/api/user/1');
if (isAdmin(user)) {
    console.log('Admin access granted');
}
```

## Key Concepts

- **Modern ES6+ Features**: Arrow functions, destructuring, async/await
- **Component-Based Architecture**: Reusable and maintainable code
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Type Safety**: TypeScript for better developer experience

> **Pro Tip**: Always validate user input and handle errors gracefully in production applications.
