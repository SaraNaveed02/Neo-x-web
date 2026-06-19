$root = "c:\xampp\htdocs\time\project"
$map = @{
    'assets/images/neoxweb/web-dev.jpg' = 'assets/images/neoxweb/web-dev.svg'
    'assets/images/neoxweb/seo-new.jpg' = 'assets/images/neoxweb/seo-new.svg'
    'assets/images/neoxweb/ppc.jpg' = 'assets/images/neoxweb/ppc.svg'
    'assets/images/neoxweb/social-media-new.jpg' = 'assets/images/neoxweb/social-media-new.svg'
    'assets/images/neoxweb/portfolio-branding.jpg' = 'assets/images/neoxweb/portfolio-branding.svg'
    'assets/images/neoxweb/portfolio-web.jpg' = 'assets/images/neoxweb/portfolio-web.svg'
    'assets/images/neoxweb/portfolio-seo.jpg' = 'assets/images/neoxweb/portfolio-seo.svg'
    'assets/images/neoxweb/portfolio-ppc.jpg' = 'assets/images/neoxweb/portfolio-ppc.svg'
    'assets/images/neoxweb/hero-bg-new.jpg' = 'assets/images/neoxweb/hero-bg-new.svg'
    'assets/images/neoxweb/hero-tech-bg.png' = 'assets/images/neoxweb/hero-tech-bg.svg'
    'assets/images/neoxweb/logo-nx-mark.jpg' = 'assets/images/neoxweb/logo-unified-mark.svg'
    "url('../assets/images/neoxweb/hero-bg-new.jpg')" = "url('../assets/images/neoxweb/hero-bg-new.svg')"
    "url('assets/images/neoxweb/hero-bg-new.jpg')" = "url('assets/images/neoxweb/hero-bg-new.svg')"
}
$count = 0
Get-ChildItem -Path $root -Recurse -Include *.html,*.css -File | Where-Object { $_.FullName -notmatch 'node_modules' } | ForEach-Object {
    $text = [IO.File]::ReadAllText($_.FullName)
    $next = $text
    foreach ($k in $map.Keys) { $next = $next.Replace($k, $map[$k]) }
    if ($next -ne $text) {
        [IO.File]::WriteAllText($_.FullName, $next)
        $count++
        Write-Output $_.FullName
    }
}
Write-Output "MODIFIED_COUNT=$count"
