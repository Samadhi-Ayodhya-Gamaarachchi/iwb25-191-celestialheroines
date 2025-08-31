# Backend Cleanup Script
cd "d:\react projects\iwb25-191-celestialheroines\TikiriCare-backend"

# Remove test files
if (Test-Path "test_connections.bal") { Remove-Item "test_connections.bal" -Force; Write-Host "✅ Removed test_connections.bal" }
if (Test-Path "integration-test.html") { Remove-Item "integration-test.html" -Force; Write-Host "✅ Removed integration-test.html" }
if (Test-Path "mongodb-integration-test.html") { Remove-Item "mongodb-integration-test.html" -Force; Write-Host "✅ Removed mongodb-integration-test.html" }

# Remove src test files
if (Test-Path "src\test_connection.bal") { Remove-Item "src\test_connection.bal" -Force; Write-Host "✅ Removed src\test_connection.bal" }
if (Test-Path "src\test_simple.bal") { Remove-Item "src\test_simple.bal" -Force; Write-Host "✅ Removed src\test_simple.bal" }
if (Test-Path "src\main_new.bal") { Remove-Item "src\main_new.bal" -Force; Write-Host "✅ Removed src\main_new.bal" }

# Remove empty/duplicate config
if (Test-Path "src\config\mongodb_config.bal") { Remove-Item "src\config\mongodb_config.bal" -Force; Write-Host "✅ Removed duplicate mongodb_config.bal" }
if (Test-Path "src\config" -and (Get-ChildItem "src\config" -Force | Measure-Object).Count -eq 0) { 
    Remove-Item "src\config" -Force; Write-Host "✅ Removed empty config directory" 
}

# Remove empty types and utils
if (Test-Path "src\types\types.bal" -and (Get-Content "src\types\types.bal" -Raw).Trim() -eq "") { 
    Remove-Item "src\types" -Recurse -Force; Write-Host "✅ Removed empty types directory" 
}
if (Test-Path "src\utils\utils.bal" -and (Get-Content "src\utils\utils.bal" -Raw).Trim() -eq "") { 
    Remove-Item "src\utils" -Recurse -Force; Write-Host "✅ Removed empty utils directory" 
}

# Remove test directory
if (Test-Path "tests") { Remove-Item "tests" -Recurse -Force; Write-Host "✅ Removed tests directory" }

# Clean target cache
if (Test-Path "target\cache") { Remove-Item "target\cache" -Recurse -Force; Write-Host "✅ Removed target cache" }
if (Test-Path "target\rerun_test.json") { Remove-Item "target\rerun_test.json" -Force; Write-Host "✅ Removed rerun_test.json" }

Write-Host "🎉 Backend cleanup completed!"
