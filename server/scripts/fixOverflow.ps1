$files = @(
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\UsersTable.jsx",
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\CategoriesTable.jsx",
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\DisputesTable.jsx",
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\ReportsTable.jsx"
)
foreach ($f in $files) {
  $content = Get-Content $f -Raw
  $updated = $content -replace 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card', 'rounded-2xl border border-gray-200 bg-white shadow-card'
  if ($content -ne $updated) {
    Set-Content $f $updated -NoNewline
    Write-Host "Fixed: $([System.IO.Path]::GetFileName($f))" -ForegroundColor Green
  } else {
    Write-Host "No change: $([System.IO.Path]::GetFileName($f))" -ForegroundColor Gray
  }
}
