import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // أو أي إضافات أخرى تستخدمها

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    strictPort: true, // يضمن عدم التحويل لبورت آخر إذا كان 5000 مشغولاً داخلياً
  }
})