import React, { useState, useRef } from 'react';
import {
  Wrench,
  Eye,
  Clock,
  Sparkles,
  Plus,
  Search,
  Check,
  ChevronRight,
  Smartphone,
  Send,
} from 'lucide-react';
import { RepairJob } from '../types';
import { getLineNotificationMessage } from '../utils/storeLogic';

interface RepairKanbanProps {
  jobs: RepairJob[];
  onUpdateJobStatus: (id: string, status: RepairJob['status']) => void;
  onOpenNewTicket: () => void;
  globalSearch: string;
}

export const RepairKanban: React.FC<RepairKanbanProps> = ({
  jobs,
  onUpdateJobStatus,
  onOpenNewTicket,
  globalSearch,
}) => {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [previewJobId, setPreviewJobId] = useState<string | null>(null);
  const [copiedLineId, setCopiedLineId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledEnd, setHasScrolledEnd] = useState(false);

  const statuses: RepairJob['status'][] = [
    'รับเครื่อง',
    'ประเมิน',
    'รออะไหล่',
    'ซ่อมเสร็จ',
    'ลูกค้ารับแล้ว',
  ];

  const filteredJobs = jobs.filter(
    (j) =>
      j.customer.toLowerCase().includes(globalSearch.toLowerCase()) ||
      j.model.toLowerCase().includes(globalSearch.toLowerCase()) ||
      j.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      j.issue.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const handleScrollAll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
      setHasScrolledEnd(true);
      setTimeout(() => setHasScrolledEnd(false), 2500);
    }
  };

  const getStatusColor = (status: RepairJob['status']) => {
    switch (status) {
      case 'รับเครื่อง':
        return '#00FF88';
      case 'ประเมิน':
        return '#FFCC33';
      case 'รออะไหล่':
        return '#FF4D6A';
      case 'ซ่อมเสร็จ':
        return '#7aa2ff';
      case 'ลูกค้ารับแล้ว':
        return '#9a9aa3';
    }
  };

  const handleCopyLineText = (job: RepairJob) => {
    const text = getLineNotificationMessage(job);
    navigator.clipboard.writeText(text);
    setCopiedLineId(job.id);
    setTimeout(() => setCopiedLineId(null), 2000);
  };

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Section Header */}
      <div className="p-5 md:p-6 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
            <span className="mono text-[12px] font-bold text-white">02</span>
          </div>
          <div>
            <h2 className="text-[15px] font-bold flex items-center gap-2 text-white">
              <Wrench size={16} className="text-[var(--neon)]" />
              <span>ระบบที่ 2 — คิวซ่อมอัจฉริยะ + LINE แจ้งเตือน</span>
            </h2>
            <p className="text-[12px] text-[var(--text-2)] mt-0.5">
              ลากการ์ดเพื่อเปลี่ยนสถานะ • ระบบส่งข้อความ LINE แจ้งเตือนลูกค้าอัตโนมัติ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewTicket}
            className="flex items-center gap-1.5 mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--neon)] text-black font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={13} className="stroke-[3]" />
            <span className="hidden sm:inline">เพิ่มคิว</span>
          </button>

          <button
            type="button"
            onClick={handleScrollAll}
            className={`hidden md:flex items-center gap-1.5 mono text-[11px] px-3 py-1.5 rounded-full border transition-all ${
              hasScrolledEnd
                ? 'bg-[var(--neon)] text-black border-[var(--neon)]'
                : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-white'
            }`}
          >
            <Eye size={12} />
            <span>{hasScrolledEnd ? 'เลื่อนดูครบแล้ว ✓' : `ดูทั้งหมด ${jobs.length} คิว`}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div
        ref={scrollContainerRef}
        className="p-4 md:p-5 flex gap-3 overflow-x-auto pb-6 max-w-full"
      >
        {statuses.map((status) => {
          const columnJobs = filteredJobs.filter((j) => j.status === status);
          const isDroppingHere = draggedJobId !== null;

          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedJobId) {
                  onUpdateJobStatus(draggedJobId, status);
                  setDraggedJobId(null);
                }
              }}
              className={`min-w-[245px] w-[245px] shrink-0 rounded-[14px] border bg-[var(--surface-2)] p-2.5 flex flex-col gap-2 transition-all ${
                isDroppingHere
                  ? 'border-[var(--neon)]/40 bg-[rgba(0,255,136,0.03)]'
                  : 'border-[var(--border)]'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: getStatusColor(status) }}
                  />
                  <span className="mono text-[12px] font-bold text-white">{status}</span>
                  <span className="mono text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-2)]">
                    {columnJobs.length}
                  </span>
                </div>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 min-h-[140px]">
                {columnJobs.map((job) => {
                  const isPreviewed = previewJobId === job.id;
                  const isDragged = draggedJobId === job.id;
                  const lineMessage = getLineNotificationMessage(job);

                  return (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={() => setDraggedJobId(job.id)}
                      onDragEnd={() => setDraggedJobId(null)}
                      onClick={() => setPreviewJobId(isPreviewed ? null : job.id)}
                      className={`group relative rounded-[12px] border bg-[var(--surface)] p-3 cursor-grab active:cursor-grabbing hover:border-[var(--border-2)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] ${
                        isDragged ? 'opacity-40 rotate-[1deg] scale-[0.98]' : ''
                      } ${
                        isPreviewed
                          ? 'border-[var(--neon)] shadow-[0_0_16px_rgba(0,255,136,0.15)]'
                          : 'border-[var(--border)]'
                      }`}
                    >
                      {/* Top Job Tag & Time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-black border border-[var(--border)] text-[var(--text-2)] font-medium">
                          {job.id}
                        </span>
                        <span className="mono text-[10px] text-[var(--text-3)] flex items-center gap-1">
                          <Clock size={10} />
                          {job.time}
                        </span>
                      </div>

                      {/* Device Model and Customer Issue */}
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center text-[14px] shrink-0">
                          <Smartphone size={15} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-bold leading-tight truncate text-white">
                            {job.model}
                          </div>
                          <div className="text-[11px] text-[var(--text-2)] truncate">
                            {job.customer} • {job.issue}
                          </div>
                        </div>
                      </div>

                      {/* Footer Info: technician & action hint */}
                      <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: job.color }}
                          />
                          <span className="mono text-[10px] text-[var(--text-3)]">
                            {job.technician || 'ช่างประจำ'}
                          </span>
                        </div>
                        <span className="mono text-[10px] text-[var(--neon)] flex items-center gap-1">
                          ดู LINE <ChevronRight size={10} />
                        </span>
                      </div>

                      {/* LINE Auto Preview Box (when card clicked) */}
                      {isPreviewed && (
                        <div
                          className="mt-3 rounded-[10px] bg-[#06C755] p-2.5 text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 mono text-[10px] font-bold">
                              <div className="w-4 h-4 rounded-full bg-white text-[#06C755] flex items-center justify-center text-[10px]">
                                ✓
                              </div>
                              <span>LINE Auto Notification</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyLineText(job)}
                              className="mono text-[9px] px-2 py-0.5 rounded bg-black/25 hover:bg-black/40 text-white flex items-center gap-1 transition-colors"
                            >
                              {copiedLineId === job.id ? <Check size={10} /> : <Send size={10} />}
                              <span>{copiedLineId === job.id ? 'ก็อปแล้ว' : 'ก็อปข้อความ'}</span>
                            </button>
                          </div>

                          <div className="text-[11px] leading-snug bg-white text-black rounded-[10px] p-2.5 shadow-sm whitespace-pre-line">
                            {lineMessage}
                          </div>

                          {/* Quick move buttons for touch screens or fast clicks */}
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <div className="mono text-[9px] text-white/80 mb-1">
                              ย้ายสถานะทันที:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {statuses.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => onUpdateJobStatus(job.id, s)}
                                  className={`mono text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                                    job.status === s
                                      ? 'bg-black text-white font-bold'
                                      : 'bg-black/20 text-white hover:bg-black/40'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {columnJobs.length === 0 && (
                  <div className="rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface)]/30 p-6 text-center">
                    <div className="mono text-[11px] text-[var(--text-3)]">ไม่มีคิวในขั้นตอนนี้</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Footer Bar */}
      <div className="px-5 py-3 bg-[var(--surface-2)] border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 mono text-[11px] text-[var(--text-2)]">
        <span className="flex items-center gap-2">
          <Sparkles size={13} className="text-[var(--neon)]" />
          <span>ลากการ์ดเพื่ออัปเดตสถานะ → ระบบยิงข้อความ LINE หาลูกค้าทันที</span>
        </span>
        <span className="hidden sm:inline">
          {jobs.length} คิวทั้งหมด • มีการรับประกันงานซ่อม 90 วัน
        </span>
      </div>
    </section>
  );
};
