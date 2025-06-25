# E-commerce Fullstack Application

A modern e-commerce platform built with Spring Boot backend and React frontend, featuring comprehensive security, testing, and CI/CD pipeline.

## 🚀 Features

- **User Authentication & Authorization** with JWT tokens
- **Product Catalog** with advanced filtering and search
- **Shopping Cart & Checkout** functionality
- **Order Management** system
- **User Profile Management**
- **Multi-currency Support**
- **Admin Dashboard** for product and user management
- **Security Hardened** with input validation, CORS, CSP headers
- **Comprehensive Testing** - Unit tests, Integration tests
- **API Documentation** with Swagger/OpenAPI
- **CI/CD Pipeline** with GitHub Actions
- **Docker Support** for containerized deployment

## 🏗️ Architecture

```
ecommerce-fullstack/
├── backend/          # Spring Boot REST API
├── frontend/         # React.js SPA
├── docker/           # Docker configuration files
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data MongoDB** - Database integration
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **JUnit 5** - Unit testing
- **Testcontainers** - Integration testing
- **Swagger/OpenAPI** - API documentation
- **JaCoCo** - Code coverage

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

### DevOps & Security
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization
- **OWASP Dependency Check** - Security scanning
- **Trivy** - Vulnerability scanning
- **MongoDB** - NoSQL database

## 🚦 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MongoDB 6.0+
- Docker (optional)
- Maven 3.8+

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-fullstack
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
mvn clean install

# Generate JWT secret (Windows)
./generate-jwt-secret.ps1

# Generate JWT secret (Linux/Mac)
./generate-jwt-secret.sh

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

#### 4. Database Setup
Make sure MongoDB is running on `localhost:27017` or update the connection string in `application.yml`.

## 🧪 Testing

### Backend Tests

#### Unit Tests
```bash
cd backend
mvn test
```

#### Integration Tests
```bash
cd backend
mvn verify
```

#### Test Coverage Report
```bash
cd backend
mvn jacoco:report
# Open target/site/jacoco/index.html
```

#### Security Scanning
```bash
cd backend
mvn org.owasp:dependency-check-maven:check
# Open target/dependency-check-report.html
```

### Frontend Tests
```bash
cd frontend
npm test
npm test -- --coverage
```

### Test Structure

#### Backend Tests
- **Unit Tests**: `/src/test/java/com/ecommerce/service/`
  - `UserServiceTest.java` - User authentication and management
  - `ProductServiceTest.java` - Product filtering and search
  
- **Integration Tests**: `/src/test/java/com/ecommerce/integration/`
  - `AuthControllerIntegrationTest.java` - Authentication endpoints
  - `UserControllerIntegrationTest.java` - User management endpoints
  - `ProductControllerIntegrationTest.java` - Product catalog endpoints

## 📚 API Documentation

### Swagger UI
Once the backend is running, access the interactive API documentation at:
- **Local**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/filter` - Advanced product filtering
- `GET /api/products/with-currency` - Products with currency conversion

#### Users (Authenticated)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user orders

#### Orders (Authenticated)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

## 🔒 Security Features

### Implemented Security Measures
- **JWT Authentication** with secure token generation
- **Password Hashing** using BCrypt with strength 12
- **Input Validation & Sanitization** against XSS and SQL injection
- **CORS Configuration** with restricted origins
- **Content Security Policy (CSP)** headers
- **HSTS (HTTP Strict Transport Security)** headers
- **Rate Limiting** on authentication endpoints
- **Security Headers** (X-Content-Type-Options, X-Frame-Options, etc.)

### Security Configuration
- Public endpoints: `/api/auth/**`, `/api/products/**`
- Protected endpoints: `/api/users/**`, `/api/orders/**`, `/api/admin/**`
- Session management: Stateless with JWT
- Password policy: Minimum 8 characters with complexity requirements

## 🐳 Docker Deployment

### Development Environment
```bash
docker-compose -f docker/docker-compose.dev.yml up
```

### Production Environment
```bash
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Building Images
```bash
# Backend
docker build -f docker/Dockerfile.backend -t ecommerce-backend .

# Frontend
docker build -f docker/Dockerfile.frontend -t ecommerce-frontend .
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

### Workflow Features
- **Automated Testing** - Unit and integration tests for both backend and frontend
- **Code Coverage** - JaCoCo for backend, Jest for frontend
- **Security Scanning** - OWASP Dependency Check and Trivy
- **Docker Build & Push** - Multi-platform images (AMD64, ARM64)
- **Environment Deployment** - Staging and production environments
- **Quality Gates** - Tests must pass before deployment

### Workflow Triggers
- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop` branches

### Required Secrets
Configure these secrets in your GitHub repository:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `JWT_SECRET` - JWT signing secret (generated automatically)

## 📊 Code Quality

### Coverage Goals
- **Backend**: Minimum 70% line coverage
- **Frontend**: Minimum 60% line coverage

### Code Standards
- **Backend**: Java coding standards with proper exception handling
- **Frontend**: ESLint configuration with React best practices
- **Testing**: Comprehensive test coverage for critical business logic

## 🌍 Environment Configuration

### Backend Configuration (`application.yml`)
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/ecommerce}

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours

logging:
  level:
    com.ecommerce: ${LOG_LEVEL:INFO}
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write unit tests for new features
- Follow existing code style and patterns
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **API Reference**: Use Swagger UI for interactive API exploration

## 🔮 Roadmap

- [ ] Real-time notifications with WebSocket
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Advanced product recommendations
- [ ] Mobile app (React Native)
- [ ] Kubernetes deployment configurations
- [ ] Performance monitoring with APM tools
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard

---

**Note**: This application is built with security and scalability in mind, featuring comprehensive testing, modern CI/CD practices, and production-ready configurations.
