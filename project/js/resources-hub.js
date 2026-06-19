(function () {
    'use strict';

    var RESOURCES = [
        { title: 'MDN Web Docs', description: 'The most comprehensive documentation for HTML, CSS, JavaScript, and web APIs. Maintained by Mozilla.', category: 'Web Development', url: 'https://developer.mozilla.org', tags: ['HTML', 'CSS', 'JavaScript', 'Docs'] },
        { title: 'freeCodeCamp', description: 'Learn to code for free with thousands of interactive lessons and projects. Full-stack web development certification.', category: 'Web Development', url: 'https://www.freecodecamp.org', tags: ['Courses', 'Interactive', 'Free'] },
        { title: 'The Odin Project', description: 'A free, open-source full-stack curriculum covering Ruby on Rails, JavaScript, React, Node.js, and more.', category: 'Web Development', url: 'https://www.theodinproject.com', tags: ['Full Stack', 'Free', 'Curriculum'] },
        { title: 'Frontend Mentor', description: 'Real-world frontend challenges to improve your HTML, CSS, and JavaScript skills with professional designs.', category: 'Web Development', url: 'https://www.frontendmentor.io', tags: ['Practice', 'Challenges', 'Frontend'] },
        { title: 'CSS Tricks', description: 'Articles, guides, and tips about CSS, frontend development, and modern web design techniques.', category: 'Web Development', url: 'https://css-tricks.com', tags: ['CSS', 'Articles', 'Guides'] },
        { title: 'Stack Overflow', description: 'The largest Q&A community for developers. Get help with coding problems and debugging.', category: 'Web Development', url: 'https://stackoverflow.com', tags: ['Q&A', 'Community', 'Help'] },
        { title: 'Android Developers (Google)', description: 'Official documentation for Android app development with Kotlin and Java. Includes codelabs and best practices.', category: 'App Development', url: 'https://developer.android.com', tags: ['Android', 'Kotlin', 'Java', 'Official'] },
        { title: 'Apple Developer Documentation', description: 'Official iOS and macOS development resources using Swift, SwiftUI, and UIKit from Apple.', category: 'App Development', url: 'https://developer.apple.com', tags: ['iOS', 'Swift', 'SwiftUI', 'Official'] },
        { title: 'Flutter Documentation', description: "Build cross-platform apps for iOS, Android, web, and desktop using Google's Flutter framework and Dart language.", category: 'App Development', url: 'https://flutter.dev', tags: ['Flutter', 'Dart', 'Cross-Platform'] },
        { title: 'React Native', description: 'Build native mobile apps using React and JavaScript. Official documentation and guides from Meta.', category: 'App Development', url: 'https://reactnative.dev', tags: ['React Native', 'JavaScript', 'Mobile'] },
        { title: 'Kotlin Docs', description: 'Official documentation for Kotlin programming language – the modern choice for Android development.', category: 'App Development', url: 'https://kotlinlang.org', tags: ['Kotlin', 'Android', 'Language'] },
        { title: 'Swift.org', description: 'Official Swift programming language resources, documentation, and community guides.', category: 'App Development', url: 'https://swift.org', tags: ['Swift', 'iOS', 'Language'] },
        { title: 'Node.js Official Docs', description: 'Complete documentation for Node.js runtime environment for building scalable backend applications.', category: 'Backend', url: 'https://nodejs.org/en/docs/', tags: ['Node.js', 'Backend', 'JavaScript'] },
        { title: 'MongoDB University', description: 'Free courses and documentation for MongoDB – the leading NoSQL database.', category: 'Database', url: 'https://university.mongodb.com', tags: ['MongoDB', 'NoSQL', 'Free Courses'] },
        { title: 'PostgreSQL Docs', description: 'Comprehensive official documentation for PostgreSQL – powerful open-source relational database.', category: 'Database', url: 'https://www.postgresql.org/docs/', tags: ['PostgreSQL', 'SQL', 'Database'] },
        { title: 'Firebase Documentation', description: "Google's mobile and web app development platform with authentication, database, storage, and hosting.", category: 'Backend', url: 'https://firebase.google.com/docs', tags: ['Firebase', 'Backend', 'BaaS'] },
        { title: 'Figma', description: 'Free, powerful design tool for UI/UX prototyping, collaboration, and design systems.', category: 'Design', url: 'https://figma.com', tags: ['UI', 'UX', 'Design', 'Prototyping'] },
        { title: 'Dribbble', description: 'Explore millions of design inspirations for websites, mobile apps, and UI components.', category: 'Design', url: 'https://dribbble.com', tags: ['Inspiration', 'UI', 'Portfolio'] },
        { title: 'Adobe Color', description: 'Create and explore color palettes, extract gradients, and check color contrast for accessibility.', category: 'Design', url: 'https://color.adobe.com', tags: ['Colors', 'Palette', 'Accessibility'] },
        { title: 'GitHub', description: 'Version control hosting platform with collaboration tools, CI/CD, and project management.', category: 'Tools', url: 'https://github.com', tags: ['Git', 'Version Control', 'Collaboration'] },
        { title: 'Docker Documentation', description: 'Learn containerization and create reproducible development environments with Docker.', category: 'DevOps', url: 'https://docs.docker.com', tags: ['Docker', 'Containers', 'DevOps'] },
        { title: 'Vercel', description: 'Deploy frontend applications instantly with automatic SSL, global CDN, and serverless functions.', category: 'Hosting', url: 'https://vercel.com', tags: ['Hosting', 'Deployment', 'Frontend'] },
        { title: 'Netlify', description: 'Modern web hosting platform with continuous deployment from Git, forms, and functions.', category: 'Hosting', url: 'https://netlify.com', tags: ['Hosting', 'JAMstack', 'Deployment'] }
    ];

    var FILTERS = [
        { id: 'all', label: 'All Resources' },
        { id: 'Web Development', label: '🌐 Web Development' },
        { id: 'App Development', label: '📱 App Development' },
        { id: 'Backend', label: '⚙️ Backend' },
        { id: 'Database', label: '🗄️ Database' },
        { id: 'Design', label: '🎨 Design' },
        { id: 'Tools', label: '🛠️ Tools' },
        { id: 'DevOps', label: '🚀 DevOps' },
        { id: 'Hosting', label: '☁️ Hosting' }
    ];

    function countByCategory(cat) {
        if (cat === 'all') return RESOURCES.length;
        return RESOURCES.filter(function (r) { return r.category === cat; }).length;
    }

    function uniqueCategories() {
        var seen = {};
        RESOURCES.forEach(function (r) { seen[r.category] = true; });
        return Object.keys(seen).length;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function renderCard(r) {
        var tags = r.tags.map(function (t) {
            return '<span class="rh-tag">#' + escapeHtml(t) + '</span>';
        }).join('');

        return (
            '<article class="rh-card" data-category="' + escapeHtml(r.category) + '" ' +
            'data-search="' + escapeHtml((r.title + ' ' + r.description + ' ' + r.tags.join(' ')).toLowerCase()) + '">' +
            '<span class="rh-cat">' + escapeHtml(r.category) + '</span>' +
            '<h3>' + escapeHtml(r.title) + '</h3>' +
            '<p>' + escapeHtml(r.description) + '</p>' +
            '<div class="rh-tags">' + tags + '</div>' +
            '<a href="' + escapeHtml(r.url) + '" target="_blank" rel="noopener noreferrer" class="rh-link">' +
            'Visit Resource <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>' +
            '</article>'
        );
    }

    function init() {
        var root = document.getElementById('resourcesHub');
        if (!root) return;

        var webCount = countByCategory('Web Development');
        var appCount = countByCategory('App Development');
        var catCount = uniqueCategories();

        root.innerHTML =
            '<div class="rh-stats" id="rhStats">' +
            '<div class="rh-stat"><strong>' + RESOURCES.length + '</strong><span>📚 Total Resources</span></div>' +
            '<div class="rh-stat"><strong>' + webCount + '</strong><span>🌐 Web Development</span></div>' +
            '<div class="rh-stat"><strong>' + appCount + '</strong><span>📱 App Development</span></div>' +
            '<div class="rh-stat"><strong>' + catCount + '</strong><span>🏷️ Categories</span></div>' +
            '</div>' +
            '<div class="rh-filter">' +
            '<input type="search" id="rhSearch" class="rh-search" placeholder="🔍 Search resources by title, description, or tags..." autocomplete="off">' +
            '<div class="rh-filter-btns" id="rhFilterBtns">' +
            FILTERS.map(function (f, i) {
                return '<button type="button" class="rh-filter-btn' + (i === 0 ? ' is-active' : '') + '" data-filter="' + escapeHtml(f.id) + '">' + f.label + '</button>';
            }).join('') +
            '</div></div>' +
            '<div class="rh-grid" id="rhGrid">' + RESOURCES.map(renderCard).join('') + '</div>' +
            '<p class="rh-note">All external links open in a new tab · Learn, Build, Grow · Curated by NEOXWEB</p>';

        var currentFilter = 'all';
        var searchInput = document.getElementById('rhSearch');
        var filterBtns = root.querySelectorAll('.rh-filter-btn');
        var cards = root.querySelectorAll('.rh-card');

        function applyFilters() {
            var term = (searchInput.value || '').toLowerCase().trim();
            var visible = 0;

            cards.forEach(function (card) {
                var cat = card.getAttribute('data-category');
                var search = card.getAttribute('data-search') || '';
                var catOk = currentFilter === 'all' || cat === currentFilter;
                var searchOk = !term || search.indexOf(term) !== -1;
                var show = catOk && searchOk;
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });

            var grid = document.getElementById('rhGrid');
            var empty = grid.querySelector('.rh-empty');
            if (visible === 0) {
                if (!empty) {
                    empty = document.createElement('p');
                    empty.className = 'rh-empty';
                    empty.textContent = 'No resources match your search. Try another keyword or category.';
                    grid.appendChild(empty);
                }
            } else if (empty) {
                empty.remove();
            }

            filterBtns.forEach(function (btn) {
                btn.classList.toggle('is-active', btn.getAttribute('data-filter') === currentFilter);
            });
        }

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentFilter = btn.getAttribute('data-filter');
                applyFilters();
            });
        });

        searchInput.addEventListener('input', applyFilters);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
