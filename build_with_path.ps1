$ErrorActionPreference = "Stop"

$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Write-Host "Installing older CLI"
& $npmCmd install --no-save @foundryvtt/foundryvtt-cli@11.1.0

Write-Host "Configuring datapath"
& $nodeExe $(Join-Path "node_modules" "\@foundryvtt\foundryvtt-cli\bin\fvtt.mjs") configure set dataPath "./"

Write-Host "Building module"
& $nodeExe build_module.mjs

Write-Host "Done"
