# Nexura — Full Stack Application

Modern web application with JWT auth, REST API, MySQL database, Tailwind admin panel, and Socket.io realtime updates.

## Stack

- **Frontend:** HTML + Tailwind CSS + Vanilla JS (`/project`)
- **Backend:** PHP REST API (`/backend/api`)
- **Database:** MySQL `nexura_db`
- **Realtime:** Node.js + Socket.io (`/realtime` on port 3001)

## Setup

### 1. Database (XAMPP MySQL)
Visit or run:
```
http://localhost/time/backend/database/setup.php
```

### 2. Realtime Server
```bash
cd realtime
npm install
npm start
```

### 3. URLs
| App | URL |
|-----|-----|
| Frontend | http://localhost/time/project/ |
| Contact | http://localhost/time/project/contact.html |
| Login | http://localhost/time/project/login.html |
| Admin | http://localhost/time/backend/admin/login.php |
| API Docs | http://localhost/time/backend/api/index.php |

### Admin Credentials
- Email: `admin@example.com`
- Password: `admin123`

## Features

- JWT authentication (signup, login, protected routes)
- Login history tracking
- Activity log + dashboard stats cache
- Real-time dashboard updates (signup, login, messages)
- Admin: users, messages, login history, services, settings
- Mobile-responsive Tailwind admin UI

## API Authentication

```http
Authorization: Bearer <jwt_token>
```

Tokens are returned from `POST /api/auth/login.php` and `POST /api/auth/signup.php`.
