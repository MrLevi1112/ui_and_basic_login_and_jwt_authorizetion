import random

# פונקציה דמה לניתוח תמונה - מחזירה נתונים אקראיים
# בעתיד תוחלף במודל AI אמיתי
def analyze_image_dummy(file_path: str):
    # רשימות של חלקי רכב וסוגי נזקים אפשריים
    parts = ["bumper", "door", "hood", "fender"]  # פגוש, דלת, מכסה מנוע, פגוש צד
    damage_types = ["scratch", "dent", "crack"]  # שריטה, שקע, סדק  # שריטה, שקע, סדק

    # יצירת תוצאה דמה עם נתונים אקראיים
    result = {
        "detected": [
            {
                "part": random.choice(parts),  # חלק אקראי
                "severity": random.randint(1, 5),  # חומרה 1-5
                "damageType": random.choice(damage_types),  # סוג נזק אקראי
                "bbox": [100, 50, 200, 150],  # מלבן תוחם - [x1, y1, x2, y2]
                "repairCost": random.randint(500, 5000),  # עלות תיקון בשקלים
                "TotalLoss": random.choice([True, False])  # האם אובדן כולל
            }
        ]
    }

    return result
