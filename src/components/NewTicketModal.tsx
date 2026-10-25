import React, { useState } from 'react';
import { X, Wrench, Send, AlertCircle } from 'lucide-react';
import { RepairJob } from '../types';
import { validateRepairTicket, getLineNotificationMessage } from '../utils/storeLogic';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: RepairJob) => void;
  nextTicketId: string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nextTicketId,
}) => {
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState('');
  const [issue, setIssue] = useState('');
  const [technician, setTechnician] = useState('ช่างเอก');
  const [estimatedCost, setEstimatedCost] = useState('1500');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const previewJob: RepairJob = {
    id: nextTicketId,
    customer: customer.trim() || 'คุณลูกค้า',
    phone,
    model: model.trim() || 'iPhone รุ่นที่นำมาซ่อม',
    issue: issue.trim() || 'ตรวจเช็คอาการทั่วไป',
    status: 'รับเครื่อง',
    time: 'ตอนนี้',
    color: '#00FF88',
    technician,
    estimatedCost: Number(estimatedCost) || 0,
  };

  const linePreview = getLineNotificationMessage(previewJob);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRepairTicket({
      customer,
      phone,
      model,
      issue,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave({
      ...previewJob,
      customer: customer.trim(),
      model: model.trim(),
      issue: issue.trim(),
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--neon)] text-black flex items-center justify-center font-bold">
              <Wrench size={16} />
            </div>
            <div>
              <h2 id="new-ticket-title" className="text-[15px] font-bold text-white">
                เปิดคิวซ่อมใหม่ ({nextTicketId})
              </h2>
              <p className="text-[11px] text-[var(--text-2)]">
                กรอกข้อมูลรับเครื่องเข้าศูนย์ซ่อม และส่งข้อความ LINE แจ้งเตือนลูกค้า
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
                ชื่อลูกค้า *
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  if (errors.customer) setErrors((prev) => ({ ...prev, customer: '' }));
                }}
                placeholder="เช่น คุณกอล์ฟ, คุณเมย์"
                className={`w-full bg-[var(--surface-2)] border rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none ${
                  errors.customer ? 'border-[#ff4d6a]' : 'border-[var(--border)] focus:border-[var(--neon)]'
                }`}
              />
              {errors.customer && (
                <div className="text-[10px] text-[#ff4d6a] flex items-center gap-1 mt-1">
                  <AlertCircle size={10} />
                  <span>{errors.customer}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
                เบอร์โทรติดต่อ
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="เช่น 081-234-5678"
                className={`w-full bg-[var(--surface-2)] border rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none ${
                  errors.phone ? 'border-[#ff4d6a]' : 'border-[var(--border)] focus:border-[var(--neon)]'
                }`}
              />
              {errors.phone && (
                <div className="text-[10px] text-[#ff4d6a] flex items-center gap-1 mt-1">
                  <AlertCircle size={10} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
                รุ่นมือถือ *
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
                }}
                placeholder="เช่น iPhone 14 Pro, Samsung S22"
                className={`w-full bg-[var(--surface-2)] border rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none ${
                  errors.model ? 'border-[#ff4d6a]' : 'border-[var(--border)] focus:border-[var(--neon)]'
                }`}
              />
              {errors.model && (
                <div className="text-[10px] text-[#ff4d6a] flex items-center gap-1 mt-1">
                  <AlertCircle size={10} />
                  <span>{errors.model}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
                ช่างผู้รับผิดชอบ
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[var(--neon)]"
              >
                <option value="ช่างเอก">ช่างเอก (บอร์ด/จอ)</option>
                <option value="ช่างบอย">ช่างบอย (เปลี่ยนแบต/แพรชาร์จ)</option>
                <option value="ช่างโต้ง">ช่างโต้ง (งานไมโครโซลเดอร์ริ่ง)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
              อาการเสีย / รายละเอียดที่ลูกค้าแจ้ง *
            </label>
            <input
              type="text"
              value={issue}
              onChange={(e) => {
                setIssue(e.target.value);
                if (errors.issue) setErrors((prev) => ({ ...prev, issue: '' }));
              }}
              placeholder="เช่น จอแตกทัชไม่ติด, โดนน้ำเปิดไม่ติด, แบตบวมดันฝาหลัง"
              className={`w-full bg-[var(--surface-2)] border rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none ${
                errors.issue ? 'border-[#ff4d6a]' : 'border-[var(--border)] focus:border-[var(--neon)]'
              }`}
            />
            {errors.issue && (
              <div className="text-[10px] text-[#ff4d6a] flex items-center gap-1 mt-1">
                <AlertCircle size={10} />
                <span>{errors.issue}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block mono text-[11px] font-medium text-[var(--text-2)] mb-1">
              ราคาประเมินเบื้องต้น (บาท)
            </label>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="1500"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[var(--neon)]"
            />
          </div>

          {/* Real-time LINE preview */}
          <div className="rounded-[12px] bg-[#06C755] p-3 text-white">
            <div className="flex items-center gap-1.5 mono text-[10px] font-bold mb-1">
              <Send size={11} />
              <span>ตัวอย่างข้อความ LINE แจ้งเตือนลูกค้าทันทีเมื่อกดบันทึก:</span>
            </div>
            <div className="bg-white text-black text-[11px] leading-snug p-2.5 rounded-[10px] whitespace-pre-line font-medium">
              {linePreview}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="mono text-[12px] px-4 py-2 rounded-lg bg-[var(--surface-2)] text-[var(--text-2)] hover:text-white"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="mono text-[12px] px-5 py-2 rounded-lg bg-[var(--neon)] text-black font-bold hover:opacity-95 shadow-[0_0_12px_rgba(0,255,136,0.2)]"
            >
              บันทึกคิวซ่อม + ส่ง LINE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
