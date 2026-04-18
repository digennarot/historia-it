$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\ventures-it\_source"
$files = Get-ChildItem -Path $folder -Filter "*.json"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Fix English words remaining in sentences
    $content = $content -replace "l'impresa Heritage\.", "l'impresa Retaggio."
    $content = $content -replace "proprio Heritage", "proprio Retaggio"
    $content = $content -replace "l'impresa Discovery", "l'impresa Scoperta"
    $content = $content -replace "L'impresa Revenge", "L'impresa Rivalsa"
    
    # Fix untranslated Compendium labels
    $content = $content -replace "Prominenza: Luck Does Not Exists", "Prominenza: La fortuna non esiste"
    $content = $content -replace "Prominenza: The Abyss Looks Inside You", "Prominenza: L'abisso ti guarda dentro"
    $content = $content -replace "Prominenza: Against all Expectations", "Prominenza: Contro ogni aspettativa"
    $content = $content -replace "Prominenza: At The Right Place, At The Right Time", "Prominenza: Al posto giusto, al momento giusto"
    $content = $content -replace "Prominenza: Nose for Resentment", "Prominenza: Naso per il risentimento"
    $content = $content -replace "Prominenza: Spark of Light", "Prominenza: Scintilla di Luce"
    $content = $content -replace "Prominenza: World Foreigner", "Prominenza: Cittadino del Mondo"
    $content = $content -replace "Prominenza: Eye of the Watcher", "Prominenza: Occhio dell'Osservatore"
    
    # Fix terrible translation "Straniero Mondiale"
    $content = $content -replace "Straniero Mondiale", "Cittadino del Mondo"
    
    # Fix some typos I noticed
    $content = $content -replace "Comestorico", "Come storico" # Double check
    $content = $content -replace " essere è una poesia", " che sia una poesia" # Double check

    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Replacements completed for pass 2."
