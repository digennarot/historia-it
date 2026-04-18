$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\ventures-it\_source"
$files = Get-ChildItem -Path $folder -Filter "*.json"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # 2RudL9XHJdfwKFQy.json (Arte)
    $content = $content -replace "chenon", "che non"
    $content = $content -replace "ascoltae", "ascolta e"
    
    # 6m4XdtLGSJONCGyH.json (Destino)
    $content = $content -replace "perdonarla /<br />la loro", "perdonare<br />la loro"
    $content = $content -replace "perdonarla /la loro", "perdonare la loro"
    $content = $content -replace "perdonarla /\\nla loro", "perdonare\nla loro"
    $content = $content -replace "mauna", "ma una"
    
    # A50Zlc4VpAQqzr4D.json (Rivoluzione)
    $content = $content -replace "unafuria", "una furia"
    $content = $content -replace "delpiccolo", "del piccolo"
    $content = $content -replace "storgono", "storcono"
    $content = $content -replace "d'uscitaChi", "d'uscita. Chi"
    
    # EQVKo8c2oZT7dTms.json (Devozione)
    $content = $content -replace "bambini cadetti", "secondogeniti"
    
    # ItcXx7JoCVf9KpMI.json (Scoperta)
    $content = $content -replace "abile nella seta e nei contratti", "abile con la seta e con i contratti"
    
    # mgEw2ifZzcbkeY8C.json (Rivalsa)
    $content = $content -replace "potentie", "potenti e"
    $content = $content -replace "infami cattivo", "infami cattivi"
    $content = $content -replace "inflittouna", "inflitto una"
    $content = $content -replace "malissimo torto", "torto marcio"
    
    # pdfMzj0k69yPZtuM.json (Vuoto)
    $content = $content -replace "daTorquato", "da Torquato"
    $content = $content -replace "peccati.La", "peccati. La"
    $content = $content -replace "fuanimale", "fu animale"
    $content = $content -replace "supplizi anima", "tormenti dell'anima"
    
    # RlpOs7TE8nVTRmcF.json (Illuminazione)
    $content = $content -replace "De Fossache", "De Fossa che"
    $content = $content -replace "mani nudeInnumerevoli", "mani nude. Innumerevoli"
    
    if ($original -ne $content) {
        [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed grammar/spacing in: $($file.Name)"
    }
}
Write-Host "Grammar review applied."
