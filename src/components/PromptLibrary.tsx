import React, { useState } from 'react';
import {
  Zap,
  Copy,
  Check,
  Play,
  TriangleAlert,
  MessageSquare,
  PackageCheck,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/initialData';

export const PromptLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentPrompt = PROMPT_TEMPLATES[activeTab];

  const handleCopyPrompt = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const featureHighlights = [
    { icon: MessageSquare, label: 'ตอบเร็ว 1.8s', sub: 'ลดเวลารอจาก 15 นาที' },
    { icon: PackageCheck, label: 'สต็อกแม่นยำ', sub: 'ลดอาการยิงมั่ว 90%' },
    { icon: Banknote, label: 'ปิดยอดไว x3', sub: 'ด้วยปุ่มมัดจำ 500฿' },
  ];

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--neon)] flex items-center justify-center text-black shrink-0">
            <Zap size={16} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
              <span>Prompt สำเร็จรูป — ก็อปไปวางใน n8n ได้เลย</span>
            </h2>
            <p className="text-[11px] text-[var(--text-2)]">
              เทสแล้วกับร้านมือถือจริง ปิดการขายได้ทันทีโดยไม่ต้องแก้
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 flex gap-2 overflow-x-auto pb-2 border-b border-[var(--border)]">
        {PROMPT_TEMPLATES.map((tmpl, idx) => (
          <button
            key={tmpl.key}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`whitespace-nowrap mono text-[11px] px-3 py-1.5 rounded-full border transition-all ${
              activeTab === idx
                ? 'bg-[var(--neon)] text-black border-[var(--neon)] font-bold shadow-[0_0_12px_rgba(0,255,136,0.25)]'
                : 'bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)] hover:border-[var(--border-2)] hover:text-white'
            }`}
          >
            {tmpl.title.split(' ')[0]} {tmpl.title.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Content box */}
      <div className="p-5">
        <div className="rounded-[14px] border border-[var(--border)] bg-black overflow-hidden">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] gap-2">
            <div>
              <div className="text-[13px] font-bold text-white">{currentPrompt.title}</div>
              <div className="text-[11px] text-[var(--text-2)] mt-0.5">{currentPrompt.desc}</div>
            </div>

            <button
              type="button"
              onClick={() => handleCopyPrompt(currentPrompt.content, currentPrompt.key)}
              className={`flex items-center gap-1.5 mono text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all ${
                copiedKey === currentPrompt.key
                  ? 'bg-[var(--neon)] text-black shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {copiedKey === currentPrompt.key ? (
                <>
                  <Check size={13} className="stroke-[3]" />
                  <span>ก็อปปี้แล้ว!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>ก็อป Prompt</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 mono text-[11px] leading-relaxed text-[var(--text-2)] whitespace-pre-wrap break-words max-h-[280px] overflow-auto">
            {currentPrompt.content}
          </pre>

          <div className="px-4 py-2.5 bg-[var(--surface)] border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 mono text-[10px] text-[var(--text-3)]">
            <span className="flex items-center gap-1.5 text-[var(--text-2)]">
              <Play size={10} fill="currentColor" className="text-[var(--neon)]" />
              <span>วางใน n8n → AI Agent Node → System Message</span>
            </span>
            <span className="flex items-center gap-1 text-[#ffcc33]">
              <TriangleAlert size={10} />
              <span>ห้ามลบตัวแปรปีกกา เช่น {'{{ $json.stock }}'}</span>
            </span>
          </div>
        </div>

        {/* Feature stat highlights */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {featureHighlights.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.label}
                className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-3"
              >
                <Icon size={14} className="text-[var(--neon)] mb-1.5" />
                <div className="mono text-[11px] font-bold text-white">{feat.label}</div>
                <div className="mono text-[10px] text-[var(--text-3)]">{feat.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
