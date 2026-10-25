import React, { useState } from 'react';
import { Hammer, Check, Download, ExternalLink } from 'lucide-react';
import { N8N_WORKFLOW_TEMPLATE } from '../data/initialData';

interface SetupChecklistProps {
  onOpenExportModal: () => void;
}

export const SetupChecklist: React.FC<SetupChecklistProps> = ({ onOpenExportModal }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1]);

  const steps = [
    'สร้าง Google Sheet ตาม Template สต็อกจริง + เปิดแชร์ "Anyone with link can view"',
    'Import n8n Workflow (ไฟล์ .json) แล้วใส่ OpenAI API Key หรือ Gemini API Key',
    'เชื่อมต่อ Facebook Page และ LINE Official Account Webhook เข้ากับ n8n',
    'ตั้งค่า LINE Notify Token หรือ LINE Messaging API สำหรับแจ้งเตือนคิวซ่อม',
    'ทดสอบพิมพ์ "iPhone 14 มีไหม" ทางแชทเพจ → ถ้าบอทตอบกลับพร้อมรูปและปุ่มจอง = สำเร็จ!',
  ];

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const downloadN8nJson = () => {
    const jsonStr = JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gorilla-ai-mobile-n8n-workflow.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="rounded-[20px] border border-[var(--neon)]/25 bg-[linear-gradient(135deg,rgba(0,255,136,0.07),rgba(0,255,136,0.02))] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--neon)] flex items-center justify-center text-black shrink-0">
            <Hammer size={12} />
          </div>
          <h3 className="mono text-[12px] font-bold tracking-wider text-white">
            SETUP CHECKLIST — ทำตามนี้ 30 นาทีเสร็จ
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadN8nJson}
            className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--neon)]/40 text-[var(--neon)] hover:bg-[var(--neon)] hover:text-black transition-colors flex items-center gap-1 font-bold"
          >
            <Download size={11} />
            <span>โหลด .json ไป Import</span>
          </button>
        </div>
      </div>

      <div className="space-y-2.5 mono text-[11px]">
        {steps.map((text, idx) => {
          const isDone = completedSteps.includes(idx);
          return (
            <div
              key={text}
              onClick={() => toggleStep(idx)}
              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                isDone ? 'bg-black/30' : 'bg-transparent hover:bg-black/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-colors ${
                  isDone
                    ? 'bg-[var(--neon)] text-black border-[var(--neon)] shadow-[0_0_8px_rgba(0,255,136,0.4)]'
                    : 'bg-black text-[var(--neon)] border-[var(--neon)]/40'
                }`}
              >
                {isDone ? <Check size={11} className="stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`leading-relaxed transition-colors ${
                  isDone ? 'text-[var(--text)] line-through opacity-70' : 'text-[var(--text-2)]'
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 mono text-[10px] px-3 py-2 rounded-full bg-black border border-[var(--border)] text-[var(--text-2)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--neon)] animate-pulse" />
          <span>สำเร็จแล้ว {completedSteps.length}/{steps.length} ขั้นตอน • พร้อมเปิดใช้งานจริง</span>
        </div>
        <button
          type="button"
          onClick={onOpenExportModal}
          className="text-[var(--neon)] hover:underline flex items-center gap-1"
        >
          <span>ดู Schema n8n</span>
          <ExternalLink size={10} />
        </button>
      </div>
    </section>
  );
};
