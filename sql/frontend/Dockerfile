# اختيار نسخة Node المناسبة
FROM node:18-alpine

WORKDIR /app

# نسخ ملفات الحزم لتثبيتها
COPY package*.json ./

RUN npm install

# نسخ بقية ملفات الفرونتيند
COPY . .

# فتح المنفذ الخاص بـ Vite (عادة 5173)
EXPOSE 5173

# تشغيل سيرفر التطوير الخاص بـ Vite مع السماح بالوصول الخارجي
CMD ["npm", "run", "dev", "--", "--host"]