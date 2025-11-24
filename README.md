# Crash2Cost - Car Damage Estimation System

Web application for estimating car repair costs using computer vision.

## ✨ Features
- 🔐 User authentication (Login/Signup) with JWT
- 👥 Role-based access control (Admin/User)
- 📸 Image upload for damage detection
- 📊 Admin dashboard for viewing all estimates
- 💰 Real-time damage analysis and cost estimation
- 🍪 Session persistence with localStorage
- 🎨 Modern animated UI with gradients

## 🛠 Tech Stack

### Backend (Spring Boot)
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data MongoDB
- Java 17
- Maven

### Frontend (React + Vite)
- React 18
- Vite
- Modern CSS with animations

## 📦 Installation

### Prerequisites
- ☕ **Java 17+** - [Download](https://adoptium.net/temurin/releases/?version=17)
- 📦 **Node.js 16+** - [Download](https://nodejs.org/)
- 🍃 **MongoDB** - [Download](https://www.mongodb.com/try/download/community)

### Setup
```bash
# Frontend
cd frontend/client
npm install

# Backend (Maven Wrapper auto-downloads dependencies)
cd backend-springboot
```

## 🚀 Running the Application

### Quick Start (Recommended)
```bash
# Windows CMD
start.bat

# PowerShell
.\start.ps1
```

Opens:
- 🟢 Backend: http://127.0.0.1:8001
- 🔵 Frontend: http://localhost:5173

### Manual Start
```bash
# Backend
cd backend-springboot
.\mvn.ps1 spring-boot:run

# Frontend
cd frontend/client
npm run dev
```

## 🔑 Default Credentials
- **Admin:** `admin` / `admin123`
- **User:** Sign up to create account

## 📡 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | GET | ❌ | Welcome |
| `/api/test` | GET | ❌ | Health check |
| `/api/signup` | POST | ❌ | Register |
| `/api/login` | POST | ❌ | Login |
| `/api/estimate` | POST | ✅ | Upload image |
| `/api/admin/estimates` | GET | ✅ Admin | All estimates |

## 📁 Project Structure
```
📦 Crash2Cost
├── 📂 backend-springboot/     # Spring Boot backend
│   ├── src/main/java/com/crash2cost/
│   │   ├── config/           # Security & CORS
│   │   ├── controller/       # REST APIs
│   │   ├── model/           # MongoDB entities
│   │   ├── repository/      # Data access
│   │   ├── security/        # JWT
│   │   └── service/         # Business logic
│   ├── application.yml
│   └── pom.xml
├── 📂 frontend/client/        # React app
│   └── src/
├── start.bat                 # Startup script
└── README.md
```

## ⚙️ Configuration

Edit `backend-springboot/src/main/resources/application.yml`:
```yaml
server:
  port: 8001

jwt:
  secret: change_me_in_production
  expiration: 3600000  # 1 hour
```

## 🐛 Troubleshooting

**Java not found?**
See `SETUP_SPRINGBOOT.md`

**Port in use?**
```bash
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

**MongoDB not running?**
```bash
mongosh --eval "db.adminCommand('ping')"
```

## 👤 Author
MrLevi1112

## 📝 License
Educational purposes
