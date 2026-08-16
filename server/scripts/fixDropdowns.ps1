$files = @(
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\CategoriesTable.jsx",
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\DisputesTable.jsx",
  "c:\Users\Aimen\Downloads\Bid\client\src\components\admin\ReportsTable.jsx"
)
foreach ($f in $files) {
  $content = Get-Content $f -Raw
  $updated = $content -replace 'absolute right-0 top-full z-20 mt-1', 'fixed z-50'
  $updated = $updated -replace 'inset-0 z-10', 'inset-0 z-40'
  if ($content -ne $updated) {
    Set-Content $f $updated -NoNewline
    Write-Host "Fixed: $([System.IO.Path]::GetFileName($f))" -ForegroundColor Green
  } else {
    Write-Host "No change: $([System.IO.Path]::GetFileName($f))" -ForegroundColor Gray
  }
}
