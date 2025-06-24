#!/bin/bash

# Скрипт для генерации безопасного JWT секрета
# Запуск: ./generate-jwt-secret.sh

echo "Генерация безопасного JWT секрета..."

# Генерируем случайный 256-битный ключ
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')

echo ""
echo "🔐 Ваш новый JWT секрет:"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "⚠️  ВАЖНО:"
echo "1. Скопируйте этот секрет в ваш .env файл"
echo "2. НЕ РАЗМЕЩАЙТЕ этот секрет в Git"
echo "3. Используйте разные секреты для разработки и продакшена"
echo ""
echo "Добавьте эту строку в ваш .env файл:"
echo "JWT_SECRET=$JWT_SECRET"
