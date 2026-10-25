import { RepairJob, InventoryItem, PromptTemplate, N8nLogEntry } from '../types';

export const INITIAL_REPAIR_JOBS: RepairJob[] = [
  {
    id: 'GOR-214',
    model: 'iPhone 14 Pro',
    customer: 'คุณมิกซ์',
    phone: '089-112-3456',
    issue: 'จอแตก / แบตเสื่อม',
    status: 'รับเครื่อง',
    time: '09:32',
    color: '#00FF88',
    technician: 'ช่างเอก',
    estimatedCost: 3500,
  },
  {
    id: 'GOR-215',
    model: 'Samsung S23 Ultra',
    customer: 'คุณแอน',
    phone: '081-445-6789',
    issue: 'ชาร์จไม่เข้า (พอร์ตหลวม)',
    status: 'รับเครื่อง',
    time: '10:15',
    color: '#00FF88',
    technician: 'ช่างบอย',
    estimatedCost: 1200,
  },
  {
    id: 'GOR-209',
    model: 'iPhone 13',
    customer: 'คุณบอส',
    phone: '092-334-5567',
    issue: 'กล้องหลังสั่น โฟกัสไม่ได้',
    status: 'ประเมิน',
    time: 'เมื่อวาน',
    color: '#FFCC33',
    technician: 'ช่างเอก',
    estimatedCost: 2800,
  },
  {
    id: 'GOR-211',
    model: 'iPhone 12 Pro Max',
    customer: 'คุณเจน',
    phone: '084-556-7890',
    issue: 'บอร์ดช็อต เปิดไม่ติด',
    status: 'รออะไหล่',
    time: '2 วันก่อน',
    color: '#FF4D6A',
    technician: 'ช่างโต้ง',
    estimatedCost: 4500,
  },
  {
    id: 'GOR-208',
    model: 'iPhone 14',
    customer: 'คุณท็อป',
    phone: '086-778-9901',
    issue: 'เปลี่ยนแบตแท้ มอก.',
    status: 'ซ่อมเสร็จ',
    time: 'วันนี้',
    color: '#00FF88',
    technician: 'ช่างเอก',
    estimatedCost: 1890,
  },
  {
    id: 'GOR-203',
    model: 'Samsung A54',
    customer: 'คุณฟ้า',
    phone: '087-889-0012',
    issue: 'เปลี่ยนจอแท้ Super AMOLED',
    status: 'ลูกค้ารับแล้ว',
    time: 'เมื่อวาน',
    color: '#9a9aa3',
    technician: 'ช่างบอย',
    estimatedCost: 2900,
  },
  {
    id: 'GOR-210',
    model: 'iPhone 13 Pro',
    customer: 'คุณโอ๊ต',
    phone: '095-667-8899',
    issue: 'ลำโพงสนทนาแตก / ไมค์เบา',
    status: 'รออะไหล่',
    time: 'เมื่อวาน',
    color: '#FF4D6A',
    technician: 'ช่างโต้ง',
    estimatedCost: 1500,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    model: 'iPhone 15 Pro Max',
    color: 'Natural Titanium',
    cap: '256GB',
    cost: 39900,
    price: 44900,
    stock: 3,
    status: 'พร้อมขาย',
    img: '📱',
  },
  {
    model: 'iPhone 14 Pro',
    color: 'Deep Purple',
    cap: '128GB',
    cost: 28500,
    price: 32900,
    stock: 5,
    status: 'พร้อมขาย',
    img: '📱',
  },
  {
    model: 'iPhone 14',
    color: 'Starlight',
    cap: '128GB',
    cost: 19200,
    price: 22900,
    stock: 12,
    status: 'ขายดี',
    img: '📱',
  },
  {
    model: 'iPhone 13',
    color: 'Midnight',
    cap: '128GB',
    cost: 14800,
    price: 17900,
    stock: 2,
    status: 'ใกล้หมด',
    img: '📱',
  },
  {
    model: 'Samsung S23 Ultra',
    color: 'Cream',
    cap: '512GB',
    cost: 32000,
    price: 38900,
    stock: 4,
    status: 'พร้อมขาย',
    img: '🤖',
  },
  {
    model: 'Samsung S23',
    color: 'Phantom Black',
    cap: '256GB',
    cost: 18900,
    price: 23500,
    stock: 0,
    status: 'หมด',
    img: '🤖',
  },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    key: 'admin',
    title: 'Prompt แอดมินตอบลูกค้า',
    desc: 'ใช้กับ GPT-4o ใน n8n เพื่อตอบแชทเช็คสต็อกอัตโนมัติ',
    variables: ['{{ $json.stock }}', '{{ $json.message }}'],
    content: `คุณคือแอดมินร้าน GORILLA MOBILE ผู้เชี่ยวชาญ iPhone มือสอง
กฎ:
1. เช็คสต็อกจาก Google Sheet ก่อนตอบทุกครั้ง {{ $json.stock }}
2. ตอบสั้น กระชับ เป็นกันเอง ใช้ภาษาวัยรุ่น (ใช้คำว่า "พี่ชาย")
3. ถ้ามีของ: บอกราคา + ของแถม (ฟิล์ม/เคส/หัวชาร์จ) + ปุ่มจองเลย
4. ถ้าไม่มี: แนะนำรุ่นใกล้เคียงในงบเดียวกัน
5. ปิดการขายด้วย "จองไว้ก่อน 500 ได้เครื่องชัวร์ครับ ล็อคคิวทันที"

ลูกค้าถาม: {{ $json.message }}`,
  },
  {
    key: 'post',
    title: 'Prompt ทำโพสต์ขาย',
    desc: 'สร้างแคปชั่น Facebook แบบไวรัลจากข้อมูลในชีท',
    variables: ['{{ $json.model }}', '{{ $json.price }}'],
    content: `สร้างโพสต์ขายมือถือ 3 สไตล์จากข้อมูลนี้:
รุ่น: {{ $json.model }} ราคา: {{ $json.price }}

สไตล์ 1: ไวรัล ตลก (เปิดหัวกระแทกตา ใช้คำว่า พี่ชาย สภาพนางฟ้า)
สไตล์ 2: สายคุ้ม เปรียบเทียบราคาเปิดตัวศูนย์ ประหยัดทันทีหลักหมื่น
สไตล์ 3: สายเทคนิค ละเอียด สุขภาพแบต ประกันเหลือ ตรวจเช็ค 24 จุด

ใส่ Call-to-Action ทักแชทพร้อมปุ่มจอง
ใส่ Hashtag #GORILLAMobile #ไอโฟนมือสอง #มือถือหลุดจำนำ`,
  },
  {
    key: 'price',
    title: 'Prompt เช็คราคาตลาด',
    desc: 'ให้ AI ไปส่องราคาตลาดแล้วคำนวณราคาขายที่ควรตั้ง',
    variables: ['{{ $json.stock }}', '{{ $json.cost }}'],
    content: `คุณคือนักวิเคราะห์ราคามือถือมือสองในไทย
วิเคราะห์จาก:
- ราคากลางใน Kaidee / Facebook Marketplace / Thaimobilecenter
- สต็อกปัจจุบัน: {{ $json.stock }} เครื่อง
- ต้นทุนเครื่องนี้: {{ $json.cost }} บาท

แนะนำ:
1. ราคาขายที่ควรตั้ง (ให้กำไรขั้นต่ำ 18-22%)
2. แนะนำควรลดราคาหรือไม่ ถ้าสต็อกเครื่องนี้จอดเกิน 7 วัน
3. จัดโปรโมชั่น Bundle แถมอะไรที่ไม่กระทบ Margin กำไร`,
  },
  {
    key: 'eval',
    title: 'Prompt ตรวจรับซื้อเครื่อง',
    desc: 'ประเมินราคาเครื่องที่ลูกค้านำมาเทิร์นหรือขายหน้าร้าน',
    variables: ['{{ $json.model }}', '{{ $json.batteryHealth }}'],
    content: `คุณคือช่างผู้เชี่ยวชาญประเมินราคารับซื้อมือถือ
รุ่น: {{ $json.model }}
สภาพภายนอก: {{ $json.condition }}
สุขภาพแบต: {{ $json.batteryHealth }}
การใช้งาน: {{ $json.functionalStatus }}

คำนวณ:
1. ราคาประเมินรับซื้อสูงสุด / ต่ำสุด
2. รายการหักค่าเสื่อม (เช่น จอมีรอยขนแมว -500, แบตต่ำกว่า 80% -800)
3. สคริปต์พูดกับลูกค้าอย่างสุภาพเพื่อตกลงราคา`,
  },
];

