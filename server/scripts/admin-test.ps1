$base = "http://localhost:5000"

$adminBody = '{"email":"admin@bidstream.com","password":"AdminPass1"}'
$a = Invoke-RestMethod -Uri "$base/api/v1/auth/admin/login" -Method POST -Body $adminBody -ContentType "application/json"
$AH = @{ Authorization = "Bearer $($a.accessToken)" }
Write-Host "Admin: $($a.user.email) [$($a.user.role)]" -ForegroundColor Green

$urls = @(
  "/api/v1/admin/dashboard/stats",
  "/api/v1/admin/users",
  "/api/v1/admin/auctions",
  "/api/v1/admin/analytics",
  "/api/v1/admin/reports",
  "/api/v1/dashboard/admin",
  "/api/v1/users/profile",
  "/api/v1/dashboard/seller"
)

foreach ($url in $urls) {
  try {
    $res = Invoke-WebRequest -Uri "$base$url" -Method GET -Headers $AH -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK  $($res.StatusCode)  $url" -ForegroundColor Green
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "  ERR $code  $url" -ForegroundColor Red
  }
}

Write-Host "DONE" -ForegroundColor Cyan
