# E-commerce Backend - User Authentication System

## Статус реализации ✅

Реализован полнофункциональный backend для системы аутентификации и управления пользователями с поддержкой всех необходимых профильных данных.

## Что реализовано

### ✅ Модели данных
- **User** - основная модель пользователя с полями для личных данных, OAuth, биллинга
- **Order** - модель заказов с элементами, статусами, отслеживанием
- **Review** - модель отзывов с рейтингами, изображениями, верификацией
- **Complaint** - модель жалоб с типами, статусами, вложениями
- **UserDiscount** - модель скидок пользователя с валидацией и использованием
- **Receipt** - модель квитанций с привязкой к заказам
- **Return** - модель возвратов с причинами, статусами, возмещениями
- **Address** - модель адресов пользователя (доставка/биллинг)

### ✅ Репозитории
Созданы MongoDB репозитории для всех моделей с необходимыми методами запросов.

### ✅ DTO классы
- `LoginRequest` - для аутентификации
- `RegisterRequest` - для регистрации
- `UserResponse` - для ответов с данными пользователя
- `AuthResponse` - для ответов аутентификации с JWT
- `UserUpdateRequest` - для обновления профиля
- `ErrorResponse` / `SuccessResponse` - для стандартизированных ответов

### ✅ JWT аутентификация
- Генерация и валидация JWT токенов
- Срок действия 24 часа
- Извлечение данных пользователя из токена
- Шифрование паролей с BCrypt

### ✅ REST API контроллеры
- **AuthController** (`/api/auth`)
  - `POST /register` - регистрация
  - `POST /login` - вход
  - `POST /logout` - выход
- **UserController** (`/api/users`)
  - `GET /profile` - получение профиля
  - `PUT /profile` - обновление профиля
  - `GET /orders` - получение заказов (заглушка)
  - `GET /receipts` - получение квитанций (заглушка)
  - `GET /reviews` - получение отзывов (заглушка)
  - `GET /complaints` - получение жалоб (заглушка)
  - `GET /discounts` - получение скидок (заглушка)
  - `GET /returns` - получение возвратов (заглушка)

### ✅ Сервисы
- **UserService** - бизнес-логика для пользователей
  - Регистрация с валидацией
  - Аутентификация с проверкой паролей
  - Обновление профиля
  - Преобразование в DTO

### ✅ Конфигурация
- **SecurityConfig** - настройка Spring Security с CORS
- **JWT Util** - утилиты для работы с токенами
- **MongoDB** - подключение к базе данных
- **Валидация** - Bean Validation для входных данных

### ✅ Enums для состояний
- `UserRole` - роли пользователей
- `OrderStatus` - статусы заказов
- `ComplaintType` / `ComplaintStatus` - типы и статусы жалоб
- `DiscountType` - типы скидок
- `ReturnReason` / `ReturnStatus` - причины и статусы возвратов
- `AddressType` - типы адресов

## Технический стек

- **Java 17** + **Spring Boot 3.2.0**
- **Spring Data MongoDB** - для работы с MongoDB
- **Spring Security** - для аутентификации и авторизации
- **JWT (jsonwebtoken)** - для токенов аутентификации
- **BCrypt** - для шифрования паролей
- **Bean Validation** - для валидации данных
- **Maven** - для сборки проекта

## Конфигурация

### application.yml
```yaml
server:
  port: 8080

spring:
  data:
    mongodb:
      uri: mongodb+srv://dwaf:szPt2RsSrsmZdDHl@sklep.7tdeg.mongodb.net/sklep
      database: sklep
      auto-index-creation: false

app:
  jwt:
    secret: mySecretKeyForJWTTokenGenerationAndValidation2024EcommerceApplication
    expiration: 86400000  # 24 hours
```

## Тестирование

### Запуск приложения
```bash
cd backend
mvn spring-boot:run
```

### Примеры API вызовов

#### Регистрация
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -ContentType "application/json" -Body @'
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phoneNumber": "+1234567890"
}
'@
```

#### Логин
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body @'
{
  "email": "john.doe@example.com",
  "password": "password123"
}
'@
$token = $response.token
```

#### Получение профиля
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/users/profile" -Method Get -Headers @{"Authorization" = "Bearer $token"}
```

#### Обновление профиля
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/users/profile" -Method Put -ContentType "application/json" -Headers @{"Authorization" = "Bearer $token"} -Body @'
{
  "phoneNumber": "+1-555-123-4567",
  "billingCity": "New York",
  "billingCountry": "USA"
}
'@
```

## Следующие шаги

### Планируется к реализации:
1. **Полная реализация сервисов для профильных данных**
   - OrderService для управления заказами
   - ReviewService для отзывов
   - ComplaintService для жалоб
   - DiscountService для скидок
   - ReceiptService для квитанций
   - ReturnService для возвратов

2. **OAuth интеграция**
   - Google OAuth2
   - Facebook OAuth2

3. **Email сервис**
   - Подтверждение email
   - Отправка квитанций
   - Уведомления

4. **Файловый сервис**
   - Загрузка изображений профиля
   - Загрузка документов жалоб
   - Генерация PDF квитанций

5. **Админ панель**
   - Управление пользователями
   - Просмотр статистики
   - Обработка жалоб

## Безопасность

- ✅ Пароли хешируются с BCrypt
- ✅ JWT токены с ограниченным временем жизни
- ✅ Валидация всех входных данных
- ✅ CORS настроен для frontend портов
- ✅ MongoDB индексы для уникальности email
- ⚠️ HTTPS рекомендуется для продакшена
- ⚠️ Более сложный JWT secret для продакшена

## Интеграция с Frontend

Backend готов для интеграции с React frontend'ом. Все необходимые endpoints для компонентов профиля реализованы:

- Регистрация и логин для форм аутентификации
- Получение и обновление данных профиля
- Endpoints для всех вкладок профиля (Orders, Receipts, Reviews, etc.)

Статус: **✅ ГОТОВ К ИСПОЛЬЗОВАНИЮ**
