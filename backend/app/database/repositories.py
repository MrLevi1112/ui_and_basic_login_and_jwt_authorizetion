from app.database.mongo import get_db
from common.constants.database import databaseConstants

class UserRepository:
    """
    שכבת גישה לנתונים (DAL) עבור משתמשים.
    מפרידה את הלוגיקה העסקית (Service) מהלוגיקה של מסד הנתונים (Mongo).
    """
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.users

    def find_by_username(self, username: str):
        """חיפוש משתמש לפי שם משתמש"""
        return self.collection.find_one({databaseConstants.USERNAME: username})

    def find_by_email(self, email: str):
        """חיפוש משתמש לפי אימייל"""
        return self.collection.find_one({databaseConstants.EMAIL: email})

    def create(self, user_doc: dict):
        """יצירת משתמש חדש"""
        self.collection.insert_one(user_doc)
        return user_doc