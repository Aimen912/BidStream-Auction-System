$base = "http://localhost:5000"

# Login as seller (film camera seller)
$r = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST `
  -Body '{"email":"aimenkanwal12@gmail.com","password":"Aimen@123"}' `
  -ContentType "application/json"
$H = @{ Authorization = "Bearer $($r.accessToken)" }
Write-Host "Logged in: $($r.user.email) [$($r.user.role)]" -ForegroundColor Green

# Get this seller's auctions
$a = Invoke-RestMethod -Uri "$base/api/v1/auctions/my" -Headers $H
Write-Host "Total auctions: $($a.auctions.Count)" -ForegroundColor Cyan

if ($a.auctions.Count -eq 0) {
  Write-Host "No auctions — creating one..." -ForegroundColor Yellow

  $cats = Invoke-RestMethod -Uri "$base/api/v1/categories"
  $catId = $cats.categories[0].id
  $now = (Get-Date).AddMinutes(5).ToString("yyyy-MM-ddTHH:mm:ss")
  $end = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss")

  $newAuction = @{
    title="Test Image Auction"; category=$catId; description="Testing image upload"
    startingPrice=10; condition="New"; startTime=$now; endTime=$end; shipping="Domestic"
  } | ConvertTo-Json

  $created = Invoke-RestMethod -Uri "$base/api/v1/auctions" -Method POST -Headers $H -Body $newAuction -ContentType "application/json"
  $aId = $created.auction.id
  Write-Host "Created auction: $aId" -ForegroundColor Green
} else {
  $auction = $a.auctions[0]
  $aId = $auction.id
  Write-Host "Using auction: $($auction.title) | ID: $aId" -ForegroundColor Cyan
}

# Create a tiny test PNG
$testImg = "$env:TEMP\test-upload.png"
$pngBytes = [byte[]](137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,2,0,1,226,33,188,51,0,0,0,0,73,69,78,68,174,66,96,130)
[System.IO.File]::WriteAllBytes($testImg, $pngBytes)

# Upload
$boundary = "----Boundary$(Get-Random)"
$CRLF = "`r`n"
$header = "--$boundary${CRLF}Content-Disposition: form-data; name=`"images`"; filename=`"test.png`"${CRLF}Content-Type: image/png${CRLF}${CRLF}"
$footer = "${CRLF}--$boundary--${CRLF}"

$headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
$fileBytes   = [System.IO.File]::ReadAllBytes($testImg)
$footerBytes = [System.Text.Encoding]::ASCII.GetBytes($footer)
$combined    = $headerBytes + $fileBytes + $footerBytes

try {
  $res = Invoke-RestMethod -Uri "$base/api/v1/auctions/$aId/images" `
    -Method POST -Headers $H `
    -Body $combined `
    -ContentType "multipart/form-data; boundary=$boundary"
  Write-Host "UPLOAD SUCCESS!" -ForegroundColor Green
  $res.images | ForEach-Object { Write-Host "  -> $_" -ForegroundColor Green }
} catch {
  $code = $_.Exception.Response.StatusCode.value__
  Write-Host "UPLOAD FAILED ($code)" -ForegroundColor Red
  Write-Host $_.ErrorDetails.Message -ForegroundColor Red
}
