$ErrorActionPreference = "Stop"

$nodeExe = "C:\Program Files\nodejs\node.exe"
$npxCmd = "C:\Program Files\nodejs\npx.cmd"

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Compile each pack separately
$packs = @(
    "factions-and-careers-it",
    "ventures-it",
    "factions-it",
    "items-it",
    "species-it",
    "profession-features-it",
    "professions-it",
    "species-features-it",
    "spells-it"
)

# Make sure packs dir exists
New-Item -ItemType Directory -Force -Path "packs" | Out-Null

foreach ($pack in $packs) {
    Write-Host "Packing $pack..."
    & $npxCmd --no-install fvtt package pack "src/packs/$pack" "packs/$pack" --id "historia-it"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to pack $pack"
    }
}
Write-Host "Done packing"
