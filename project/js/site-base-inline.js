/**
 * NEOXWEB — correct base URL for CSS/JS (XAMPP /project/ + Netlify root)
 * Must run inline in <head> before CSS/JS links.
 */
(function () {
    var path = window.location.pathname || '/';
    var idx = path.indexOf('/project/');
    var base = idx >= 0 ? path.substring(0, idx + '/project/'.length) : '/';
    if (!base.endsWith('/')) base += '/';
    window.__NEOXWEB_BASE__ = base;
    var el = document.createElement('base');
    el.id = 'neoxweb-base';
    el.href = base;
    var head = document.head || document.getElementsByTagName('head')[0];
    if (head && !document.getElementById('neoxweb-base')) {
        head.insertBefore(el, head.firstChild);
    }
})();
