from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ייבוא של הקונפיגורציה וה-middleware מהקבצים החדשים
from app.config.cors_config import cors_settings
from app.middleware.logging_middleware import log_requests

# ייבוא ה־routers
from app.routes.auth_routes import router as auth_router
from app.routes.estimate_routes import router as estimate_router

from common.constants.fastAPI import fastAPIConstants

# יצירת אפליקציית FastAPI
app = FastAPI(
    title=fastAPIConstants.TITLE,
    description=fastAPIConstants.DESCRIPTION,
    version=fastAPIConstants.VERSION
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_settings["origins"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware לוגים
app.middleware("http")(log_requests)


# רישום ראוטרים
app.include_router(auth_router)
app.include_router(estimate_router)


# נקודת בדיקה
@app.get("/api/test")
def test():
    return {"message": "hello world", "status": "healthy"}


# ברוכים הבאים
@app.get("/")
def root():
    return {
        "message": "Welcome to Crash2Cost API",
        "docs": "/docs",
        "version": "1.0.0"
    }