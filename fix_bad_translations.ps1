$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\species-features-it\_source"
$files = Get-ChildItem -Path $folder -Filter "*.json"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    $content = $content.Replace('"name": "Gambe gravide"', '"name": "Zampe Prensili"')
    $content = $content.Replace('zampe posteriori gravide', 'zampe posteriori prensili')
    
    $content = $content.Replace('"name": "Obbligo rurale"', '"name": "Legame Rurale"')
    
    $content = $content.Replace('"name": "Discriminare il naso"', '"name": "Olfatto Fine"')
    
    $content = $content.Replace('"name": "Povera visione"', '"name": "Vista Debole"')
    
    $content = $content.Replace('"name": "Cautiso"', '"name": "Cauto"')
    
    $content = $content.Replace('"name": "Salta"', '"name": "Salto"')
    
    $content = $content.Replace('"name": "Tenacit senza sosta"', '"name": "Tenacia Implacabile"')
    $content = $content.Replace('Tenacit senza sosta', 'Tenacia Implacabile')
    
    $content = $content.Replace('"name": "Adattamento a freddo"', '"name": "Adattamento al Freddo"')
    
    $content = $content.Replace('"name": "Keen Odore e udito"', '"name": "Olfatto e Udito Acuti"')
    
    $content = $content.Replace('"name": "L''aspetto di Tender"', '"name": "Sguardo Tenero"')
    
    $content = $content.Replace('"name": "Spirito Santo"', '"name": "Spirito Ardente"')
    
    $content = $content.Replace('"name": "Gambe Webbed"', '"name": "Zampe Palmate"')
    
    $content = $content.Replace('"name": "Chiusure"', '"name": "Artigli"')
    
    $content = $content.Replace('"name": "Attenzione."', '"name": "Attenzione"')
    
    $content = $content.Replace('"name": "Wrestler"', '"name": "Lottatore"')
    
    $content = $content.Replace('"name": "Biorhythm solare"', '"name": "Bioritmo Solare"')
    
    $content = $content.Replace('"name": "Protezione"', '"name": "Protettivo"')
    
    $content = $content.Replace('"name": "Pose Imposing"', '"name": "Posa Imponente"')
    
    $content = $content.Replace('"name": "udito acuto"', '"name": "Udito Acuto"')
    
    $content = $content.Replace('"name": "Coltivazioni"', '"name": "Artigli Rapax"')
    
    # "Spirito ardente" already existed but some places used "Spirito Santo". Ensure everything is correct.
    
    if ($original -ne $content) {
        [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "Bad translations fixed."
