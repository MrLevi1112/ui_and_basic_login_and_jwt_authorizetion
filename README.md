# Crash2Cost - AI-Powered Car Damage Analysis

🚗 **Crash2Cost** is an AI-powered web application for analyzing car damage from images and estimating repair costs.

## 🌟 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Image Upload**: Drag & drop or browse to upload damaged car images
- **AI Analysis**: Automatic damage detection and cost estimation
- **Modern UI**: Beautiful dark theme with animated gradients and effects
- **Real-time Results**: Instant damage analysis with detailed breakdown

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for user and estimation data
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Custom animations and gradients

## 📦 Installation

### Prerequisites
- Python 3.13+
- Node.js 18+
- MongoDB running on localhost:27017

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

The backend will run on `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Upload Image**: Drag and drop or select a car damage image
4. **Analyze**: Click "upload and analyze" to get damage estimation
5. **View Results**: See detected damage parts, severity, and repair costs

## 📁 Project Structure

```
crash2cost/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT authentication
│   │   ├── database/      # MongoDB connection
│   │   ├── models/        # Pydantic schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   ├── uploads/           # Uploaded images
│   ├── requirements.txt
│   └── run.py
├── client/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── App.css        # Styles and animations
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 API Endpoints

- `POST /api/signup` - Create new user account
- `POST /api/login` - Authenticate user
- `POST /api/estimate` - Upload image and get damage analysis (requires JWT)
- `GET /api/test` - Health check

## 🎨 Features Highlights

- **Animated Background**: Colorful orbiting gradients with pulse effects
- **Gradient Borders**: Animated rainbow borders on cards
- **Password Toggle**: Show/hide password with emoji button
- **Responsive Design**: Works on desktop and mobile
- **Form Validation**: Email validation and error handling
- **Loading States**: Visual feedback during API calls

## 📝 Environment Variables

Create a `.env` file in the backend folder (optional):

```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=crash2cost
SECRET_KEY=your-secret-key-here
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

---

**Note**: This is a demonstration project. The AI analysis currently returns dummy data. Integrate with a real computer vision model for production use.
