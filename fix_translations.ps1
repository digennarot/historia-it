$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\ventures-it\_source"
$files = Get-ChildItem -Path $folder -Filter "*.json"

foreach ($file in $files) {
    # Read raw content
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Generic translation fixes
    $content = $content -replace "Bond\.", "Legame."
    $content = $content -replace "<strong>Bond</strong>", "<strong>Legame</strong>"
    $content = $content -replace "<em><strong>Bond</strong>\.</em>", "<em><strong>Legame</strong>.</em>"
    $content = $content -replace "DESCRIPTORI", "DESCRITTORI"
    $content = $content -replace "ENDOWMENT", "DOTAZIONE"
    $content = $content -replace "ENDOWMEN", "DOTAZIONE"
    
    # "Prominence" translation consistency in Compendium links
    $content = [regex]::Replace($content, "{@Compendium\[historia-it\.ventures-it\.(.+?)\]\{Prominence:", "{@Compendium[historia-it.ventures-it.`$1]{Prominenza:")
    $content = $content -replace "\]\{Prominence:", "]{Prominenza:"
    $content = $content -replace "\]\{Nota importante:", "]{Prominenza:"
    
    # "Prominence" translation consistency in titles
    $content = $content -replace '"name": "Eminenza: ', '"name": "Prominenza: '
    $content = $content -replace '"name": "Rilievo: ', '"name": "Prominenza: '
    
    # Specific typos
    $content = $content -replace "Comestorico", "Come storico"
    $content = $content -replace "essere è una poesia", "che sia una poesia"
    $content = $content -replace "Qual ​​è la cosa", "Qual è la cosa"
    
    # Write back
    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Replacements completed."
