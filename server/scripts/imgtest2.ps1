$base = "http://localhost:5000"
$aId = "6a6048a0a209e1dd12ccd379"

# Login as fatima (seller of film camera)
# We need fatima's credentials - check DB via admin
$admin = Invoke-RestMethod -Uri "$base/api/v1/auth/admin/login" -Method POST -Body '{"email":"aimenkanwal12@gmail.com","password":"Aimen@123"}' -ContentType "application/json"
$AH = @{ Authorization = "Bearer $($admin.accessToken)" }

# Get fatima user info
$users = Invoke-RestMethod -Uri "$base/api/v1/admin/users" -Headers $AH
$fatima = $users.users | Where-Object { $_.username -eq "fati_8" } | Select-Object -First 1
Write-Host "Fatima: $($fatima.name) | $($fatima.email)"

# Test upload directly - create minimal PNG bytes
$imgPath = "$env:TEMP\tiny.png"
$png = [byte[]](137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,2,0,1,226,33,188,51,0,0,0,0,73,69,78,68,174,66,96,130)
[IO.File]::WriteAllBytes($imgPath, $png)
Write-Host "PNG created: $imgPath ($(([IO.File]::ReadAllBytes($imgPath)).Length) bytes)"

# Upload using curl (more reliable for multipart)
$curlResult = & curl.exe -s -o - -w "`nHTTP_CODE:%{http_code}" `
  -X POST `
  -H "Authorization: Bearer $($admin.accessToken)" `
  -F "images=@$imgPath;type=image/png" `
  "$base/api/v1/auctions/$aId/images"

Write-Host "Result: $curlResult"
