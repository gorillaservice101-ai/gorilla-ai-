export interface RepairJob {
  id: string;
  model: string;
  customer: string;
  phone?: string;
  issue: string;
  status: 'รับเครื่อง' | 'ประเมิน' | 'รออะไหล่' | 'ซ่อมเสร็จ' | 'ลูกค้ารับแล้ว';
  time: string;
  color: string;
  technician?: string;
  estimatedCost?: number;
}

export interface InventoryItem {
  model: string;
  color: string;
  cap: string;
  cost: number;
  price: number;
  stock: number;
  status: 'พร้อมขาย' | 'ขายดี' | 'ใกล้หมด' | 'หมด';
  img: string;
}

export function parsePrice(val: string | number): number {
  if (typeof val === 'number') return val;
  return Number(val.replace(/,/g, '')) || 0;
}

export function formatPrice(num: number): string {
  return num.toLocaleString('th-TH');
}

export function calculateProfit(sellingPrice: number, costPrice: number): { profit: number; marginPercent: number } {
  const profit = sellingPrice - costPrice;
  const marginPercent = costPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;
  return { profit, marginPercent };
}

export function getLineNotificationMessage(job: RepairJob): string {
  let statusText = '';
  let closing = '';

  switch (job.status) {
    case 'รับเครื่อง':
      statusText = 'ทางร้านได้รับเครื่องเรียบร้อยแล้ว ช่างกำลังตรวจเช็คเบื้องต้น';
      closing = 'จะแจ้งผลการประเมินให้ทราบใน 1-2 ชั่วโมงครับ';
      break;
    case 'ประเมิน':
      statusText = `ช่างประเมินอาการ "${job.issue}" เรียบร้อยแล้ว`;
      closing = job.estimatedCost ? `ค่าบริการประมาณ ${formatPrice(job.estimatedCost)} บาท ยืนยันซ่อมแจ้งแอดมินได้เลยครับ` : 'รอการยืนยันราคาจากลูกค้าครับ';
      break;
    case 'รออะไหล่':
      statusText = 'สั่งอะไหล่แท้ตรงรุ่นเรียบร้อย อยู่ระหว่างการจัดส่ง';
      closing = 'ของถึงปุ๊บช่างลงมือซ่อมทันทีครับ ไม่เกิน 1-2 วัน';
      break;
    case 'ซ่อมเสร็จ':
      statusText = 'ตรวจเช็ค 24 จุด ผ่านทุกฟังก์ชัน เครื่องซ่อมเสร็จสมบูรณ์แล้ว!';
      closing = 'สามารถเข้ามารับเครื่องได้เลยครับ 🎉 ยินดีให้บริการครับ';
      break;
    case 'ลูกค้ารับแล้ว':
      statusText = 'ลูกค้ารับเครื่องและทดสอบเรียบร้อยแล้ว';
      closing = 'รับประกันงานซ่อม 90 วัน มีข้อสงสัยสอบถามได้ตลอดเวลาครับ ขอบพระคุณครับ 🙏';
      break;
  }

  return `สวัสดีครับ ${job.customer}! แจ้งสถานะงานซ่อม ${job.id} (${job.model})
สถานะปัจจุบัน: [${job.status}]
${statusText}
${closing}
— Gorilla Mobile Service Center`;
}

export function searchInventory(items: InventoryItem[], query: string): InventoryItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.model.toLowerCase().includes(q) ||
      item.color.toLowerCase().includes(q) ||
      item.cap.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
  );
}

export function simulateAdminReply(
  userQuery: string,
  inventory: InventoryItem[]
): {
  reply: string;
  matchedItem?: InventoryItem;
  canBook: boolean;
  depositAmount: number;
} {
  const text = userQuery.toLowerCase();

  // Find if asking about specific model
  const match = inventory.find(
    (item) =>
      text.includes(item.model.toLowerCase().replace('iphone ', '')) ||
      text.includes(item.model.toLowerCase()) ||
      (text.includes('s23') && item.model.includes('S23'))
  );

  if (match) {
    if (match.stock > 0) {
      return {
        reply: `มีครับพี่ชาย! 📱 ${match.model} สี ${match.color} ความจุ ${match.cap} เครื่องแท้ สภาพสวย 98%+ แบต 88%+ ราคาพิเศษเพียง ${formatPrice(match.price)} บาท (แถมเคสใส + ฟิล์มกระจก 9H + ชุดชาร์จแท้) สต็อกเหลือ ${match.stock} เครื่องครับ!`,
        matchedItem: match,
        canBook: true,
        depositAmount: 500,
      };
    } else {
      const alternative = inventory.find((i) => i.stock > 0 && i.model.includes(match.model.split(' ')[0]));
      const altText = alternative ? ` แนะนำดูเป็น ${alternative.model} ${alternative.cap} แทนไหมครับ มีของพร้อมส่งเลย ราคา ${formatPrice(alternative.price)} บาทครับ` : '';
      return {
        reply: `ขออภัยด้วยครับพี่ชาย ตอนนี้ ${match.model} ${match.cap} ของหมดชั่วคราวครับ กำลังเข้าสต็อกเพิ่มวันพรุ่งนี้${altText}`,
        matchedItem: match,
        canBook: false,
        depositAmount: 0,
      };
    }
  }

  if (text.includes('ซ่อม') || text.includes('จอ') || text.includes('แบต')) {
    return {
      reply: 'ยินดีบริการครับพี่ชาย! ทางร้านซ่อมด้วยอะไหล่แท้ ประกัน 90 วัน เปลี่ยนจอ/แบตรอรับได้ใน 30 นาที สามารถนำเครื่องมาตรวจเช็คฟรีไม่มีค่าใช้จ่ายได้ที่หน้าร้านเลยครับ',
      canBook: false,
      depositAmount: 0,
    };
  }

  return {
    reply: 'สวัสดีครับ Gorilla Mobile ยินดีให้บริการครับ! สนใจมือถือมือสองรุ่นไหน หรือต้องการส่งซ่อมเครื่อง สอบถามสเปคและสต็อกกับผมได้เลยครับพี่ชาย',
    canBook: false,
    depositAmount: 0,
  };
}

export function validateRepairTicket(data: {
  customer: string;
  phone: string;
  model: string;
  issue: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.customer || data.customer.trim().length < 2) {
    errors.customer = 'กรุณาระบุชื่อลูกค้าอย่างน้อย 2 ตัวอักษร';
  }
  if (!data.model || data.model.trim().length < 2) {
    errors.model = 'กรุณาระบุรุ่นมือถือ';
  }
  if (!data.issue || data.issue.trim().length < 2) {
    errors.issue = 'กรุณาระบุอาการเสีย';
  }
  if (data.phone && !/^[0-9\-+ ]{9,15}$/.test(data.phone.trim())) {
    errors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
