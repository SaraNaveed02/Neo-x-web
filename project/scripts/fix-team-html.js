const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'team.html');
let content = fs.readFileSync(file, 'utf8');
const mainEnd = '    </main>';
const mainIdx = content.indexOf(mainEnd);
const footerMarker = '<footer class="site-footer site-footer--pro"';
const footerIdx = content.lastIndexOf(footerMarker);

if (mainIdx === -1 || footerIdx <= mainIdx) {
  console.error('Could not locate main/footer boundaries');
  process.exit(1);
}

content =
  content.slice(0, mainIdx + mainEnd.length) +
  '\n\n' +
  content.slice(footerIdx);

fs.writeFileSync(file, content, 'utf8');
console.log('team.html fixed');
