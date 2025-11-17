"""
סקריפט לבדיקת חיבור למסד נתונים
"""
import sys
from pathlib import Path

# הוספת תיקיית app ל-Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from pymongo import MongoClient
from datetime import datetime

def test_mongodb_connection():
    """בדיקת חיבור ל-MongoDB"""
    print("🔍 בודק חיבור ל-MongoDB...")
    
    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        
        # בדיקת חיבור
        client.server_info()
        print("✅ חיבור ל-MongoDB הצליח!")
        
        # בדיקת מסד נתונים
        db = client["crash2cost"]
        print(f"✅ מסד נתונים: crash2cost")
        
        # הצגת קולקציות קיימות
        collections = db.list_collection_names()
        print(f"📚 קולקציות קיימות: {collections}")
        
        # בדיקת משתמשים
        users_count = db.users.count_documents({})
        print(f"👥 מספר משתמשים: {users_count}")
        
        if users_count > 0:
            print("\n📋 משתמשים קיימים:")
            for user in db.users.find():
                print(f"  - {user.get('username')} ({user.get('email')}) - תפקיד: {user.get('role')}")
        
        # בדיקת אומדנים
        estimates_count = db.estimates.count_documents({})
        print(f"\n📊 מספר אומדנים: {estimates_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ שגיאה בחיבור ל-MongoDB: {e}")
        print("\n💡 וודא ש-MongoDB רץ על המחשב:")
        print("   - הרץ: mongod")
        print("   - או התקן MongoDB מ: https://www.mongodb.com/try/download/community")
        return False

def test_user_creation():
    """בדיקת יצירת משתמש"""
    print("\n\n🧪 בודק יצירת משתמש...")
    
    try:
        from app.auth.auth_service import create_user
        from app.database.mongo import get_db
        
        # יצירת משתמש טסט
        test_username = f"test_user_{datetime.now().timestamp()}"
        test_email = f"test_{datetime.now().timestamp()}@test.com"
        
        user = create_user(
            username=test_username,
            email=test_email,
            password="test123",
            role="user"
        )
        
        print(f"✅ משתמש נוצר בהצלחה: {user['username']}")
        
        # בדיקה שהמשתמש באמת נשמר
        db = get_db()
        saved_user = db.users.find_one({"username": test_username})
        
        if saved_user:
            print(f"✅ משתמש נשמר במסד הנתונים!")
            print(f"   Username: {saved_user['username']}")
            print(f"   Email: {saved_user['email']}")
            print(f"   Role: {saved_user['role']}")
        else:
            print(f"❌ המשתמש לא נמצא במסד הנתונים!")
            
        return True
        
    except Exception as e:
        print(f"❌ שגיאה ביצירת משתמש: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🔧 בדיקת מערכת crash2cost")
    print("=" * 60)
    
    # בדיקת חיבור
    if test_mongodb_connection():
        # בדיקת יצירת משתמש
        test_user_creation()
    
    print("\n" + "=" * 60)
    print("✨ בדיקה הסתיימה")
    print("=" * 60)
