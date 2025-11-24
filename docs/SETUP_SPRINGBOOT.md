# 🚀 Spring Boot Setup Guide - התקנה מהירה

## ⚠️ דרישות מקדימות

לפני שמתחילים, צריך להתקין:

### 1. Java 17 (חובה!)

**הורדה:**
- 🔗 **Eclipse Temurin (מומלץ)**: https://adoptium.net/temurin/releases/?version=17
- בחר: **JDK 17 (LTS)** → **Windows** → **x64** → **MSI installer**

**התקנה:**
1. הרץ את קובץ ה-MSI שהורדת
2. **חשוב:** סמן את האופציה: ✅ **"Set JAVA_HOME variable"**
3. **חשוב:** סמן את האופציה: ✅ **"Add to PATH"**
4. לחץ Install

**בדיקה:**
פתח CMD חדש (לאחר ההתקנה!) והרץ:
```cmd
java -version
```

אמור להראות משהו כמו:
```
openjdk version "17.0.x"
```

---

## 🎯 הפעלת השרת

### אופציה 1: הרצה אוטומטית (מומלץ)

לחץ פעמיים על:
```
start-springboot.bat
```

### אופציה 2: הרצה ידנית

```cmd
cd backend-springboot
mvnw.cmd spring-boot:run
```

---

## 🐛 פתרון בעיות

### "JAVA_HOME not found"

**פתרון 1 - הגדר JAVA_HOME ידנית:**

1. פתח **System Properties** (הקש `Win + Pause`)
2. לחץ על **Advanced system settings**
3. לחץ על **Environment Variables**
4. תחת **System variables**, לחץ **New**:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x` (התאם לגרסה שלך)
5. מצא את `Path` תחת **System variables**, לחץ **Edit**
6. הוסף: `%JAVA_HOME%\bin`
7. לחץ OK בכל החלונות
8. **סגור ופתח מחדש CMD!**

**פתרון 2 - בדוק היכן Java מותקן:**

```cmd
where java
```

אם יש פלט, העתק את הנתיב (ללא `\bin\java.exe`) והגדר אותו כ-JAVA_HOME.

**פתרון 3 - התקן Java מחדש:**
הורד מ-https://adoptium.net/ ווודא שסימנת "Set JAVA_HOME" בהתקנה.

---

### "mvnw.cmd is not recognized"

ודא שאתה בתיקיית `backend-springboot`:
```cmd
cd backend-springboot
dir mvnw.cmd
```

אם הקובץ קיים, הרץ:
```cmd
.\mvnw.cmd --version
```

---

### "Port 8001 already in use"

מצא ועצור את התהליך:
```cmd
netstat -ano | findstr :8001
taskkill /PID <המספר> /F
```

---

## ✅ אחרי שהכל עובד

השרת ירוץ על:
- **Backend**: http://127.0.0.1:8001
- **Frontend**: http://localhost:5173

**בדיקת health:**
```
http://127.0.0.1:8001/api/test
```

אמור להחזיר:
```json
{"message":"hello world","status":"healthy"}
```

---

## 📝 פקודות שימושיות

| פעולה | פקודה |
|-------|--------|
| הרץ את השרת | `mvnw.cmd spring-boot:run` |
| בנה JAR | `mvnw.cmd clean package` |
| נקה build | `mvnw.cmd clean` |
| הרץ tests | `mvnw.cmd test` |
| דלג על tests | `mvnw.cmd clean package -DskipTests` |

---

## 🔧 אם אין לך Maven מותקן - זה בסדר!

`mvnw.cmd` הוא **Maven Wrapper** - הוא יוריד את Maven אוטומטית בפעם הראשונה שתריץ אותו.

פשוט ודא ש-**Java מותקן** ו-**JAVA_HOME מוגדר**.

---

## 🆘 עדיין לא עובד?

1. ודא ש-Java 17+ מותקן: `java -version`
2. ודא ש-JAVA_HOME מוגדר: `echo %JAVA_HOME%`
3. ודא ש-MongoDB רץ: `mongosh --eval "db.adminCommand('ping')"`
4. נסה לסגור את כל ה-CMD/PowerShell ולפתוח מחדש
5. נסה להפעיל מחדש את המחשב (כן, באמת זה עוזר לפעמים)

---

## 💡 טיפ

אם אתה רוצה להריץ בפורט אחר, ערוך:
```
backend-springboot\src\main\resources\application.yml
```

שנה:
```yaml
server:
  port: 8080  # שנה לפורט רצוי
```
