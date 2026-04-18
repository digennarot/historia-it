$packsDir = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs"
$itPacks = Get-ChildItem -Path $packsDir -Directory -Filter "*-it"

$itemCache = @{}

function Get-ItemName($packName, $itemId) {
    $targetPackName = $packName
    if (-not $packName.EndsWith("-it")) {
        $targetPackName = "$packName-it"
    }

    $key = "$targetPackName.$itemId"
    if ($itemCache.ContainsKey($key)) {
        return $itemCache[$key]
    }

    $sourceDir = Join-Path $packsDir "$targetPackName\_source"
    $filePath = Join-Path $sourceDir "$itemId.json"
    
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8 | ConvertFrom-Json
        $name = $content.name
        $itemCache[$key] = $name
        return $name
    }
    
    if ($targetPackName -ne $packName) {
        $altSourceDir = Join-Path $packsDir "$packName\_source"
        $altFilePath = Join-Path $altSourceDir "$itemId.json"
        
        if (Test-Path $altFilePath) {
            $content = Get-Content -Path $altFilePath -Raw -Encoding UTF8 | ConvertFrom-Json
            $name = $content.name
            $itemCache[$key] = $name
            return $name
        }
    }
    
    return $null
}

$totalFixes = 0

foreach ($pack in $itPacks) {
    $sourceDir = Join-Path $pack.FullName "_source"
    if (-not (Test-Path $sourceDir)) { continue }

    $files = Get-ChildItem -Path $sourceDir -Filter "*.json"
    
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $modified = $false
        
        # Extended regex to handle potential optional 'Item.' or '@UUID' formatting issues gracefully
        $regex = [regex]"@(Compendium|UUID)\[(Compendium\.)?historia-it\.([a-zA-Z0-9_-]+)\.(Item\.)?([a-zA-Z0-9]+)\]\{([^}]+)\}"
        $matches = $regex.Matches($content)
        
        $newContent = $content
        $replacements = @{}
        
        foreach ($m in $matches) {
            $prefix = $m.Groups[1].Value
            $optCompendium = $m.Groups[2].Value
            $targetPack = $m.Groups[3].Value
            $optItem = $m.Groups[4].Value
            $targetId = $m.Groups[5].Value
            $oldLabel = $m.Groups[6].Value
            
            $targetName = Get-ItemName $targetPack $targetId
            if ($targetName -and $targetName -ne $oldLabel) {
                # Form precise string for replacing safely
                $oldString = "@${prefix}[${optCompendium}historia-it.${targetPack}.${optItem}${targetId}]{$oldLabel}"
                $newString = "@${prefix}[${optCompendium}historia-it.${targetPack}.${optItem}${targetId}]{$targetName}"
                $replacements[$oldString] = $newString
            }
        }
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            $newContent = $newContent.Replace($old, $new)
            Write-Host "Fixing [$($file.Name)]: '$old' -> '$new'"
            $totalFixes++
            $modified = $true
        }
        
        if ($modified) {
            [IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        }
    }
}

Write-Host "Fixed $totalFixes compendium links."
