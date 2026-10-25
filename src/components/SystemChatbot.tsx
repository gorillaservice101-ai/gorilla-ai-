import React, { useState } from 'react';
import {
  Bot,
  Facebook,
  Workflow,
  Database,
  Cpu,
  Send,
  ArrowRight,
  CircleCheck,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { InventoryItem, N8nLogEntry } from '../types';
import { simulateAdminReply } from '../utils/storeLogic';

interface SystemChatbotProps {
  inventory: InventoryItem[];
  logs: N8nLogEntry[];
  onAddLog: (log: N8nLogEntry) => void;
  onNewBooking: (itemModel: string) => void;
}

export const SystemChatbot: React.FC<SystemChatbotProps> = ({
  inventory,
  logs,
  onAddLog,
  onNewBooking,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [logFilter, setLogFilter] = useState('');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<{
    query: string;
    reply: string;
    canBook: boolean;
    depositAmount: number;
    matchedItem?: InventoryItem;
  } | null>({
    query: '14 Pro สีม่วงมีไหม',
    reply: 'มีครับพี่ชาย! 📱 iPhone 14 Pro สี Deep Purple ความจุ 128GB เครื่องแท้ สภาพสวยกริ๊บ 98%+ สุขภาพแบต 88%+ ราคาพิเศษ 32,900 บาท แถมฟรีเคสกันกระแทก + ฟิล์มกระจก 9H + ชุดชาร์จแท้ สต็อกเหลือ 5 เครื่องครับ!',
    canBook: true,
    depositAmount: 500,
    matchedItem: inventory.find((i) => i.model.includes('14 Pro')),
  });
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const samplePrompts = [
    '14 Pro สีม่วงมีไหม',
    'Samsung S23 Ultra มีของไหม',
    'iPhone 13 สีดำเหลือกี่เครื่อง',
    'เปลี่ยนจอ iPhone 14 ราคาเท่าไหร่',
  ];

  const handleTestChat = (queryText: string) => {
    const text = queryText.trim();
    if (!text || isSimulating) return;

    setIsSimulating(true);
    setBookedSuccess(false);
    setInputQuery('');
    setActiveStep(0);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Step 1: Webhook received
    setTimeout(() => {
      setActiveStep(1);
      onAddLog({
        id: `log-${Date.now()}-1`,
        time: timeStr,
        type: 'webhook',
        message: `Webhook รับข้อความเข้าจาก LINE OA: "${text}"`,
      });
    }, 400);

    // Step 2: Google Sheet check
    setTimeout(() => {
      setActiveStep(2);
      onAddLog({
        id: `log-${Date.now()}-2`,
        time: timeStr,
        type: 'sheet',
        message: `Google Sheet Query: ค้นหาในสต็อกแบบเรียลไทม์ตาม "${text}"`,
      });
    }, 900);

    // Step 3: GPT-4o analysis
    setTimeout(() => {
      setActiveStep(3);
      const result = simulateAdminReply(text, inventory);
      onAddLog({
        id: `log-${Date.now()}-3`,
        time: timeStr,
        type: 'gpt',
        message: `GPT-4o ตอบกลับ: "${result.reply.slice(0, 50)}..."`,
      });
    }, 1400);

    // Step 4: Reply delivered
    setTimeout(() => {
      setActiveStep(4);
      const result = simulateAdminReply(text, inventory);
      setSimulatedResponse({
        query: text,
        ...result,
      });
      setIsSimulating(false);
    }, 1900);
  };

  const handleBookNow = () => {
    if (!simulatedResponse || !simulatedResponse.canBook) return;
    setBookedSuccess(true);
    onNewBooking(simulatedResponse.matchedItem?.model || 'iPhone 14 Pro');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    onAddLog({
      id: `log-${Date.now()}-order`,
      time: timeStr,
      type: 'order',
      message: `🎉 บันทึกการจองสำเร็จ! ล็อคคิว ${simulatedResponse.matchedItem?.model || 'เครื่อง'} ยอดมัดจำ 500฿ ลงชีท + แจ้ง LINE กลุ่มช่างแล้ว`,
    });
  };

  const pipelineSteps = [
    { icon: Facebook, label: 'Facebook / LINE', sub: 'ลูกค้าทักแชทเข้ามา', color: 'bg-[#1877F2]' },
    { icon: Workflow, label: 'n8n Webhook', sub: 'รับข้อความ → Trigger', color: 'bg-[#ff4d6a]' },
    { icon: Database, label: 'Google Sheet', sub: 'เช็คสต็อก real-time', color: 'bg-[#34A853]' },
    { icon: Cpu, label: 'GPT-4o Agent', sub: 'วิเคราะห์ + ตอบปิดการขาย', color: 'bg-black border border-[var(--border)]' },
    { icon: Send, label: 'Reply + ปุ่มจอง', sub: 'พร้อมรูปจริงและมัดจำ', color: 'bg-[var(--neon)] text-black' },
  ];

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Section Header */}
      <div className="p-5 md:p-6 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
            <span className="mono text-[12px] font-bold text-white">01</span>
          </div>
          <div>
            <h2 className="text-[15px] font-bold flex items-center gap-2 text-white">
              <Bot size={16} className="text-[var(--neon)]" />
              <span>ระบบที่ 1 — AI แอดมินตอบแชทอัตโนมัติ</span>
              <span className="hidden md:inline-flex ml-2 mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--neon-dim)] text-[var(--neon)] border border-[rgba(0,255,136,0.2)]">
                LIVE
              </span>
            </h2>
            <p className="text-[12px] text-[var(--text-2)] mt-0.5">
              Facebook / LINE → n8n → Google Sheet → GPT-4o → ส่งปุ่มจองปิดการขาย
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="mono text-[10px] text-[var(--text-3)] hidden sm:inline">
            AVG RESPONSE 1.8s
          </span>
          <div className="w-2 h-2 rounded-full bg-[var(--neon)] animate-pulse" />
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="p-5 md:p-7 bg-[radial-gradient(at_50%_0%,rgba(0,255,136,0.05),transparent_65%)]">
        {/* Desktop Pipeline Flow */}
        <div className="hidden md:block overflow-x-auto pb-2">
          <div className="flex items-center justify-between gap-2 min-w-[700px]">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrentActive = activeStep === idx;
              const isLast = idx === 4;

              return (
                <div key={step.label} className="flex items-center gap-2 flex-1">
                  <div
                    className={`group relative flex-1 rounded-[14px] border p-3 transition-all ${
                      isCurrentActive
                        ? 'border-[var(--neon)] bg-[rgba(0,255,136,0.1)] shadow-[0_0_20px_rgba(0,255,136,0.25)] scale-[1.02]'
                        : isLast
                        ? 'bg-[var(--neon)] border-[var(--neon)] shadow-[0_0_20px_rgba(0,255,136,0.2)]'
                        : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center mb-2 text-white ${step.color} ${
                        isLast ? '!text-black' : ''
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div
                      className={`mono text-[11px] font-bold leading-tight ${
                        isLast ? 'text-black' : 'text-white'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div
                      className={`mono text-[10px] mt-0.5 ${
                        isLast ? 'text-black/70' : 'text-[var(--text-3)]'
                      }`}
                    >
                      {step.sub}
                    </div>

                    {isCurrentActive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--neon)]" />
                      </span>
                    )}
                  </div>

                  {idx < 4 && (
                    <div className="flex items-center gap-1 px-1 shrink-0">
                      <div className="w-5 h-[1px] bg-[var(--border-2)]" />
                      <ArrowRight size={12} className="text-[var(--text-3)]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sub-flow to create order */}
          <div className="mt-4 grid grid-cols-6 gap-2 min-w-[700px]">
            <div className="col-span-5 flex justify-end pr-[8%]">
              <div className="flex items-center gap-2 mono text-[10px] text-[var(--text-3)]">
                <div className="w-12 h-[1px] bg-[var(--border-2)]" />
                <ArrowRight size={10} />
              </div>
            </div>
            <div className="col-span-1">
              <div className="rounded-[12px] border border-[var(--neon)] bg-[var(--neon-dim)] p-2.5 flex items-center gap-2">
                <CircleCheck size={16} className="text-[var(--neon)] shrink-0" />
                <div>
                  <div className="mono text-[11px] font-bold text-white">สร้าง Order</div>
                  <div className="mono text-[10px] text-[var(--text-2)]">Sheet + LINE แจ้งเตือน</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="md:hidden space-y-2.5">
          {pipelineSteps.map((step, idx) => (
            <div key={step.label} className="flex gap-3 items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border shrink-0 ${
                  idx === 4
                    ? 'bg-[var(--neon)] text-black border-[var(--neon)]'
                    : 'bg-[var(--surface-3)] text-white border-[var(--border)]'
                }`}
              >
                {idx + 1}
              </div>
              <div
                className={`flex-1 rounded-[12px] border p-2.5 min-w-0 ${
                  idx === 4
                    ? 'bg-[var(--neon-dim)] border-[var(--neon)]'
                    : 'bg-[var(--surface-2)] border-[var(--border)]'
                }`}
              >
                <div className="mono text-[12px] font-bold text-white">{step.label}</div>
                <div className="mono text-[11px] text-[var(--text-2)]">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Chat Sandbox */}
        <div className="mt-6 rounded-[14px] border border-[var(--border)] bg-black p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--neon)]" />
              <span className="mono text-[12px] font-bold text-white">
                กล่องทดสอบจำลองตอบแชท (AI Chat Simulator)
              </span>
            </div>
            {isSimulating && (
              <span className="mono text-[10px] text-[var(--neon)] animate-pulse">
                ⚙️ กำลังประมวลผล...
              </span>
            )}
          </div>

          {/* Quick preset queries */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="mono text-[10px] text-[var(--text-3)] py-1">ลองคลิกคำถาม:</span>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleTestChat(prompt)}
                className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--neon)] hover:text-white transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTestChat(inputQuery);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="พิมพ์คำถามลูกค้า เช่น 'มี 14 Pro ไหม', 'S23 Ultra เท่าไหร่'"
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[var(--neon)]"
            />
            <button
              type="submit"
              disabled={isSimulating || !inputQuery.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--neon)] text-black font-bold text-[12px] flex items-center gap-1.5 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Play size={13} fill="currentColor" />
              <span>ส่งทดสอบ</span>
            </button>
          </form>

          {/* Chat Result Preview Box */}
          {simulatedResponse && (
            <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2">
              <div className="flex items-start gap-2">
                <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-2)] shrink-0">
                  ลูกค้าถาม:
                </span>
                <span className="text-[12px] text-white font-medium">"{simulatedResponse.query}"</span>
              </div>

              <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 mono text-[10px] text-[var(--neon)] font-bold">
                    <Bot size={13} />
                    <span>AI แอดมิน (Gorilla Assistant)</span>
                  </div>
                  <span className="mono text-[9px] text-[var(--text-3)]">ตอบใน 1.8 วิ</span>
                </div>

                <p className="text-[12px] leading-relaxed text-[var(--text)]">
                  {simulatedResponse.reply}
                </p>

                {simulatedResponse.canBook && (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBookNow}
                      disabled={bookedSuccess}
                      className={`px-3 py-1.5 rounded-lg mono text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        bookedSuccess
                          ? 'bg-[#34A853] text-white shadow-[0_0_12px_rgba(52,168,83,0.4)]'
                          : 'bg-[var(--neon)] text-black hover:opacity-95 shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                      }`}
                    >
                      <CircleCheck size={13} />
                      <span>{bookedSuccess ? 'จองสำเร็จเรียบร้อย ✓' : 'จองเลย 500฿ ล็อคเครื่อง'}</span>
                    </button>
                    <span className="mono text-[10px] text-[var(--text-3)]">
                      {bookedSuccess ? 'เพิ่มลงยอดจองแล้ว + LINE เตือนช่างแล้ว' : 'แตะเพื่อทดสอบปุ่มจองจริง'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live n8n Terminal execution log */}
        <div className="mt-5 rounded-[12px] bg-black border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] gap-2">
            <div className="flex items-center gap-2 mono text-[10px] text-[var(--text-2)]">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                <div className="w-2 h-2 rounded-full bg-[#28CA42]" />
              </div>
              <span>n8n execution log — live streaming</span>
            </div>
            <input
              type="text"
              placeholder="ค้นหา log (ชื่อลูกค้า/ID)..."
              className="bg-black border border-[var(--border)] rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:border-[var(--neon)] w-32"
              onChange={(e) => setLogFilter(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] text-[var(--neon)]">● online</span>
            </div>
          </div>

          <div className="p-3 mono text-[11px] leading-relaxed space-y-1.5 max-h-[170px] overflow-y-auto">
            {logs
              .filter(log => log.message.toLowerCase().includes(logFilter.toLowerCase()))
              .map((log) => {
              const colorClass =
                log.type === 'webhook'
                  ? 'text-[#7aa2ff]'
                  : log.type === 'sheet'
                  ? 'text-[#34A853]'
                  : log.type === 'gpt'
                  ? 'text-[var(--neon)]'
                  : 'text-[#ffcc33]';

              return (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-[var(--text-3)] shrink-0">[{log.time}]</span>
                  <span className={`${colorClass} font-bold shrink-0`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-[var(--text)] break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
