# IBM Partner Hub Israel 🇮🇱

בסיס נתונים של שותפים עסקיים IBM ישראל — אפליקציית React עם חיפוש, סינון וכרטיסי שותף.

## 🌐 האתר החי
> לאחר העלאה ל-GitHub: `https://<username>.github.io/partners-db/`

---

## ✏️ עדכון נתוני שותפים

כל הנתונים נמצאים בקובץ אחד:

```
src/data/partners.json
```

### מבנה רשומת שותף:
```json
{
  "id": 1,
  "name": "שם השותף",
  "eco": "Michal",
  "partnerLevel": "Platinum",
  "products": ["מוצר 1", "מוצר 2"],
  "contacts": {
    "sell": "שם איש קשר מכירות",
    "presale": "שם איש קשר פרי-סייל",
    "deployment": "שם איש קשר deployment",
    "expertLab": "קיים בארץ ובחול",
    "clientEngineer": "שם"
  },
  "links": {
    "partnerPortal": "https://...",
    "isc": "https://..."
  },
  "notes": "הערות חופשיות"
}
```

### שדות אפשריים ל-`eco`:
- `Michal`, `Amitai`, `Dan`, `Orly`

### שדות אפשריים ל-`partnerLevel`:
- `Platinum`, `Gold`, `Silver`

---

## 🚀 הרצה מקומית

```bash
npm install
npm run dev
```

## 🏗️ בנייה לפרסום

```bash
npm run build
```

---

## 📤 העלאה ל-GitHub (פעם ראשונה)

```bash
git init
git add .
git commit -m "init: IBM Partner Hub"
git branch -M main
git remote add origin https://github.com/<username>/partners-db.git
git push -u origin main
```

לאחר מכן ב-GitHub:
1. Settings → Pages
2. Source: **GitHub Actions**

מעכשיו — כל `push` ל-`main` מפרסם אוטומטית! 🎉
