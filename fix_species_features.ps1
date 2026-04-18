$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\species-features-it\_source"
$files = Get-ChildItem -Path $folder -Filter "*.json"

$replacements = @{
    '"name": "I polmoni forti"' = '"name": "Polmoni Forti"'
    '"name": "Nato Deciver"' = '"name": "Ingannatore Nato"'
    '"name": "Climber"' = '"name": "Scalatore"'
    '"name": "Gnawer migliorato"' = '"name": "Roditore Migliorato"'
    '"name": "Tusks"' = '"name": "Zanne"'
    '"name": "Piano."' = '"name": "Piano"'
    '"name": "Alette Membranose"' = '"name": "Ali Membranose"'
    '"name": "Difesa immunità"' = '"name": "Difesa Immunitaria"'
    '"name": "Gnaw"' = '"name": "Rosicchiare"'
    '"name": "Gnawer"' = '"name": "Roditore"'
    '"name": "Peck"' = '"name": "Beccata"'
    '"name": "Clumsy"' = '"name": "Maldestro"'
    '"name": "Roll-up"' = '"name": "Appallottolarsi"'
    '"name": "Via!"' = '"name": "Fuga Rapida"'
    '"name": "Stubborn"' = '"name": "Testardo"'
    '"name": "Sturdy"' = '"name": "Robusto"'
    '"name": "Boar Charge"' = '"name": "Carica del Cinghiale"'
    '"name": "Toddle"' = '"name": "Camminare Barcollando"'
    '"name": "Saboteur"' = '"name": "Sabotatore"'
    '"name": "Screech"' = '"name": "Stridio"'
    '"name": "Prodigious Leap"' = '"name": "Salto Prodigioso"'
    '"name": "Maneuvers in volo"' = '"name": "Manovre in Volo"'
    '"name": "Jumper"' = '"name": "Saltatore"'
    '"name": "Sprinter"' = '"name": "Scattista"'
    '"name": "Passo di piu''"' = '"name": "Gamba Lunga"'
    '"name": "Massive Build"' = '"name": "Costituzione Massiccia"'
    '"name": "Spruzzo di Nauseing"' = '"name": "Spruzzo Nauseante"'
    '"name": "Bite"' = '"name": "Morso"'
    '"name": "Bite Vampirico"' = '"name": "Morso Vampirico"'
    '"name": "Venomous Bite"' = '"name": "Morso Velenoso"'
    '"name": "Grasper"' = '"name": "Afferratore"'
    '"name": "Calmati."' = '"name": "Calmo"'
    '"name": "Tail spesso"' = '"name": "Coda Spessa"'
    '"name": "Occhiali da Aquila"' = '"name": "Occhi d''Aquila"'
    '"name": "Brave"' = '"name": "Coraggioso"'
    '"name": "Pezzo di legno Peck"' = '"name": "Beccata del Picchio"'
    '"name": "Wings"' = '"name": "Ali"'
    '"name": "Snatch."' = '"name": "Ghermire"'
    '"name": "Lithe"' = '"name": "Flessuoso"'
    '"name": "Echolocation terrestre"' = '"name": "Ecolocalizzazione Terrestre"'
    '"name": "Rapax Peck"' = '"name": "Beccata Rapax"'
    '"name": "Quills (Porcupines)"' = '"name": "Aculei (Istrice)"'
    '"name": "Quills (Hedgehog)"' = '"name": "Aculei (Riccio)"'
    '"name": "Migliore memoria"' = '"name": "Grande Memoria"'
    '"name": "Sack Beak"' = '"name": "Becco a Sacca"'
    '"name": "Fur velenoso"' = '"name": "Pelliccia Velenosa"'
}

$fixes = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $replacements[$key])
            $modified = $true
            $fixes++
        }
    }
    
    if ($modified) {
        [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "Replaced $fixes names."
