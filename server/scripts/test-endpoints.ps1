$base = "http://localhost:5000"

Write-Host "`n=== BUYER LOGIN ===" -ForegroundColor Cyan
$r = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST `
  -Body '{"email":"test@test.com","password":"Test123"}' -ContentType "application/json"
$H = @{ Authorization = "Bearer $($r.accessToken)" }
Write-Host "  Logged in: $($r.user.email) [$($r.user.role)]"

function Test($method, $url, $headers) {
  try {
    $res = Invoke-WebRequest -Uri "$base$url" -Method $method -Headers $headers -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK  $($res.StatusCode)  $method $url" -ForegroundColor Green
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    try { $body = ($_.ErrorDetails.Message | ConvertFrom-Json).message } catch { $body = "" }
    Write-Host "  ERR $code  $method $url  $body" -ForegroundColor Red
  }
}

Write-Host "`n--- Auth ---" -ForegroundColor Yellow
Test "GET"  "/api/v1/auth/me"          $H
Test "GET"  "/api/v1/categories"       $H
Test "GET"  "/api/v1/auctions"         $H
Test "GET"  "/api/v1/auctions?limit=100" $H
Test "GET"  "/api/v1/bids/my"          $H
Test "GET"  "/api/v1/wishlist"         $H
Test "GET"  "/api/v1/notifications"    $H
Test "GET"  "/api/v1/dashboard/buyer"  $H

Write-Host "`n=== ADMIN LOGIN ===" -ForegroundColor Cyan
$a = Invoke-RestMethod -Uri "$base/api/v1/auth/admin/login" -Method POST `
  -Body '{"email":"admin@bidstream.com","password":"AdminPass1"}' -ContentType "application/json"
$AH = @{ Authorization = "Bearer $($a.accessToken)" }
Write-Host "  Logged in: $($a.user.email) [$($a.user.role)]"

Write-Host "`n--- Admin ---" -ForegroundColor Yellow
Test "GET"  "/api/v1/admin/dashboard/stats" $AH
Test "GET"  "/api/v1/admin/users"           $AH
Test "GET"  "/api/v1/admin/auctions"        $AH
Test "GET"  "/api/v1/admin/analytics"       $AH
Test "GET"  "/api/v1/admin/reports"         $AH
Test "GET"  "/api/v1/dashboard/admin"       $AH
Test "GET"  "/api/v1/users/profile"         $AH

Write-Host "`n=== ALL DONE ===" -ForegroundColor Cyan
