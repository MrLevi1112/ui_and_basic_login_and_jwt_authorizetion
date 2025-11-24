# Crash2Cost - Spring Boot Backend

## 🚀 Quick Start Guide

### Prerequisites
- Java 17 or higher
- Maven (or use included Maven Wrapper)
- MongoDB running on localhost:27017

### Installation

1. **Install Maven Wrapper** (first time only):
   ```bash
   # Windows CMD
   cd backend-springboot
   install-maven-wrapper.bat
   
   # Or if you have Maven installed
   mvn -N io.takari:maven:wrapper
   ```

2. **Build the project**:
   ```bash
   ./mvnw clean install
   # Windows: mvnw.cmd clean install
   ```

3. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   # Windows: mvnw.cmd spring-boot:run
   ```

   Or use the convenience scripts from the project root:
   ```bash
   # Windows CMD
   start-springboot.bat
   
   # PowerShell
   start-springboot.ps1
   ```

## 📁 Project Structure

```
backend-springboot/
├── src/
│   └── main/
│       ├── java/com/crash2cost/
│       │   ├── Crash2CostApplication.java    # Main application
│       │   ├── config/                        # Configuration classes
│       │   │   ├── SecurityConfig.java        # Spring Security + JWT
│       │   │   └── CorsConfig.java            # CORS settings
│       │   ├── controller/                    # REST endpoints
│       │   │   ├── AuthController.java        # /api/login, /api/signup
│       │   │   ├── EstimateController.java    # /api/estimate, /api/admin/estimates
│       │   │   └── RootController.java        # /, /api/test
│       │   ├── dto/                           # Data Transfer Objects
│       │   │   ├── LoginRequest.java
│       │   │   ├── SignupRequest.java
│       │   │   ├── TokenResponse.java
│       │   │   ├── EstimateResponse.java
│       │   │   ├── AnalysisResult.java
│       │   │   └── DetectedDamage.java
│       │   ├── model/                         # MongoDB entities
│       │   │   ├── User.java
│       │   │   ├── Estimate.java
│       │   │   └── DamageRegion.java
│       │   ├── repository/                    # Spring Data repositories
│       │   │   ├── UserRepository.java
│       │   │   ├── EstimateRepository.java
│       │   │   └── DamageRegionRepository.java
│       │   ├── security/                      # Security components
│       │   │   ├── JwtUtil.java               # JWT token generation/validation
│       │   │   ├── JwtAuthenticationFilter.java
│       │   │   └── CustomUserDetailsService.java
│       │   └── service/                       # Business logic
│       │       ├── AuthService.java
│       │       └── DamageAnalysisService.java
│       └── resources/
│           └── application.yml                # Configuration
└── pom.xml                                    # Maven dependencies
```

## 🔑 API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `GET /api/test` - Health check
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication

### Protected Endpoints (Requires JWT)
- `POST /api/estimate` - Upload image for damage estimation
- `GET /api/admin/estimates` - Get all estimates (Admin only)

## 🔐 Authentication

### Default Admin User
- **Username**: `admin`
- **Password**: `admin123`

### JWT Token
After login/signup, you'll receive a JWT token. Include it in requests:
```
Authorization: Bearer <your_jwt_token>
```

## ⚙️ Configuration

Edit `src/main/resources/application.yml`:

```yaml
server:
  port: 8001                    # Change server port

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/crash2cost  # MongoDB connection

jwt:
  secret: super_secret_change_me   # Change in production!
  expiration: 3600000              # Token expiry (1 hour)

cors:
  allowed-origins: http://localhost:5173  # Frontend URL
```

## 🛠️ Development

### Run with hot reload:
```bash
./mvnw spring-boot:run
```

### Build JAR file:
```bash
./mvnw clean package
java -jar target/crash2cost-api-1.0.0.jar
```

## 📦 Dependencies

- **Spring Boot 3.2.0** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data MongoDB** - Database integration
- **JJWT 0.12.3** - JWT token handling
- **Lombok** - Code generation
- **Jakarta Validation** - Input validation

## 🔄 Migration from FastAPI

This Spring Boot backend is a direct port of the FastAPI backend with:

✅ Same API endpoints and response formats  
✅ Same MongoDB collections (users, estimates, damageRegions)  
✅ Same JWT authentication logic  
✅ Same role-based access control (user/admin)  
✅ Compatible with existing React frontend  

### Key Differences:
- Port still on **8001** (no change needed)
- JWT implementation uses Java JJWT library
- BCrypt password hashing (compatible with Python bcrypt)
- Spring Security handles authentication filter chain

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8001 | xargs kill -9
```

### MongoDB connection failed
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### Maven wrapper not found
Run the installation script first:
```bash
cd backend-springboot
install-maven-wrapper.bat
```

## 📝 Notes

- The damage analysis is currently using **dummy data**
- Replace `DamageAnalysisService.analyzeImage()` with your ML model integration
- Change JWT secret in production (`jwt.secret` in application.yml)
- Upload directory is `uploads/` (auto-created on first upload)

## 🚀 Next Steps

1. **Test the API** using the existing React frontend
2. **Replace dummy damage analysis** with real ML model
3. **Update JWT secret** for production
4. **Configure production MongoDB** connection
5. **Add more comprehensive error handling**
6. **Implement additional security measures**
