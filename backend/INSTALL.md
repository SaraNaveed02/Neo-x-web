# Nexura Backend — Installation & Setup Guide

Production-ready PHP + MySQL backend with MVC architecture, secure authentication, and Microsoft 365 integration.

---

## Requirements

- PHP 8.1+ (XAMPP recommended)
- MySQL 5.7+ / MariaDB 10.4+
- Apache with `mod_rewrite` (optional)
- OpenSSL extension enabled

---

## Quick Start (5 steps)

### 1. Copy environment file

```bash
copy backend\.env.example backend\.env
```

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_NAME=nexura_db
DB_USER=root
DB_PASS=

JWT_SECRET=your-long-random-secret-here
TOKEN_ENCRYPTION_KEY=minimum-32-characters-secret-key!!

APP_BASE_URL=http://localhost/time/backend
APP_ENV=local
APP_FORCE_HTTPS=false
```

### 2. Start XAMPP

- Apache → **Start**
- MySQL → **Start**

### 3. Install database

Open in browser:

```
http://localhost/time/backend/install.php
```

Click **Install Database Now**. This runs `database/nexura_complete.sql`.

**Default admin credentials:**

| Field    | Value           |
|----------|-----------------|
| Username | `admin`         |
| Password | `admin123`      |

> Password is stored as **bcrypt hash** in MySQL — never plain text.

### 4. Admin login

```
http://localhost/time/backend/admin/login.php
```

### 5. Verify API health

```
http://localhost/time/backend/api/health.php
```

---

## Database Schema

SQL file: `backend/database/nexura_complete.sql`

| Table                  | Purpose                              |
|------------------------|--------------------------------------|
| `users`                | Accounts (admin/client), bcrypt pwd  |
| `user_sessions`        | Server-side session tokens           |
| `login_history`        | Login audit trail                    |
| `activity_log`         | Signup/login/logout events           |
| `messages`             | Contact form messages                |
| `settings`             | App configuration key-value          |
| `services`             | Service catalog                      |
| `dashboard_stats`      | Admin dashboard counters             |
| `site_stats`           | Public site statistics               |
| `microsoft_connections`| Microsoft OAuth tokens (encrypted)   |
| `mail_messages`        | Synced Microsoft 365 emails          |

All tables use **InnoDB**, **utf8mb4**, foreign keys, and indexes.

---

## MVC Structure

```
backend/app/
├── Bootstrap.php           # Autoloader + .env + HTTPS redirect
├── Config/
│   ├── Env.php             # Environment variables
│   └── MicrosoftConfig.php
├── Core/
│   ├── Database.php        # PDO connection + error handling
│   ├── Validator.php       # Input validation
│   ├── AppException.php
│   └── HttpClient.php
├── Models/
│   ├── UserModel.php
│   ├── SessionModel.php
│   └── LoginHistoryModel.php
├── Services/
│   ├── AuthService.php     # Login, signup, logout logic
│   └── SessionService.php  # Secure PHP sessions
├── Controllers/
│   └── AuthController.php
└── Middleware/
    └── CsrfMiddleware.php
```

API entry points (`api/auth/*.php`) are thin wrappers that call controllers.

---

## Authentication API

### Client login

```http
POST /time/backend/api/auth/login.php
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Admin login

```http
POST /time/backend/api/auth/admin-login.php
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response includes JWT `token`, `user` object, and `csrf_token` (admin).

### Session check

```http
GET /time/backend/api/auth/session.php
Authorization: Bearer {jwt_token}
```

### Logout

```http
POST /time/backend/api/auth/logout.php
```

---

## Security Features

| Feature              | Implementation                          |
|----------------------|-----------------------------------------|
| SQL Injection        | PDO prepared statements                 |
| Password storage     | `password_hash()` bcrypt, cost 12       |
| CSRF                 | Token on admin mutations                |
| Input validation     | `App\Core\Validator`                    |
| Session security     | HttpOnly, SameSite=Lax, Secure in prod  |
| JWT                  | HS256 signed tokens                     |
| HTTPS                | `APP_FORCE_HTTPS=true` in production    |
| Secrets              | `.env` file (never commit to git)       |

---

## Production Checklist

1. Set `APP_ENV=production`
2. Set `APP_FORCE_HTTPS=true`
3. Change `JWT_SECRET` and `TOKEN_ENCRYPTION_KEY`
4. Change admin password after first login
5. Use strong MySQL password in `.env`
6. Restrict `install.php` after setup
