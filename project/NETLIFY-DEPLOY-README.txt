NEOXWEB — Netlify Deploy (404 fix)
==================================

404 aata hai jab GALAT folder upload hota hai.

SAHI TAREEQA (choose one):
--------------------------

A) Drag & Drop (easiest)
   1. Netlify.com → Sites → Add new site → Deploy manually
   2. Is folder ko drag karo:  project
      (andar index.html, css/, js/ hon — frontend/ ya backend/ NAHI)
   3. Deploy complete → site URL kholo

B) Desktop ZIP use karo
   1. NEOXWEB-Netlify-Deploy.zip download karo
   2. Extract karo
   3. Andar jo files hain (index.html top par) — un sab ko Netlify par drag karo
      POORA extracted folder mat — sirf andar ki files/folders

C) Git connect
   Netlify → Site settings → Build & deploy:
   Base directory:  project
   Publish directory: .

GALAT (404 hoga):
-----------------
❌ NEOXWEB-FULL-CODE.zip poora (frontend/backend subfolders)
❌ time folder poora (project andar hai)
❌ sirf frontend folder bina extract
❌ backend folder frontend ki jagah

Test after deploy:
   https://YOUR-SITE.netlify.app/
   https://YOUR-SITE.netlify.app/about.html
