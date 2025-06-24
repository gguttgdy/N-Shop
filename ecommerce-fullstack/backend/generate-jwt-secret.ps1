# Скрипт для генерации безопасного JWT секрета для Windows
# Запуск: .\generate-jwt-secret.ps1

Write-Host "Генерация безопасного JWT секрета..." -ForegroundColor Green

# Генерируем случайный 256-битный ключ
$bytes = New-Object byte[] 64
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$JWT_SECRET = [System.Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "🔐 Ваш новый JWT секрет:" -ForegroundColor Yellow
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ВАЖНО:" -ForegroundColor Red
Write-Host "1. Скопируйте этот секрет в ваш .env файл"
Write-Host "2. НЕ РАЗМЕЩАЙТЕ этот секрет в Git"
Write-Host "3. Используйте разные секреты для разработки и продакшена"
Write-Host ""
Write-Host "Добавьте эту строку в ваш .env файл:" -ForegroundColor Green
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
