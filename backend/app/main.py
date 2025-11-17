# ייבוא ספריות נדרשות
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.estimate_routes import router as estimate_router
import time

# יצירת אפליקציית FastAPI
app = FastAPI(
    title="Crash2Cost API",
    description="AI-powered vehicle damage estimation system",
    version="1.0.0"
)

# רשימת מקורות מורשים לגישה לשרת (CORS)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # לצורך דיבאג - אפשר הכל
]

# הוספת middleware לטיפול ב-CORS - מאפשר לקליינט לגשת לשרת
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware ללוגים
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"\n{'='*60}")
    print(f"📥 {request.method} {request.url.path}")
    print(f"   Origin: {request.headers.get('origin', 'N/A')}")
    print(f"   User-Agent: {request.headers.get('user-agent', 'N/A')[:50]}...")
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    print(f"📤 Response: {response.status_code} ({duration:.2f}s)")
    print(f"{'='*60}\n")
    
    return response

# רישום נתיבים (routes)
app.include_router(auth_router)
app.include_router(estimate_router)

# נקודת קצה לבדיקת תקינות השרת
@app.get("/api/test")
def test():
    """בדיקת תקינות השרת"""
    return {"message": "hello world", "status": "healthy"}

# נקודת קצה ראשית
@app.get("/")
def root():
    """מסך ברוכים הבאים"""
    return {
        "message": "Welcome to Crash2Cost API",
        "docs": "/docs",
        "version": "1.0.0"
    }
