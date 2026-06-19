# NEOXWEB Backend — Poora folder (XAMPP)

Location: `c:\xampp\htdocs\time\backend\`

> **Zaroori:** Poora `backend` folder copy karein — sirf ek file nahi.  
> Frontend Netlify par hai; backend **XAMPP (PHP + MySQL)** par chalega.

---

## Quick start

1. XAMPP → **Apache + MySQL** ON
2. Browser: `http://localhost/time/backend/install.php` → **Install Database**
3. Login: `http://localhost/time/backend/`  
   - Username: **admin**  
   - Password: **admin123**
4. Messages inbox: `http://localhost/time/backend/admin/messages.php`

Database file: `backend/database/abv.sql`

---

## Main URLs

| URL | Kaam |
|-----|------|
| `/time/backend/` | Admin login |
| `/time/backend/install.php` | Database install |
| `/time/backend/api/health.php` | API check |
| `/time/backend/admin/messages.php` | Contact messages |
| `/time/backend/api/messages/create.php` | Contact form API (POST) |

---

## Folder structure (sari files)

```
backend/
├── index.php              ← Admin login (main entry)
├── install.php            ← Database installer
├── .htaccess
├── .env                   ← MySQL config (copy from .env.example)
├── .env.example
│
├── database/
│   ├── abv.sql            ← USE THIS (full DB + admin)
│   ├── abs.sql
│   └── db.sql
│
├── admin/                 ← Admin panel (PHP pages)
│   ├── login.php          → redirects to ../index.php
│   ├── messages.php       ← Inbox
│   ├── dashboard.php
│   ├── users.php
│   ├── settings.php
│   ├── assets/            ← CSS/JS
│   └── includes/
│
├── api/                   ← REST APIs (contact form, auth)
│   ├── health.php
│   ├── auth/
│   │   ├── admin-login.php
│   │   ├── login.php
│   │   └── signup.php
│   └── messages/
│       └── create.php
│
├── app/                   ← PHP MVC (controllers, models, services)
├── config/                ← database.php, constants
└── includes/              ← auth, JWT, helpers
```

**Total:** ~140 files — sab `time/backend/` folder ke andar hain.

---

## .env (MySQL)

```
DB_HOST=localhost
DB_NAME=nexura_db
DB_USER=root
DB_PASS=
```

---

## Frontend API link

Project folder: `c:\xampp\htdocs\time\project\`  
API auto: `http://localhost/time/backend/api` (jab site `/time/project/` se chale)

---

## Agar purana "NEOXWEB Backend" page dikhe

- `backend/index.html` delete ho chuka hai — sirf `index.php` use karein
- **Ctrl+F5** hard refresh
- Apache ON hona chahiye (PHP ke bina login page nahi chalega)
