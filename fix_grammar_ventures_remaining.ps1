$folder = "c:\Users\tizia\OneDrive\Documenti\GitHub\historia-it\src\packs\ventures-it\_source"

# 1. Fix 2RudL9XHJdfwKFQy.json
$file1 = Join-Path $folder "2RudL9XHJdfwKFQy.json"
$content1 = Get-Content -Path $file1 -Raw -Encoding UTF8
$content1 = $content1 -replace "chenon", "che non"
$content1 = $content1 -replace "ascoltae", "ascolta e"
[IO.File]::WriteAllText($file1, $content1, [System.Text.Encoding]::UTF8)

# 2. Fix 6m4XdtLGSJONCGyH.json
$file2 = Join-Path $folder "6m4XdtLGSJONCGyH.json"
$content2 = Get-Content -Path $file2 -Raw -Encoding UTF8
$content2 = $content2 -replace "perdonarla(?:<br />\s*)+/>la loro", "perdonare<br />la loro"
$content2 = $content2 -replace "mauna", "ma una"
[IO.File]::WriteAllText($file2, $content2, [System.Text.Encoding]::UTF8)

# 3. Fix RlpOs7TE8nVTRmcF.json
$file3 = Join-Path $folder "RlpOs7TE8nVTRmcF.json"
$content3 = Get-Content -Path $file3 -Raw -Encoding UTF8
$content3 = $content3 -replace "De Fossache", "De Fossa che"
$content3 = $content3 -replace "nudeInnumerevoli", "nude. Innumerevoli"
[IO.File]::WriteAllText($file3, $content3, [System.Text.Encoding]::UTF8)

Write-Host "Remaining ventures files fixed!"
