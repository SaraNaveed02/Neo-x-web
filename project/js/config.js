/**
 * NEOXWEB site paths — XAMPP local + Netlify live (auto-detect)
 */
window.NexuraConfig = (function () {
    function readMeta(name) {
        const el = document.querySelector(`meta[name="${name}"]`);
        return el?.content?.trim() || '';
    }

    function detect() {
        const path = window.location.pathname;
        const host = window.location.hostname;
        const isNetlify = host.endsWith('.netlify.app') || host.endsWith('.netlify.live');
        const metaApi = readMeta('neoxweb-api-base');

        if (window.__NEOXWEB_BASE__) {
            const base = window.__NEOXWEB_BASE__.replace(/\/$/, '');
            const isLocalProject = base.includes('/project');
            return {
                env: isNetlify ? 'netlify' : (isLocalProject ? 'xampp' : 'production'),
                siteRoot: isLocalProject ? base : '',
                basePath: isLocalProject ? base.replace(/\/project$/, '') : '',
                apiBase: metaApi || (isLocalProject ? `${base.replace(/\/project$/, '')}/backend/api` : '')
            };
        }

        const slash = path.lastIndexOf('/');
        const pageDir = slash >= 0 ? path.slice(0, slash + 1) : '/';
        if (pageDir.includes('/project/')) {
            const projectRoot = pageDir.slice(0, pageDir.indexOf('/project/') + '/project'.length);
            return {
                env: 'xampp',
                siteRoot: projectRoot,
                basePath: projectRoot.replace(/\/project$/, ''),
                apiBase: metaApi || `${projectRoot.replace(/\/project$/, '')}/backend/api`
            };
        }

        const projectIdx = path.indexOf('/project/');
        if (projectIdx >= 0) {
            const basePath = path.substring(0, projectIdx);
            return {
                env: 'xampp',
                siteRoot: `${basePath}/project`,
                basePath,
                apiBase: metaApi || `${basePath}/backend/api`
            };
        }

        return {
            env: isNetlify ? 'netlify' : 'production',
            siteRoot: '',
            basePath: '',
            apiBase: metaApi
        };
    }

    const cfg = detect();

    function normalizeBase(value) {
        return String(value || '').replace(/\/$/, '');
    }

    function prefixUrl(relative) {
        const clean = String(relative || '').replace(/^\.\//, '');
        if (!cfg.siteRoot) return clean;
        return `${normalizeBase(cfg.siteRoot)}/${clean}`;
    }

    return {
        siteName: 'NEOXWEB',
        siteUrl: 'https://neoxweb.netlify.app',
        env: cfg.env,
        basePath: cfg.basePath,
        siteRoot: cfg.siteRoot,
        get apiBase() {
            if (window.NEXWEB_API_BASE) return normalizeBase(window.NEXWEB_API_BASE);
            return normalizeBase(cfg.apiBase);
        },
        get projectBase() {
            return cfg.siteRoot;
        },
        assetUrl(relative) {
            return prefixUrl(relative);
        },
        isNetlify() {
            return cfg.env === 'netlify';
        },
        isMobileApp() {
            return window.matchMedia('(max-width: 900px)').matches;
        }
    };
})();
