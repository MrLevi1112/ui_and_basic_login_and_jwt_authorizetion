# שירותי אימות משתמשים
from fastapi import HTTPException, status
from datetime import datetime
from uuid import uuid4
import bcrypt

# ייבוא ה-Repository החדש במקום גישה ישירה ל-Mongo
from app.database.repositories import UserRepository

# ייבוא קבועים
from common.constants.authentication import AuthConstants
from common.constants.errors import errorConstants
from common.constants.database import databaseConstants

# אתחול ה-Repository
user_repo = UserRepository()

def hash_password(password: str) -> str:
    """הצפנת סיסמה"""
    hashed = bcrypt.hashpw(password.encode(AuthConstants.ENCODING_ALGORITHM), bcrypt.gensalt())
    return hashed.decode(AuthConstants.ENCODING_ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """בדיקת סיסמה מול הצפנה"""
    return bcrypt.checkpw(
        plain_password.encode(AuthConstants.ENCODING_ALGORITHM),
        hashed_password.encode(AuthConstants.ENCODING_ALGORITHM)
    )

def create_user(username: str, email: str, password: str, role: str = "user") -> dict:
    """יצירת משתמש חדש באמצעות ה-Repository"""
    
    # בדיקה אם המשתמש כבר קיים (דרך ה-Repository)
    if user_repo.find_by_username(username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errorConstants.USERNAME_EXISTS,
        )
    
    # בדיקה אם האימייל כבר קיים
    if user_repo.find_by_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errorConstants.EMAIL_EXISTS,
        )
    
    # יצירת מסמך משתמש
    user_doc = {
        "_id": str(uuid4()),
        databaseConstants.USERNAME: username,
        databaseConstants.EMAIL: email,
        databaseConstants.PASSWORD: hash_password(password),
        databaseConstants.ROLE: role,
        "createdAt": datetime.utcnow(),
    }
    
    # שמירה באמצעות ה-Repository
    user_repo.create(user_doc)
    
    return user_doc

def authenticate_user(username: str, password: str) -> dict | None:
    """אימות משתמש - החזרת המשתמש אם הסיסמה נכונה"""
    
    # בדיקת אדמין קשיח (לצורכי פיתוח/חירום)
    if username == "admin" and password == "admin123":
        return {
            databaseConstants.USERNAME: "admin",
            databaseConstants.ROLE: "admin",
            "_id": "admin",
        }
    
    # חיפוש משתמש דרך ה-Repository
    user = user_repo.find_by_username(username)
    
    if not user:
        return None
    
    # בדיקת סיסמה
    if not verify_password(password, user[databaseConstants.PASSWORD]):
        return None
    
    return user
