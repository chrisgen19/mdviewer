# Markdown Formatting Showcase

A comprehensive guide to all markdown formatting options.

## Text Formatting

This is **bold text** using double asterisks.

This is *italic text* using single asterisks.

This is `inline code` using backticks.

## Headers Hierarchy

# H1 - Main Title
## H2 - Section
### H3 - Subsection
#### H4 - Minor Heading

## Lists

### Unordered Lists

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
    - Deep nested item

### Ordered Lists

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Blockquotes

> This is a single-line quote.

> This is a multi-line quote.
> It continues on the next line.
> And provides wisdom.

> **Note:** You can use formatting inside blockquotes!

## Code Blocks

### JavaScript

```javascript
const greeting = 'Hello, World!';
console.log(greeting);

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Python

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
```

### Bash

```bash
#!/bin/bash

# Create directory structure
mkdir -p project/{src,tests,docs}

# Install dependencies
npm install express dotenv

# Run tests
npm test && npm run build
```

### JSON

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### YAML

```yaml
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql
volumes:
  db_data:
```

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Authentication | ✅ Done | High |
| Dashboard | 🚧 In Progress | High |
| Analytics | 📋 Planned | Medium |
| Export | 📋 Planned | Low |

### Complex Table

| Syntax | Description | Example |
|:-------|:------------|--------:|
| Header | Title | Here's this |
| Paragraph | Text | And more |
| **Bold** | Important | *Emphasis* |

## Links and Images

[Visit GitHub](https://github.com)

[Link with title](https://github.com "GitHub Homepage")

![Alt text for image](https://via.placeholder.com/150)

## Horizontal Rules

---

***

___

## Inline HTML (if supported)

<div style="background: linear-gradient(to right, #667eea, #764ba2); padding: 20px; border-radius: 8px; color: white;">
  <h3>Custom Styled Box</h3>
  <p>This is HTML inside markdown!</p>
</div>

## Escaping Characters

Use backslash to escape: \*not bold\* \`not code\`

## Special Characters

- Copyright: &copy;
- Trademark: &trade;
- Registered: &reg;
- Arrow: &rarr;
- Check: &#x2713;

## Emojis (if supported)

:smile: :heart: :fire: :rocket: :star:

## Mixed Content Example

### API Response Format

When you call the `/api/users` endpoint, you'll receive:

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

You can then process this with:

```javascript
const response = await fetch('/api/users');
const { data, meta } = await response.json();

data.users.forEach(user => {
  console.log(`${user.name} (${user.email})`);
});
```

> **Important:** Always check the `status` field before processing data!

## Nested Structures

1. **First Level**
   - Sub-item A
   - Sub-item B
     ```javascript
     const code = 'inside list';
     ```
   - Sub-item C

2. **Second Level**
   > Quote inside list

   - Another nested item

3. **Third Level**
   | Column 1 | Column 2 |
   |----------|----------|
   | Data 1   | Data 2   |

## Best Practices

- Keep lines under 80 characters when possible
- Use consistent indentation (2 or 4 spaces)
- Add blank lines between different elements
- Use semantic headings (don't skip levels)
- Test your markdown in different renderers

---

**Generated with MDView** - A modern markdown viewer
