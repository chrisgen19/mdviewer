# Project Architecture & File Structures

Different project structures for various frameworks and architectures.

## Full-Stack MERN Application

```
mern-app/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── dashboard/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Stats.jsx
│   │   │       └── UserTable.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Profile.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   └── useLocalStorage.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.service.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── postController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Comment.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── post.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── config/
│   │   │   ├── db.config.js
│   │   │   └── jwt.config.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── emailService.js
│   │   └── server.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   └── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Next.js 13+ App Directory Structure

```
nextjs-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── error.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── posts/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── error.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   └── UserForm.tsx
│   └── layouts/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   └── useAuth.ts
├── types/
│   ├── user.ts
│   └── post.ts
├── public/
│   ├── images/
│   └── icons/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Microservices Architecture

```
microservices-app/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── app.js
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── app.js
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── post-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── notification-service/
│       ├── src/
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
├── gateway/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── gateway.js
│   ├── Dockerfile
│   └── package.json
├── shared/
│   ├── utils/
│   ├── types/
│   └── constants/
├── infrastructure/
│   ├── kubernetes/
│   │   ├── deployments/
│   │   ├── services/
│   │   └── ingress/
│   └── terraform/
├── docker-compose.yml
└── README.md
```

## Laravel PHP Project

```
laravel-app/
├── app/
│   ├── Console/
│   │   └── Commands/
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   └── UserController.php
│   │   │   └── Web/
│   │   │       └── HomeController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   └── CheckRole.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   └── RegisterRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       └── PostResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Post.php
│   │   └── Comment.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── AuthServiceProvider.php
│   └── Services/
│       ├── UserService.php
│       └── EmailService.php
├── bootstrap/
│   └── app.php
├── config/
│   ├── app.php
│   ├── database.php
│   └── auth.php
├── database/
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── 2024_01_01_create_users_table.php
│   │   └── 2024_01_02_create_posts_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── public/
│   ├── index.php
│   ├── css/
│   └── js/
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   └── app.blade.php
│   │   ├── auth/
│   │   │   ├── login.blade.php
│   │   │   └── register.blade.php
│   │   └── home.blade.php
│   ├── css/
│   └── js/
├── routes/
│   ├── web.php
│   ├── api.php
│   └── console.php
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
├── tests/
│   ├── Feature/
│   └── Unit/
├── .env
├── artisan
├── composer.json
└── phpunit.xml
```

## Django Project Structure

```
django-project/
├── project_name/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── serializers.py
│   │   └── tests.py
│   ├── posts/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   └── api/
│       ├── __init__.py
│       ├── views.py
│       └── urls.py
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── media/
│   └── uploads/
├── templates/
│   ├── base.html
│   ├── home.html
│   └── partials/
├── tests/
│   ├── unit/
│   └── integration/
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── manage.py
├── .env
└── README.md
```

## Key Architectural Patterns

### MVC (Model-View-Controller)
```
├── models/          # Data layer
├── views/           # Presentation layer
└── controllers/     # Business logic
```

### Clean Architecture
```
├── domain/          # Business entities
├── application/     # Use cases
├── infrastructure/  # External dependencies
└── presentation/    # UI layer
```

### Hexagonal Architecture
```
├── core/            # Domain logic
├── ports/           # Interfaces
└── adapters/        # Implementations
```
