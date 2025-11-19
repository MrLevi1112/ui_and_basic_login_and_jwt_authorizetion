from pymongo import MongoClient

# יצירת חיבור למסד נתונים MongoDB המקומי
##MAGIC STRING
client = MongoClient("mongodb://localhost:27017/")

# בחירת מסד הנתונים crash2cost
#MAGIC STRING
db = client["crash2cost"]

# פונקציה להחזרת אובייקט מסד הנתונים
def get_db():
    return db
