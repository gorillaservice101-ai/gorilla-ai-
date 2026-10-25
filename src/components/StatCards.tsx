import React from 'react';
import { MessageSquare, ShoppingBag, Wrench, Banknote, Terminal } from 'lucide-react';
import { StatMetric } from '../types';

interface StatCardsProps {
  activeCardIndex: number | null;
  onToggleCard: (index: number | null) => void;
  repairCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  activeCardIndex,
  onToggleCard,
  repairCount,
}) => {
  const metrics: StatMetric[] = [
    {
      label: 'แชทวันนี้',
      value: '47',
      sub: '+12 จากเมื่อวาน',
      icon: MessageSquare,
      trend: 'up',
      detail: 'Facebook Messenger 28 ข้อความ / LINE Official 19 ข้อความ (ตอบกลับเฉลี่ย 1.8 วิ)',
    },
    {
      label: 'จองแล้ว',
      value: '12',
      sub: 'ยอดมัดจำ 6,000฿',
      icon: ShoppingBag,
      trend: 'up',
      detail: 'iPhone 14 ยอดจองสูงสุด 5 เครื่อง • รอรับเครื่องหน้าร้าน 4 รายการ',
    },
    {
      label: 'คิวซ่อม',
      value: `${repairCount}`,
      sub: '2 เครื่องรออะไหล่',
      icon: Wrench,
      trend: 'neutral',
      detail: 'ซ่อมเสร็จรอส่งมอบ 1 เครื่อง • ประเมินอาการ 1 เครื่อง • สั่งอะไหล่ตรงรุ่น 2 เครื่อง',
    },
    {
      label: 'ยอดปิด',
      value: '89,400฿',
      sub: 'วันนี้ 5 บิล',
      icon: Banknote,
      trend: 'up',
      detail: 'กำไรขั้นต้นประมาณ ~18,400฿ (Margin เฉลี่ย 20.5%)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
      {metrics.map((card, idx) => {
        const isSelected = activeCardIndex === idx;
        const Icon = card.icon;

        return (
          <button
            key={card.label}
            type="button"
            onClick={() => onToggleCard(isSelected ? null : idx)}
            className={`text-left group relative overflow-hidden rounded-[16px] border bg-[var(--surface)] p-4 md:p-5 transition-all duration-200 hover:bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:-translate-y-[1px] focus:outline-none focus:ring-1 focus:ring-[var(--neon)] ${
              isSelected
                ? 'border-[var(--neon)] shadow-[0_0_24px_rgba(0,255,136,0.18)]'
                : 'border-[var(--border)]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-[var(--neon)] text-black border-[var(--neon)]'
                    : 'bg-[var(--surface-3)] text-[var(--text-2)] border-[var(--border)] group-hover:text-white'
                }`}
              >
                <Icon size={16} />
              </div>
              <span
                className={`mono text-[10px] px-2 py-0.5 rounded-full border ${
                  card.trend === 'up'
                    ? 'bg-[rgba(0,255,136,0.08)] text-[var(--neon)] border-[rgba(0,255,136,0.2)]'
                    : 'bg-[var(--surface-3)] text-[var(--text-2)] border-[var(--border)]'
                }`}
              >
                {card.trend === 'up' ? '↗ +12%' : '— คงที่'}
              </span>
            </div>

            <div className="mono text-[26px] md:text-[30px] font-bold tracking-[-0.03em] leading-none mb-1 text-white">
              {card.value}
            </div>
            <div className="text-[12px] font-medium text-[var(--text-2)] mb-1">
              {card.label}
            </div>
            <div className="mono text-[10px] text-[var(--text-3)]">{card.sub}</div>

            {isSelected && (
              <div className="mt-3 pt-3 border-t border-[var(--border)] mono text-[11px] text-[var(--neon)] flex items-start gap-2">
                <Terminal size={13} className="shrink-0 mt-0.5" />
                <span className="leading-snug">{card.detail}</span>
              </div>
            )}

            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[var(--neon)] opacity-[0.03] blur-[24px] rounded-full group-hover:opacity-[0.08] transition-opacity pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
};
