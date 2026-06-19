# Nexura client package — frontend + backend ZIP
$Source = "C:\xampp\htdocs\time"
$ZipPath = "C:\xampp\htdocs\nexura-client.zip"

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

$excludeDirs = @(
    'realtime\node_modules',
    '.git',
    'terminals'
)

$temp = Join-Path $env:TEMP "nexura-pack-$(Get-Random)"
New-Item -ItemType Directory -Path $temp -Force | Out-Null

Write-Host "Copying project files..."
robocopy $Source $temp /E /XD node_modules .git terminals agent-transcripts `
    /XF *.log .env `
    /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

# Remove realtime node_modules if copied
$rtNm = Join-Path $temp "realtime\node_modules"
if (Test-Path $rtNm) { Remove-Item $rtNm -Recurse -Force }

Write-Host "Creating ZIP..."
Compress-Archive -Path "$temp\*" -DestinationPath $ZipPath -Force
Remove-Item $temp -Recurse -Force

$size = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "DONE: $ZipPath"
Write-Host "Size: ${size} MB"
Write-Host ""
Write-Host "WhatsApp par bhejne ke liye CLIENT-WHATSAPP.md padhein"
