# שירותי אימות משתמשים
from fastapi import HTTPException, status
from app.database.mongo import get_db
from datetime import datetime
from uuid import uuid4
from common.constants.authentication import AuthConstants
from common.constants.errors import errorConstants
from common.constants.database import databaseConstants
import bcrypt

def hash_password(password: str) -> str:
    """הצפנת סיסמה"""
    hashed = bcrypt.hashpw(password.encode(AuthConstants.ENCODING_ALGORITHM), bcrypt.gensalt())
    ##MAGIC STRING
    return hashed.decode(AuthConstants.ENCODING_ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """בדיקת סיסמה מול הצפנה"""
    return bcrypt.checkpw(
        ##MAGIC STRING
        plain_password.encode(AuthConstants.ENCODING_ALGORITHM),
        hashed_password.encode(AuthConstants.ENCODING_ALGORITHM)
    )

def create_user(username: str, email: str, password: str, role: str = "user") -> dict:
    """יצירת משתמש חדש במסד הנתונים"""
    db = get_db()
    
    # בדיקה אם המשתמש כבר קיים
    if db.users.find_one({"username": username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            ##MAGIC STRING
            detail=errorConstants.USERNAME_EXISTS,
        )
    
    # בדיקה אם האימייל כבר קיים
    ##MAGIC STRING
    if db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            ##MAGIC STRING
            detail=errorConstants.EMAIL_EXISTS,
        )
    
    # יצירת מסמך משתמש
    ##MAGIC STRING
    user_doc = {
        "_id": str(uuid4()),
        databaseConstants.USERNAME: username,
        databaseConstants.EMAIL: email,
        databaseConstants.PASSWORD: hash_password(password),
        databaseConstants.ROLE: role,
        "createdAt": datetime.utcnow(),
    }
    
    # שמירה במסד הנתונים
    db.users.insert_one(user_doc)
    
    return user_doc

def authenticate_user(username: str, password: str) -> dict | None:
    """אימות משתמש - החזרת המשתמש אם הסיסמה נכונה"""
    db = get_db()
    
    # בדיקת אדמין קשיח
    ##MAGIC STRING
    if username == "admin" and password == "admin123":
        ##MAGIC STRING
        return {
            databaseConstants.USERNAME: "admin",
            databaseConstants.ROLE: "admin",
            "_id": "admin",
        }
    
    # חיפוש משתמש במסד הנתונים
    ##MAGIC STRING
    user = db.users.find_one({databaseConstants.USERNAME: username})
    
    if not user:
        return None
    
    # בדיקת סיסמה
    if not verify_password(password, user[databaseConstants.PASSWORD]):
        return None
    
    return user
