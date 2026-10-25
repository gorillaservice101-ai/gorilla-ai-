import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { SystemChatbot } from './components/SystemChatbot';
import { RepairKanban } from './components/RepairKanban';
import { InventorySheet } from './components/InventorySheet';
import { PromptLibrary } from './components/PromptLibrary';
import { SetupChecklist } from './components/SetupChecklist';
import { NewTicketModal } from './components/NewTicketModal';
import { N8nExportModal } from './components/N8nExportModal';
import { ChatSimulatorModal } from './components/ChatSimulatorModal';
import {
  INITIAL_REPAIR_JOBS,
  INITIAL_INVENTORY,
  INITIAL_LOGS,
} from './data/initialData';
import { RepairJob, InventoryItem, N8nLogEntry } from './types';

export default function App() {
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>(INITIAL_REPAIR_JOBS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [logs, setLogs] = useState<N8nLogEntry[]>(INITIAL_LOGS);
  const [activeStatIndex, setActiveStatIndex] = useState<number | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isChatSimOpen, setIsChatSimOpen] = useState(false);

  // Dynamic ticket counter
  const nextTicketNumber = `GOR-${215 + repairJobs.length - 6}`;

  const handleUpdateJobStatus = (id: string, status: RepairJob['status']) => {
    setRepairJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status } : job))
    );

    // Add log entry
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const targetJob = repairJobs.find((j) => j.id === id);

    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        time: timeStr,
        type: 'line',
        message: `LINE Notify: ส่งข้อความแจ้งเตือนสถานะ "${status}" ให้ ${targetJob?.customer || 'ลูกค้า'} (${targetJob?.model || id}) เรียบร้อยแล้ว`,
      },
    ]);
  };

  const handleAddNewJob = (newJob: RepairJob) => {
    setRepairJobs((prev) => [newJob, ...prev]);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        time: timeStr,
        type: 'line',
        message: `สร้างคิวซ่อมใหม่ ${newJob.id}: รับเครื่อง ${newJob.model} (${newJob.customer}) เรียบร้อยแล้ว`,
      },
    ]);
  };

  const handleUpdateStock = (model: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.model === model) {
          let status = item.status;
          if (newStock === 0) status = 'หมด';
          else if (newStock <= 2) status = 'ใกล้หมด';
          else if (newStock >= 8) status = 'ขายดี';
          else status = 'พร้อมขาย';

          return { ...item, stock: newStock, status };
        }
        return item;
      })
    );
  };

  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);
  };

  const handleNewBooking = (itemModel: string) => {
    // Decrease stock by 1
    setInventory((prev) =>
      prev.map((i) => {
        if (i.model.includes(itemModel) && i.stock > 0) {
          const newStock = i.stock - 1;
          const status = newStock === 0 ? 'หมด' : newStock <= 2 ? 'ใกล้หมด' : i.status;
          return { ...i, stock: newStock, status };
        }
        return i;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-x-hidden max-w-[100vw] selection:bg-[var(--neon)] selection:text-black">
      {/* Background Glows & Grid */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[900px] max-w-full h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.12),transparent_60%)] blur-[80px]" />
        <div className="absolute top-[30%] left-[0%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.06),transparent_70%)] blur-[60px]" />
      </div>

      {/* Header */}
      <Header
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        onOpenChatSimulator={() => setIsChatSimOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        executionCount={47 + logs.length - 4}
        onSearch={setGlobalSearch}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 md:py-8 relative z-10">
        {/* KPI Stat Cards */}
        <StatCards
          activeCardIndex={activeStatIndex}
          onToggleCard={setActiveStatIndex}
          repairCount={repairJobs.length}
        />

        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0">
          {/* Main Column (8 cols): System 1 & System 2 */}
          <div className="xl:col-span-8 space-y-6 min-w-0">
            {/* System 1: AI แอดมินตอบแชทอัตโนมัติ */}
            <SystemChatbot
              inventory={inventory}
              logs={logs}
              onAddLog={(log) => setLogs((prev) => [...prev, log])}
              onNewBooking={handleNewBooking}
            />

            {/* System 2: คิวซ่อมอัจฉริยะ + LINE แจ้งเตือน */}
            <RepairKanban
              jobs={repairJobs}
              onUpdateJobStatus={handleUpdateJobStatus}
              onOpenNewTicket={() => setIsNewTicketOpen(true)}
              globalSearch={globalSearch}
            />
          </div>

          {/* Side Column (4 cols): System 3, System 4 & Setup Checklist */}
          <div className="xl:col-span-4 space-y-6 min-w-0">
            {/* System 3: Template Google Sheet (สต็อกจริง) */}
            <InventorySheet
              inventory={inventory}
              onUpdateStock={handleUpdateStock}
              onAddItem={handleAddInventoryItem}
              globalSearch={globalSearch}
            />

            {/* System 4: Prompt สำเร็จรูป */}
            <PromptLibrary />

            {/* Setup Checklist */}
            <SetupChecklist onOpenExportModal={() => setIsExportOpen(true)} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-[var(--border)] pt-6 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mono text-[11px] text-[var(--text-3)]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 GORILLA AI OS • พัฒนาขึ้นสำหรับร้านจำหน่ายและซ่อมมือถือในประเทศไทย</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-[var(--border-2)]" />
            <span className="flex items-center gap-1.5">
              <Smartphone size={13} />
              <span>n8n + GPT-4o + Google Sheet + LINE Official API</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
              Latency 38ms
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
              Uptime 99.98%
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--neon-dim)] border border-[rgba(0,255,136,0.2)] text-[var(--neon)] font-bold">
              3 ระบบ ACTIVE
            </span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSave={handleAddNewJob}
        nextTicketId={nextTicketNumber}
      />

      <N8nExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <ChatSimulatorModal
        isOpen={isChatSimOpen}
        onClose={() => setIsChatSimOpen(false)}
        inventory={inventory}
        onNewBooking={handleNewBooking}
      />
    </div>
  );
}
