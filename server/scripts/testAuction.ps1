$base = "http://localhost:5000"

$r = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST `
  -Body '{"email":"testseller99@test.com","password":"Test123"}' `
  -ContentType "application/json"
$H = @{ Authorization = "Bearer $($r.accessToken)" }
Write-Host "Seller: $($r.user.email)" -ForegroundColor Green

$cats = Invoke-RestMethod -Uri "$base/api/v1/categories"
$cat = $cats.categories[0]
$catId = $cat._id
Write-Host "Category: $($cat.name) | ID: '$catId'" -ForegroundColor Cyan

$body = "{`"title`":`"Test Auction`",`"category`":`"$catId`",`"description`":`"Test desc`",`"startingPrice`":100,`"condition`":`"New`",`"startTime`":`"2026-07-22T10:00:00.000Z`",`"endTime`":`"2026-07-25T10:00:00.000Z`",`"status`":`"upcoming`",`"shipping`":`"Domestic`"}"

Write-Host "Body: $body" -ForegroundColor Gray

try {
  $res = Invoke-RestMethod -Uri "$base/api/v1/auctions" -Method POST -Headers $H -Body $body -ContentType "application/json"
  Write-Host "SUCCESS: $($res.auction.title) [$($res.auction.status)]" -ForegroundColor Green
} catch {
  $err = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
  Write-Host "ERROR: $($err.message)" -ForegroundColor Red
  if ($err.errors) { $err.errors | ForEach-Object { Write-Host "  - $($_.field): $($_.message)" -ForegroundColor Yellow } }
}
