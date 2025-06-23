# E-commerce Backend API Documentation

## Описание
Backend API для полнофункционального интернет-магазина с системой аутентификации пользователей и управления профильными данными.

## База данных
- **Тип**: MongoDB
- **Коллекции**: users, orders, reviews, complaints, discounts, receipts, returns, addresses

## Аутентификация
- **Тип**: JWT Bearer Token
- **Срок действия**: 24 часа
- **Заголовок**: `Authorization: Bearer <token>`

## API Endpoints

### Аутентификация (`/api/auth`)

#### POST `/api/auth/register`
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string (min 6 characters)",
  "confirmPassword": "string",
  "phoneNumber": "string (optional)"
}
```

**Ответ (200):**
```json
{
  "token": "jwt_token_string",
  "type": "Bearer",
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "CUSTOMER",
    "emailVerified": false,
    "createdAt": "2025-06-23T03:36:50.669",
    // ... other user fields
  }
}
```

#### POST `/api/auth/login`
Вход пользователя

**Тело запроса:**
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": false
}
```

**Ответ (200):**
```json
{
  "token": "jwt_token_string",
  "type": "Bearer",
  "user": {
    // user object
  }
}
```

#### POST `/api/auth/logout`
Выход пользователя (клиентский JWT logout)

**Ответ (200):**
```json
{
  "message": "Successfully logged out",
  "success": true,
  "timestamp": 1750643025000
}
```

### Управление пользователем (`/api/users`)

#### GET `/api/users/profile`
Получение профиля текущего пользователя

**Заголовки:** `Authorization: Bearer <token>`

**Ответ (200):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "dateOfBirth": "datetime",
  "role": "CUSTOMER|ADMIN|MODERATOR",
  "emailVerified": boolean,
  "createdAt": "datetime",
  "lastLogin": "datetime",
  "provider": "local|google|facebook",
  "profileImageUrl": "string",
  "billingAddress": "string",
  "billingCity": "string",
  "billingCountry": "string",
  "billingPostalCode": "string",
  "fullName": "string"
}
```

#### PUT `/api/users/profile`
Обновление профиля пользователя

**Заголовки:** `Authorization: Bearer <token>`

**Тело запроса:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)", 
  "phoneNumber": "string (optional)",
  "dateOfBirth": "datetime (optional)",
  "profileImageUrl": "string (optional)",
  "billingAddress": "string (optional)",
  "billingCity": "string (optional)",
  "billingCountry": "string (optional)",
  "billingPostalCode": "string (optional)"
}
```

### Пользовательские данные

#### GET `/api/users/orders`
Получение заказов пользователя (в разработке)

#### GET `/api/users/receipts`
Получение квитанций пользователя (в разработке)

#### GET `/api/users/reviews`
Получение отзывов пользователя (в разработке)

#### GET `/api/users/complaints`
Получение жалоб пользователя (в разработке)

#### GET `/api/users/discounts`
Получение скидок пользователя (в разработке)

#### GET `/api/users/returns`
Получение возвратов пользователя (в разработке)

## Модели данных

### User
- id: string (MongoDB ObjectId)
- firstName: string
- lastName: string
- email: string (unique)
- password: string (hashed)
- phoneNumber: string
- dateOfBirth: datetime
- role: UserRole (CUSTOMER, ADMIN, MODERATOR)
- isActive: boolean
- emailVerified: boolean
- createdAt: datetime
- updatedAt: datetime
- lastLogin: datetime
- provider: string (local, google, facebook)
- providerId: string
- profileImageUrl: string
- billingAddress: string
- billingCity: string
- billingCountry: string
- billingPostalCode: string

### Order
- id: string
- user: User reference
- orderNumber: string
- status: OrderStatus (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED, REFUNDED)
- totalAmount: decimal
- currency: string
- items: OrderItem[]
- shippingAddress: string
- paymentMethod: string
- orderDate: datetime
- trackingNumber: string

### Review
- id: string
- user: User reference
- productId: string
- rating: integer (1-5)
- title: string
- comment: string
- verified: boolean
- createdAt: datetime

### Complaint
- id: string
- user: User reference
- type: ComplaintType
- status: ComplaintStatus
- subject: string
- description: string
- resolution: string
- createdAt: datetime

### UserDiscount
- id: string
- user: User reference
- discountCode: string
- type: DiscountType (PERCENTAGE, FIXED_AMOUNT)
- value: decimal
- isUsed: boolean
- validFrom: datetime
- validUntil: datetime

### Receipt
- id: string
- user: User reference
- order: Order reference
- receiptNumber: string
- totalAmount: decimal
- issuedAt: datetime

### Return
- id: string
- user: User reference
- order: Order reference
- reason: ReturnReason
- status: ReturnStatus
- refundAmount: decimal
- requestedAt: datetime

### Address
- id: string
- user: User reference
- type: AddressType (SHIPPING, BILLING, BOTH)
- fullName: string
- addressLine1: string
- city: string
- country: string
- isDefault: boolean

## Коды ошибок

- **400 Bad Request**: Ошибка валидации данных
- **401 Unauthorized**: Отсутствует или недействительный токен
- **404 Not Found**: Ресурс не найден
- **409 Conflict**: Пользователь уже существует (при регистрации)
- **500 Internal Server Error**: Внутренняя ошибка сервера

## Конфигурация CORS
Настроены для работы с frontend'ом на портах 3000 и 3001.

## Настройки JWT
- Секретный ключ конфигурируется в application.yml
- Время жизни токена: 24 часа
- Алгоритм: HS256
