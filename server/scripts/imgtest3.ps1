$base = "http://localhost:5000"
$aId  = "6a6048a0a209e1dd12ccd379"

$r = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST `
  -Body '{"email":"fatima@gmail.com","password":"Test1234"}' `
  -ContentType "application/json"
Write-Host "Login: $($r.user.email) [$($r.user.role)]" -ForegroundColor Green

$imgPath = "$env:TEMP\tiny.png"
$png = [byte[]](137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,2,0,1,226,33,188,51,0,0,0,0,73,69,78,68,174,66,96,130)
[IO.File]::WriteAllBytes($imgPath, $png)

$result = & curl.exe -s -X POST `
  -H "Authorization: Bearer $($r.accessToken)" `
  -F "images=@$imgPath;type=image/png" `
  "$base/api/v1/auctions/$aId/images"

Write-Host "Upload result: $result"
