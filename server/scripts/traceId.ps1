$base = "http://localhost:5000"
$r = Invoke-RestMethod "$base/api/v1/auth/login" -Method POST -Body '{"email":"fatima@gmail.com","password":"Test1234"}' -ContentType "application/json"
$H = @{ Authorization = "Bearer $($r.accessToken)" }
$res = Invoke-RestMethod "$base/api/v1/auctions/my" -Headers $H
$a = $res.auctions[0]
Write-Host "=== STEP 1: RAW API OBJECT (auctions[0]) ===" -ForegroundColor Cyan
Write-Host "  .id   = '$($a.id)'"
Write-Host "  ._id  = '$($a._id)'"
Write-Host "  .title = '$($a.title)'"
Write-Host ""
Write-Host "All top-level keys:" -ForegroundColor Yellow
$a.PSObject.Properties | ForEach-Object { Write-Host "  $($_.Name) = $($_.Value)" }
