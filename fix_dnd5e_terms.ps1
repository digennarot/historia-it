$packsDir = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs"
$folders = Get-ChildItem -Path $packsDir -Directory -Filter "*-it"

$replacements = @{
    "@UUUID\[" = "@UUID["
    "puòtrip" = "trucchetto"
    "crucchetto" = "trucchetto"
    "crucchetti" = "trucchetti"
    "fessura di incantesimo" = "slot incantesimo"
    "fessure di incantesimo" = "slot incantesimo"
    "getto di risparmio" = "tiro salvezza"
    "getti di risparmio" = "tiri salvezza"
    "riro per colpire" = "tiro per colpire"
    "DC del lancio di salvataggio dell'incantesimo" = "CD del tiro salvezza degli incantesimi"
    "Modificatore dell'attacco dello spell" = "Modificatore di attacco magico"
    "Livello di conversazione" = "Livello incantesimo"
    "AMMINISTRAZIONE" = "CARATTERISTICA DA INCANTATORE"
    "abilità di Spellcasting" = "caratteristica da incantatore"
}

$regexReplacements = @(
    @{ Pattern = "(?i)\bSpellcasting Ability\b"; Replacement = "Caratteristica da Incantatore" }
    @{ Pattern = "(?i)\bSaving Throw\b"; Replacement = "Tiro Salvezza" }
    @{ Pattern = "incantesimi Flagellanti"; Replacement = "incantesimi da Flagellante" }
    @{ Pattern = "Spells Flagellanti"; Replacement = "incantesimi da Flagellante" }
    @{ Pattern = "(?i)\bCantrips\b"; Replacement = "TRUCCHETTI" }
)

$totalReplacements = 0

foreach ($folder in $folders) {
    $sourceDir = Join-Path $folder.FullName "_source"
    if (-not (Test-Path $sourceDir)) { continue }

    $files = Get-ChildItem -Path $sourceDir -Filter "*.json"
    
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $modified = $false
        
        $newContent = $content
        
        foreach ($key in $replacements.Keys) {
            if ($newContent.Contains($key)) {
                $newContent = $newContent.Replace($key, $replacements[$key])
                $modified = $true
                $totalReplacements++
            }
        }

        foreach ($rule in $regexReplacements) {
            $regex = [regex]$rule.Pattern
            if ($regex.IsMatch($newContent)) {
                $newContent = $regex.Replace($newContent, $rule.Replacement)
                $modified = $true
                $totalReplacements++
            }
        }
        
        if ($modified) {
            [IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        }
    }
}

Write-Host "Fixed $totalReplacements instances of bad D&D 5e terminology."
