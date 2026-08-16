$base = "http://localhost:5000"
$r = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST -Body '{"email":"aimenkanwal12@gmail.com","password":"Aimen@123"}' -ContentType "application/json"
$H = @{ Authorization = "Bearer $($r.accessToken)" }
Write-Host "Role: $($r.user.role)"
$a = Invoke-RestMethod -Uri "$base/api/v1/auctions/my" -Headers $H
Write-Host "Auctions: $($a.auctions.Count)"
if ($a.auctions.Count -gt 0) {
    $id = $a.auctions[0].id
    Write-Host "ID: $id | Title: $($a.auctions[0].title)"
}
