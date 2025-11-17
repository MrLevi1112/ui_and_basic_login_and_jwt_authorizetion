# שירותי אימות משתמשים
from fastapi import HTTPException, status
from app.database.mongo import get_db
from datetime import datetime
from uuid import uuid4
import bcrypt

def hash_password(password: str) -> str:
    """הצפנת סיסמה"""
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """בדיקת סיסמה מול הצפנה"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def create_user(username: str, email: str, password: str, role: str = "user") -> dict:
    """יצירת משתמש חדש במסד הנתונים"""
    db = get_db()
    
    # בדיקה אם המשתמש כבר קיים
    if db.users.find_one({"username": username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username already exists",
        )
    
    # בדיקה אם האימייל כבר קיים
    if db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email already exists",
        )
    
    # יצירת מסמך משתמש
    user_doc = {
        "_id": str(uuid4()),
        "username": username,
        "email": email,
        "password": hash_password(password),
        "role": role,
        "createdAt": datetime.utcnow(),
    }
    
    # שמירה במסד הנתונים
    db.users.insert_one(user_doc)
    
    return user_doc

def authenticate_user(username: str, password: str) -> dict | None:
    """אימות משתמש - החזרת המשתמש אם הסיסמה נכונה"""
    db = get_db()
    
    # בדיקת אדמין קשיח
    if username == "admin" and password == "admin123":
        return {
            "username": "admin",
            "role": "admin",
            "_id": "admin",
        }
    
    # חיפוש משתמש במסד הנתונים
    user = db.users.find_one({"username": username})
    
    if not user:
        return None
    
    # בדיקת סיסמה
    if not verify_password(password, user["password"]):
        return None
    
    return user
