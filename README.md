# GORILLA AI OS

ระบบบริหารร้านมือถือและศูนย์ซ่อมครบวงจรที่รวม 4 ระบบหลักเข้าด้วยกันเพื่อการจัดการร้านค้าอย่างมีประสิทธิภาพ:

## 🚀 ระบบหลัก

1. **AI แอดมินตอบแชทอัตโนมัติ**: ผสาน n8n, Google Sheets และ GPT-4o เพื่อตอบแชทลูกค้าอัตโนมัติ พร้อมปิดการขายด้วยปุ่มจองมัดจำ 500 บาท
2. **คิวซ่อมอัจฉริยะ**: ระบบ Kanban Board จัดการสถานะงานซ่อม พร้อมระบบแจ้งเตือนลูกค้าผ่าน LINE โดยอัตโนมัติเมื่อเปลี่ยนสถานะ
3. **Template Google Sheet (สต็อกจริง)**: เชื่อมต่อสต็อกสินค้าแบบเรียลไทม์ คำนวณกำไรอัตโนมัติ และรองรับการจัดการสินค้าหน้าร้าน
4. **Prompt Library**: คลังคำสั่ง AI สำเร็จรูปสำหรับงานแอดมิน, ทำโพสต์ขาย, เช็คราคาตลาด และประเมินราคาซ่อม

## 🛠 การเริ่มต้นใช้งาน (Setup Checklist)

เพื่อให้ระบบทำงานได้อย่างสมบูรณ์ โปรดทำตามขั้นตอนในแท็บ **Setup Checklist** ภายในแอปพลิเคชัน:
1. สร้าง Google Sheet ตาม Template สต็อกจริง + เปิดแชร์ "Anyone with link can view"
2. Import n8n Workflow (ไฟล์ .json ที่ดาวน์โหลดได้จากระบบ) และใส่ API Key ของท่าน
3. เชื่อมต่อ Facebook Page และ LINE Official Account เข้ากับ n8n
4. ตั้งค่า LINE Notify หรือ Messaging API เพื่อแจ้งเตือนคิวซ่อม
5. ทดสอบพิมพ์แชทเข้ามายังเพจ เพื่อทดสอบการทำงานของ AI แอดมิน

## 🏗 เทคโนโลยีที่ใช้
- **Frontend**: React 19, Vite, Tailwind CSS (Design System)
- **AI Integration**: @google/genai (Gemini API)
- **Automation**: n8n, Google Sheets API, LINE Messaging API
- **Utilities**: Lucide React, TypeScript
