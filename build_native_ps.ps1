$ErrorActionPreference = "Stop"

$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"
$npxCmd = "C:\Program Files\nodejs\npx.cmd"

# Vital: Prepend node to the script process path so npx child processes find it
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# First, ensure dependencies are installed
Write-Host "Installing fvtt-cli locally if missing..."
if (-not (Test-Path "node_modules/.bin/fvtt")) {
    & $npmCmd install --no-save @foundryvtt/foundryvtt-cli
    
    if (-not (Test-Path "node_modules/.bin/fvtt") -and -not (Test-Path "node_modules/.bin/fvtt.cmd")) {
        Write-Host "Failed to install foundryvtt-cli."
        exit 1
    }
}

Write-Host "Configuring datapath..."
# Let it use current directory implicitly


Write-Host "Generating packs..."
# The node script failed for abstract-level but python succeeded in creating the src/packs folder. 
# We just need to pack them using npx fvtt.
& $npxCmd --no-install fvtt package workon "historia-it" --type "Module"

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

New-Item -ItemType Directory -Force -Path "packs" | Out-Null

foreach ($pack in $packs) {
    if (Test-Path "src/packs/$pack") {
        Write-Host "Re-organizing pack $pack to use _source directory for fvtt-cli compilation"
        New-Item -ItemType Directory -Force -Path "src/packs/$pack/_source" | Out-Null
        
        # Move all .json files (but not the directory itself) into _source
        Get-ChildItem -Path "src/packs/$pack" -Filter "*.json" | Move-Item -Destination "src/packs/$pack/_source" -Force

        Write-Host "Packing src/packs/$pack to packs/$pack"
        # Node must be in PATH here for npx and fvtt to work
        & $npxCmd --no-install fvtt package pack --in "src/packs/$pack" --out "packs/$pack" -n "$pack"
    }
    else {
        Write-Host "Skipping $pack (directory not found)"
    }
}

Write-Host "Module build standalone done via PowerShell."
