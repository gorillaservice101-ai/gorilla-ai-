import React, { useState } from 'react';
import { X, Download, Copy, Check, Workflow } from 'lucide-react';
import { N8N_WORKFLOW_TEMPLATE } from '../data/initialData';

interface N8nExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const N8nExportModal: React.FC<N8nExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gorilla-ai-mobile-n8n-workflow.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="n8n-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#ff4d6a] text-white flex items-center justify-center font-bold">
              <Workflow size={16} />
            </div>
            <div>
              <h2 id="n8n-modal-title" className="text-[15px] font-bold text-white">
                n8n Workflow Template (.json)
              </h2>
              <p className="text-[11px] text-[var(--text-2)]">
                ไฟล์โครงสร้างเวิร์กโฟลว์สำเร็จรูป สำหรับนำเข้าใน n8n เพื่อเปิดใช้งานอัตโนมัติ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-2)] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[11px] space-y-1">
          <div className="font-bold text-[var(--neon)]">วิธีนำเข้าใน n8n:</div>
          <div className="text-[var(--text-2)]">
            1. กดปุ่ม "ดาวน์โหลด .json" หรือ "ก็อปปี้ JSON"
            <br />
            2. เปิดหน้า n8n ของท่าน → เมนู <b>Workflows</b> → <b>Import from File</b> (หรือกด Ctrl+V วางใน Canvas)
            <br />
            3. ใส่ Credentials: <b>OpenAI / Gemini API Key</b> และ <b>Google Sheet OAuth</b>
            <br />
            4. คัดลอก Webhook URL ไปวางใน Webhook ของ Facebook Page และ LINE Developers
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col rounded-[12px] border border-[var(--border)] bg-black">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
            <span className="mono text-[10px] text-[var(--text-3)]">gorilla-workflow.json</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="mono text-[10px] px-2.5 py-1 rounded bg-[var(--surface-3)] text-white hover:bg-[var(--border-2)] flex items-center gap-1"
              >
                {copied ? <Check size={11} className="text-[var(--neon)]" /> : <Copy size={11} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'ก็อปปี้ JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="mono text-[10px] px-2.5 py-1 rounded bg-[var(--neon)] text-black font-bold flex items-center gap-1"
              >
                <Download size={11} />
                <span>ดาวน์โหลด .json</span>
              </button>
            </div>
          </div>
          <pre className="p-4 mono text-[11px] leading-relaxed text-[var(--text-2)] overflow-auto flex-1">
            {jsonString}
          </pre>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mono text-[12px] px-5 py-2 rounded-lg bg-white text-black font-bold hover:bg-slate-200"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