export const INITIAL_LOGS: N8nLogEntry[] = [
  {
    id: 'log-1',
    time: '09:41:12',
    type: 'webhook',
    message: 'Webhook รับข้อความเข้าจาก Facebook Messenger: "14 Pro สีม่วงมีไหม"',
  },
  {
    id: 'log-2',
    time: '09:41:13',
    type: 'sheet',
    message: 'Google Sheet Stock Lookup: ค้นหา "iPhone 14 Pro 128GB" -> พบ 5 เครื่อง สภาพพร้อมขาย',
  },
  {
    id: 'log-3',
    time: '09:41:14',
    type: 'gpt',
    message: 'GPT-4o ประมวลผลคำตอบ: "มีครับพี่ชาย 💜 14 Pro 128GB สี Deep Purple สวยกริ๊บ 32,900฿ แถมเคสฟิล์มชุดชาร์จ..."',
  },
  {
    id: 'log-4',
    time: '09:41:15',
    type: 'order',
    message: 'แนบปุ่มจองอัตโนมัติ: [จองเลย 500฿ ล็อคเครื่องทันที]',
  },
];

export const N8N_WORKFLOW_TEMPLATE = {
  name: "Gorilla Mobile AI Assistant & Repair Workflow",
  nodes: [
    {
      name: "Webhook Inbound Chat",
      type: "n8n-nodes-base.webhook",
      parameters: { httpMethod: "POST", path: "gorilla-chat" },
      position: [240, 300]
    },
    {
      name: "Google Sheets Inventory",
      type: "n8n-nodes-base.googleSheets",
      parameters: { operation: "read", sheetName: "Stock_Live" },
      position: [460, 300]
    },
    {
      name: "GPT-4o Sales Agent",
      type: "@n8n/n8n-nodes-langchain.agent",
      parameters: { model: "gpt-4o", systemPrompt: "GORILLA MOBILE System Prompt" },
      position: [680, 300]
    },
    {
      name: "LINE Official Reply",
      type: "n8n-nodes-base.httpRequest",
      parameters: { url: "https://api.line.me/v2/bot/message/reply", method: "POST" },
      position: [900, 300]
    },
    {
      name: "LINE Notify Repair Queue",
      type: "n8n-nodes-base.line",
      parameters: { trigger: "onStatusChange" },
      position: [900, 480]
    }
  ],
  connections: {
    "Webhook Inbound Chat": { main: [[{ node: "Google Sheets Inventory", type: "main", index: 0 }]] },
    "Google Sheets Inventory": { main: [[{ node: "GPT-4o Sales Agent", type: "main", index: 0 }]] },
    "GPT-4o Sales Agent": { main: [[{ node: "LINE Official Reply", type: "main", index: 0 }]] }
  }
};
