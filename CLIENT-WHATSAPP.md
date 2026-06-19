# Nexura — Client ko WhatsApp par kaise dein

## Step 1: ZIP file banao

PowerShell kholo aur yeh command chalao:

```powershell
cd C:\xampp\htdocs\time
.\pack-for-client.ps1
```

File banegi: **`C:\xampp\htdocs\nexura-client.zip`**

(Is mein frontend + backend dono hain — `project` + `backend` + database file)

---

## Step 2: WhatsApp par bhejne ke 3 tareeqe

### Option A — Google Drive (best, recommended)

1. https://drive.google.com par jao
2. `nexura-client.zip` upload karo
3. Right click → **Share** → **Anyone with the link**
4. Link copy karo
5. WhatsApp par client ko yeh message bhejo (neeche template)

**Kyun?** WhatsApp ki file limit ~100MB hai, ZIP bari ho sakti hai. Drive safe hai.

---

### Option B — WhatsApp direct file

1. `nexura-client.zip` ko chhota rakho (script node_modules hata deti hai)
2. Agar ZIP **50MB se chhoti** ho → WhatsApp → Attach → Document
3. Saath mein `CLIENT-CREDENTIALS.txt` alag message mein bhejo (password)

---

### Option C — WeTransfer (free)

1. https://wetransfer.com
2. ZIP upload → client ka email / link WhatsApp par bhejo

---

## Step 3: WhatsApp message (copy-paste karo)

```
Assalam o Alaikum!

Aapki Nexura website + admin panel ready hai.

📦 DOWNLOAD (poora project):
[PASTE GOOGLE DRIVE LINK YAHAN]

📱 MOBILE APP (phone par):
Browser mein kholo → "Install" / "Add to Home Screen"

🖥️ LOCAL SETUP (computer par test):
1. XAMPP install karein (Apache + MySQL)
2. ZIP ko C:\xampp\htdocs\time folder mein extract karein
3. Browser: http://localhost/time/backend/install.php → Install
4. Website: http://localhost/time/project/index.html
5. Mobile App: http://localhost/time/project/app.html

🔐 ADMIN LOGIN (alag secure message mein bhejein):
URL: http://localhost/time/backend/admin/login.php
Username: admin
Password: [APNA PASSWORD]

📋 CREDENTIALS file ZIP ke andar CLIENT-CREDENTIALS.txt mein bhi hai.

Koi masla ho to contact karein.
Shukriya!
```

---

## Step 4: Password alag bhejein (security)

Admin password **kabhi ZIP ke saath public link par mat likho**.

Pehle ZIP link bhejo → phir 2 minute baad alag WhatsApp message:

```
Admin login:
Username: admin
Password: admin123
(Pehle login ke baad password change kar lein)
```

---

## Client ke liye — project structure

```
time/
├── project/          ← FRONTEND (website + mobile app)
│   ├── index.html
│   ├── app.html      ← Mobile app
│   └── ...
├── backend/          ← BACKEND (API + admin)
│   ├── admin/
│   ├── api/
│   └── database/db.sql
├── robots.txt        ← SEO
├── sitemap.xml       ← SEO
└── CLIENT-CREDENTIALS.txt
```

---

## Live hosting (internet par) ke liye

Client ko hosting chahiye (cPanel / Hostinger / etc.):

1. ZIP upload → `public_html/time/` ya root
2. MySQL database banao → `db.sql` import
3. `backend/config/database.php` mein DB details update
4. Domain par SSL (HTTPS) lagao
5. Google Search Console → sitemap submit: `https://domain.com/time/sitemap.xml`

---

## SEO + Mobile — kya included hai

| Feature | File |
|---------|------|
| Google sitemap | `/time/sitemap.xml` |
| robots.txt | `/time/robots.txt` |
| Mobile app PWA | `project/app.html` + `manifest.json` |
| Mobile bottom nav | Auto sab pages par |
| Meta tags / canonical | `project/js/seo-mobile.js` |

---

## Aap ke liye quick links (demo)

| Page | URL |
|------|-----|
| Website | http://localhost/time/project/index.html |
| Mobile App | http://localhost/time/project/app.html |
| Admin | http://localhost/time/backend/admin/login.php |
| Install DB | http://localhost/time/backend/install.php |
