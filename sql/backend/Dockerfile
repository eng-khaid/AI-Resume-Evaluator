# اختيار نسخة بايثون المناسبة
FROM python:3.10-slim

# تحديد مجلد العمل داخل الكونتينر
WORKDIR /app

# نسخ ملف المتطلبات أولاً لتسريع الـ caching
COPY requirements.txt .

# تثبيت المكتبات الاعتمادية
RUN pip install --no-cache-dir -r requirements.txt

# نسخ بقية ملفات الباكيند إلى الكونتينر
COPY . .

# تشغيل السيرفر (تأكد من اسم الملف الرئيسي عندك وهو main.py)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]