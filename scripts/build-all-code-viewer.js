/**
 * One HTML page — all frontend + backend source as plain text (not rendered)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(process.env.USERPROFILE || '', 'Desktop', 'NEOXWEB-Code', 'NEOXWEB-ALL-CODE.html');

const SOURCES = [
    { label: 'frontend', dir: path.join(ROOT, 'project') },
    { label: 'backend', dir: path.join(ROOT, 'backend') },
    { label: 'root', dir: ROOT, filesOnly: ['db.sql', 'CLIENT-CREDENTIALS.txt', 'README.md'] }
];

const EXT = new Set([
    '.html', '.css', '.js', '.php', '.json', '.sql', '.md', '.txt',
    '.toml', '.svg', '.xml', '_redirects'
]);

const SKIP_DIRS = new Set(['node_modules', '.git', '.venv', 'terminals', 'scripts']);

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function shouldInclude(filePath, base) {
    const rel = path.relative(base, filePath).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.some((p) => SKIP_DIRS.has(p))) return false;
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath);
    if (baseName === '_redirects') return true;
    if (!EXT.has(ext)) return false;
    if (ext === '.json' && rel.includes('node_modules')) return false;
    return true;
}

function walkDir(dir, base, list) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const st = fs.statSync(full);
        if (st.isDirectory()) {
            if (SKIP_DIRS.has(name)) continue;
            walkDir(full, base, list);
        } else if (shouldInclude(full, base)) {
            list.push({
                rel: path.relative(base, full).replace(/\\/g, '/'),
                full
            });
        }
    }
}

function collectFiles() {
    const all = [];
    for (const src of SOURCES) {
        if (src.filesOnly) {
            for (const f of src.filesOnly) {
                const full = path.join(src.dir, f);
                if (fs.existsSync(full)) {
                    all.push({ group: src.label, rel: f, full });
                }
            }
            continue;
        }
        const list = [];
        walkDir(src.dir, src.dir, list);
        for (const item of list) {
            all.push({ group: src.label, rel: `${src.label}/${item.rel}`, full: item.full });
        }
    }
    all.sort((a, b) => a.rel.localeCompare(b.rel));
    return all;
}

function build() {
    const files = collectFiles();
    const sections = files.map((f, i) => {
        let content;
        try {
            content = fs.readFileSync(f.full, 'utf8');
        } catch {
            content = '(could not read file)';
        }
        const id = `file-${i}`;
        const lines = content.split('\n').length;
        return `
<section class="file-block" id="${id}">
  <div class="file-head">
    <h2>${escapeHtml(f.rel)}</h2>
    <span class="meta">${lines} lines</span>
    <button type="button" class="copy-btn" data-target="${id}-code">Copy this file</button>
  </div>
  <pre class="code" id="${id}-code">${escapeHtml(content)}</pre>
</section>`;
    }).join('\n');

    const toc = files.map((f, i) =>
        `<a href="#file-${i}">${escapeHtml(f.rel)}</a>`
    ).join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NEOXWEB — All Source Code (${files.length} files)</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Consolas, 'Courier New', monospace;
  background: #0d1117;
  color: #c9d1d9;
  font-size: 13px;
  line-height: 1.45;
}
.top {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 1rem 1.25rem;
}
.top h1 { margin: 0 0 0.35rem; font-size: 1.15rem; color: #58a6ff; font-family: system-ui, sans-serif; }
.top p { margin: 0 0 0.75rem; color: #8b949e; font-family: system-ui, sans-serif; font-size: 0.85rem; }
.top-btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.top-btns button {
  padding: 0.5rem 1rem;
  border: 1px solid #238636;
  background: #238636;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-family: system-ui, sans-serif;
}
.top-btns button.secondary { background: #21262d; border-color: #30363d; color: #c9d1d9; }
.layout { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 120px); }
@media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .toc { max-height: 200px; } }
.toc {
  position: sticky;
  top: 100px;
  align-self: start;
  max-height: calc(100vh - 110px);
  overflow: auto;
  padding: 1rem;
  border-right: 1px solid #30363d;
  background: #0d1117;
}
.toc strong { display: block; margin-bottom: 0.5rem; color: #8b949e; font-size: 0.75rem; text-transform: uppercase; }
.toc a {
  display: block;
  padding: 0.25rem 0;
  color: #58a6ff;
  text-decoration: none;
  font-size: 0.78rem;
  word-break: break-all;
}
.toc a:hover { text-decoration: underline; }
.main { padding: 1rem 1.25rem 3rem; }
.file-block { margin-bottom: 2.5rem; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; }
.file-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}
.file-head h2 { margin: 0; font-size: 0.95rem; color: #7ee787; flex: 1; min-width: 200px; }
.file-head .meta { color: #8b949e; font-size: 0.75rem; }
.copy-btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  border-radius: 6px;
  cursor: pointer;
}
.copy-btn:hover { background: #30363d; }
pre.code {
  margin: 0;
  padding: 1rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: #0d1117;
  color: #e6edf3;
  max-height: none;
}
.note {
  margin: 1rem 1.25rem;
  padding: 0.85rem 1rem;
  background: #1c2128;
  border: 1px solid #388bfd;
  border-radius: 8px;
  color: #79c0ff;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
}
</style>
</head>
<body>
<div class="top">
  <h1>NEOXWEB — Full Source Code</h1>
  <p>${files.length} files · Frontend + Backend · Plain text only (website render nahi hoti)</p>
  <div class="top-btns">
    <button type="button" id="copyAll">Copy ALL code</button>
    <button type="button" class="secondary" id="expandAll">Show all files</button>
  </div>
</div>
<p class="note">Yeh page sirf CODE dikhati hai — browser website ki tarah open nahi karega. Har file ke neeche &quot;Copy this file&quot; ya upar &quot;Copy ALL code&quot; use karo.</p>
<div class="layout">
  <nav class="toc"><strong>Files</strong>${toc}</nav>
  <main class="main">${sections}</main>
</div>
<script>
document.querySelectorAll('.copy-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var el = document.getElementById(btn.getAttribute('data-target'));
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(function() {
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = 'Copy this file'; }, 2000);
    });
  });
});
document.getElementById('copyAll').addEventListener('click', function() {
  var parts = [];
  document.querySelectorAll('pre.code').forEach(function(pre) {
    var h = pre.closest('.file-block').querySelector('h2');
    parts.push('\\n\\n========== ' + (h ? h.textContent : '') + ' ==========\\n\\n' + pre.textContent);
  });
  navigator.clipboard.writeText(parts.join('')).then(function() {
    var b = document.getElementById('copyAll');
    b.textContent = 'All copied!';
    setTimeout(function() { b.textContent = 'Copy ALL code'; }, 2500);
  });
});
document.getElementById('expandAll').addEventListener('click', function() {
  window.scrollTo(0, 0);
});
</script>
</body>
</html>`;

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, html, 'utf8');
    const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
    console.log(`Written: ${OUT}`);
    console.log(`Files: ${files.length}, Size: ${mb} MB`);
}

build();
