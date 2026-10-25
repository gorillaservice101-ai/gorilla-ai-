import React from 'react';
import { Activity, Bot, ChevronDown, Plus, Download, Search } from 'lucide-react';

interface HeaderProps {
  onOpenNewTicket: () => void;
  onOpenChatSimulator: () => void;
  onOpenExportModal: () => void;
  executionCount: number;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTicket,
  onOpenChatSimulator,
  onOpenExportModal,
  executionCount,
  onSearch,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[var(--border)] bg-[rgba(7,7,9,0.88)]">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 h-[64px] flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[var(--neon)] flex items-center justify-center text-black font-black text-[18px] shadow-[0_0_20px_var(--neon-glow)] shrink-0">
              G
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="mono font-bold text-[16px] tracking-[-0.02em] text-white">
                  GORILLA AI OS
                </span>
                <span className="hidden sm:inline text-[11px] text-[var(--text-2)] mono tracking-widest">
                  v2.4.1 • TH
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-2)] -mt-0.5 hidden sm:block">
                ระบบบริหารร้านมือถืออัตโนมัติ
              </div>
            </div>
          </div>
        </div>

        {/* Search & Actions Zone */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
          <div className="relative hidden md:flex items-center w-full max-w-[300px]">
            <Search size={14} className="absolute left-3 text-[var(--text-3)]" />
            <input
              type="text"
              placeholder="ค้นหางานซ่อมหรือสต็อก..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[var(--neon)]"
            />
          </div>

          <button
            onClick={onOpenChatSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[12px] font-medium text-[var(--text)] hover:border-[var(--neon)] hover:text-white transition-colors"
            title="ทดสอบการตอบแชทของ AI"
          >
            <Bot size={14} className="text-[var(--neon)]" />
            <span className="hidden sm:inline">จำลองแชท AI</span>
          </button>

          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--neon)] text-black text-[12px] font-bold shadow-[0_0_12px_rgba(0,255,136,0.2)] hover:opacity-95 transition-all"
          >
            <Plus size={14} className="stroke-[3]" />
            <span className="font-bold text-black/90 hover:text-black transition-colors">เปิดคิวซ่อม</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-2)] hover:text-white transition-colors"
            title="ดาวน์โหลด n8n Workflow JSON"
          >
            <Download size={13} />
            <span>Workflow JSON</span>
          </button>

          <div className="hidden xl:flex items-center gap-2 mono text-[11px] text-[var(--text-3)] pl-2 border-l border-[var(--border)]">
            <Activity size={13} />
            <span>{executionCount} n8n triggers</span>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[13px] shrink-0">
              👨🏻‍💻
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-[12px] font-medium text-white">บอส Gorilla</div>
              <div className="text-[10px] text-[var(--text-2)]">Owner</div>
            </div>
            <ChevronDown size={14} className="text-[var(--text-3)] hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
