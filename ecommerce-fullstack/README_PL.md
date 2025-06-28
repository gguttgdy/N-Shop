# Aplikacja E-commerce Fullstack

Nowoczesna, w pełni funkcjonalna platforma e-commerce zbudowana na Spring Boot (backend) i React (frontend), z kompleksowym systemem bezpieczeństwa, testowania i CI/CD pipeline.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-green)
![Docker](https://img.shields.io/badge/Docker-supported-blue)

## Kluczowe Funkcje

### Zarządzanie Użytkownikami
- **Uwierzytelnianie i Autoryzacja** z tokenami JWT
- **Profil Użytkownika** z historią zamówień, opiniami i skargami
- **System Zniżek** i spersonalizowanych ofert
- **Zarządzanie Zwrotami** produktów

### Katalog i Zakupy
- **Katalog Produktów** z zaawansowanymi filtrami i wyszukiwaniem
- **Koszyk Zakupowy** i proces finalizacji zamówienia
- **System Zarządzania Zamówieniami** ze śledzeniem statusu
- **Wsparcie Wielu Walut**
- **System Opinii i Ocen** produktów

### Panel Administracyjny
- **Panel Administratora** do zarządzania produktami i użytkownikami
- **Zarządzanie Zamówieniami** i aktualizacje statusów
- **Analityka Sprzedaży** i statystyki aktywności użytkowników
- **System Skarg** i ich przetwarzanie

### Bezpieczeństwo
- **Wzmocnione Bezpieczeństwo** z walidacją danych wejściowych
- **Konfiguracja CORS** i nagłówki CSP
- **Ochrona przed OWASP Top 10** vulnerabilities
- **Wsparcie SSL/TLS**

### Jakość Kodu
- **Kompleksowe Testowanie** - Testy jednostkowe, testy integracyjne
- **Pokrycie Kodu** z JaCoCo (>80%)
- **Dokumentacja API** z Swagger/OpenAPI
- **Statyczna Analiza Kodu** z SonarQube

## Architektura Projektu

```
ecommerce-fullstack/
├── backend/              # Spring Boot REST API
│   ├── src/main/java/       # Kod źródłowy Java
│   ├── src/test/java/       # Testy
│   ├── pom.xml              # Konfiguracja Maven
│   └── ssl.properties       # Ustawienia SSL
├── frontend/             # React.js SPA
│   ├── src/                 # Kod źródłowy React
│   ├── public/              # Pliki statyczne
│   └── package.json         # Konfiguracja NPM
├── docker/               # Kontenery Docker
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/                 # Dokumentacja
├── scripts/              # Skrypty budowania i wdrażania
└── Raporty bezpieczeństwa i audytu
```

## Stos Technologiczny

### Backend (Spring Boot)
- **Spring Boot 3.3.5** - Główny framework aplikacji
- **Spring Security 6.3.4** - Uwierzytelnianie i autoryzacja
- **Spring Data MongoDB** - Integracja z bazą danych
- **JWT** - Uwierzytelnianie oparte na tokenach
- **Maven** - Zarządzanie zależnościami
- **JUnit 5** - Testy jednostkowe
- **Testcontainers** - Testy integracyjne
- **Swagger/OpenAPI** - Dokumentacja API
- **JaCoCo** - Pokrycie kodu
- **Java 17** - Wersja języka

### Frontend (React)
- **React 18.2.0** - Framework UI
- **React Router** - Routing po stronie klienta
- **Axios 1.10.0** - Klient HTTP
- **CSS3** - Stylizacja
- **ESLint & Prettier** - Jakość kodu

### DevOps i Infrastruktura
- **GitHub Actions** - Pipeline CI/CD
- **Docker** - Konteneryzacja
- **OWASP Dependency Check** - Skanowanie bezpieczeństwa
- **Trivy** - Skanowanie podatności
- **MongoDB** - Baza danych NoSQL

## Rozpoczęcie Pracy

### Wymagania

- Java 17+
- Node.js 18+
- MongoDB 6.0+
- Docker (opcjonalnie)
- Maven 3.8+

### Konfiguracja Lokalnego Środowiska Deweloperskiego

#### 1. Klonowanie Repozytorium
```bash
git clone <repository-url>
cd ecommerce-fullstack
```

#### 2. Konfiguracja Backend
```bash
cd backend

# Instalacja zależności
mvn clean install

# Generowanie sekretu JWT (Windows)
./generate-jwt-secret.ps1

# Generowanie sekretu JWT (Linux/Mac)
./generate-jwt-secret.sh

# Uruchomienie aplikacji
mvn spring-boot:run
```

Backend będzie dostępny pod adresem `http://localhost:8080`

#### 3. Konfiguracja Frontend
```bash
cd frontend

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm start
```

Frontend będzie dostępny pod adresem `http://localhost:3000`

#### 4. Konfiguracja Bazy Danych
Upewnij się, że MongoDB działa na `localhost:27017` lub zaktualizuj connection string w `application.yml`.

## Testowanie

### Testy Backend

#### Testy Jednostkowe
```bash
cd backend
mvn test
```

#### Testy Integracyjne
```bash
cd backend
mvn verify
```

#### Raport Pokrycia Testów
```bash
cd backend
mvn jacoco:report
# Otwórz target/site/jacoco/index.html
```

#### Skanowanie Bezpieczeństwa
```bash
cd backend
mvn org.owasp:dependency-check-maven:check
# Otwórz target/dependency-check-report.html
```

### Testy Frontend
```bash
cd frontend
npm test
npm test -- --coverage
```

### Struktura Testów

#### Testy Backend
- **Testy Jednostkowe**: `/src/test/java/com/ecommerce/service/`
  - `UserServiceTest.java` - Uwierzytelnianie i zarządzanie użytkownikami
  - `ProductServiceTest.java` - Filtrowanie i wyszukiwanie produktów
  
- **Testy Integracyjne**: `/src/test/java/com/ecommerce/integration/`
  - `AuthControllerIntegrationTest.java` - Endpointy uwierzytelniania
  - `UserControllerIntegrationTest.java` - Endpointy zarządzania użytkownikami
  - `ProductControllerIntegrationTest.java` - Endpointy katalogu produktów

## Dokumentacja API

### Swagger UI
Po uruchomieniu backend, dostęp do interaktywnej dokumentacji API:
- **Lokalnie**: http://localhost:8080/swagger-ui.html
- **Dokumenty API**: http://localhost:8080/v3/api-docs

### Kluczowe Endpointy API

#### Uwierzytelnianie
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie użytkownika
- `POST /api/auth/forgot-password` - Żądanie resetowania hasła
- `POST /api/auth/reset-password` - Resetowanie hasła

#### Produkty
- `GET /api/products` - Pobierz wszystkie produkty
- `GET /api/products/{id}` - Pobierz produkt według ID
- `GET /api/products/filter` - Zaawansowane filtrowanie produktów
- `GET /api/products/with-currency` - Produkty z konwersją waluty

#### Użytkownicy (Uwierzytelnieni)
- `GET /api/users/profile` - Pobierz profil użytkownika
- `PUT /api/users/profile` - Aktualizuj profil użytkownika
- `GET /api/users/orders` - Pobierz zamówienia użytkownika

#### Zamówienia (Uwierzytelnione)
- `POST /api/orders` - Utwórz nowe zamówienie
- `GET /api/orders` - Pobierz zamówienia użytkownika

## Funkcje Bezpieczeństwa

### Implementowane Środki Bezpieczeństwa
- **Uwierzytelnianie JWT** z bezpiecznym generowaniem tokenów
- **Hashowanie Haseł** używając BCrypt ze siłą 12
- **Walidacja i Sanityzacja Danych Wejściowych** przeciwko XSS i SQL injection
- **Konfiguracja CORS** z ograniczonymi źródłami
- **Content Security Policy (CSP)** headers
- **HSTS (HTTP Strict Transport Security)** headers
- **Rate Limiting** na endpointach uwierzytelniania
- **Nagłówki Bezpieczeństwa** (X-Content-Type-Options, X-Frame-Options, itp.)

### Konfiguracja Bezpieczeństwa
- Endpointy publiczne: `/api/auth/**`, `/api/products/**`
- Endpointy chronione: `/api/users/**`, `/api/orders/**`, `/api/admin/**`
- Zarządzanie sesją: Bezstanowe z JWT
- Polityka haseł: Minimum 8 znaków z wymaganiami złożoności

## Wdrażanie Docker

### Środowisko Deweloperskie
```bash
docker-compose -f docker/docker-compose.dev.yml up
```

### Środowisko Produkcyjne
```bash
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Budowanie Obrazów
```bash
# Backend
docker build -f docker/Dockerfile.backend -t ecommerce-backend .

# Frontend
docker build -f docker/Dockerfile.frontend -t ecommerce-frontend .
```

## Pipeline CI/CD

Projekt używa GitHub Actions do automatycznego testowania i wdrażania:

### Funkcje Workflow
- **Automatyczne Testowanie** - Testy jednostkowe i integracyjne dla backend i frontend
- **Pokrycie Kodu** - JaCoCo dla backend, Jest dla frontend
- **Skanowanie Bezpieczeństwa** - OWASP Dependency Check i Trivy
- **Budowanie i Push Docker** - Obrazy wieloplatformowe (AMD64, ARM64)
- **Wdrażanie Środowisk** - Środowiska staging i produkcyjne
- **Quality Gates** - Testy muszą przejść przed wdrożeniem

### Wyzwalacze Workflow
- **Push** do gałęzi `main` lub `develop`
- **Pull Requests** do gałęzi `main` lub `develop`

### Wymagane Sekrety
Skonfiguruj te sekrety w swoim repozytorium GitHub:
- `DOCKER_USERNAME` - Nazwa użytkownika Docker Hub
- `DOCKER_PASSWORD` - Hasło Docker Hub
- `JWT_SECRET` - Sekret podpisywania JWT (generowany automatycznie)

## Jakość Kodu

### Cele Pokrycia
- **Backend**: Minimum 70% pokrycia linii
- **Frontend**: Minimum 60% pokrycia linii

### Standardy Kodu
- **Backend**: Standardy kodowania Java z właściwą obsługą wyjątków
- **Frontend**: Konfiguracja ESLint z najlepszymi praktykami React
- **Testowanie**: Kompleksowe pokrycie testami krytycznej logiki biznesowej

## Konfiguracja Środowiska

### Konfiguracja Backend (`application.yml`)
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/ecommerce}

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 godziny

logging:
  level:
    com.ecommerce: ${LOG_LEVEL:INFO}
```

### Zmienne Środowiskowe Frontend
```bash
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

## Współtworzenie

1. Zrób fork repozytorium
2. Utwórz branch funkcji (`git checkout -b feature/amazing-feature`)
3. Zatwierdź swoje zmiany (`git commit -m 'Add some amazing feature'`)
4. Wypchnij do branch (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

### Wytyczne Deweloperskie
- Pisz testy jednostkowe dla nowych funkcji
- Postępuj zgodnie z istniejącym stylem i wzorcami kodu
- Aktualizuj dokumentację dla zmian API
- Upewnij się, że wszystkie testy przechodzą przed przesłaniem PR

## Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## Wsparcie

- **Dokumentacja**: Sprawdź folder `/docs` dla szczegółowych przewodników
- **Problemy**: Zgłaszaj błędy przez GitHub Issues
- **Referencja API**: Użyj Swagger UI do interaktywnej eksploracji API

## Mapa Drogowa

- [ ] Powiadomienia w czasie rzeczywistym z WebSocket
- [ ] Integracja z bramkami płatności (Stripe, PayPal)
- [ ] Zaawansowane rekomendacje produktów
- [ ] Aplikacja mobilna (React Native)
- [ ] Konfiguracje wdrażania Kubernetes
- [ ] Monitorowanie wydajności z narzędziami APM
- [ ] Wsparcie wielu języków (i18n)
- [ ] Zaawansowany panel analityczny

---

**Uwaga**: Ta aplikacja została zbudowana z myślą o bezpieczeństwie i skalowalności, oferując kompleksowe testowanie, nowoczesne praktyki CI/CD i konfiguracje gotowe do produkcji.
