import React, { useState } from 'react';
import { Database, Plus, Search, Layers, Download, Check } from 'lucide-react';
import { InventoryItem } from '../types';
import { formatPrice, calculateProfit } from '../utils/storeLogic';

interface InventorySheetProps {
  inventory: InventoryItem[];
  onUpdateStock: (model: string, newStock: number) => void;
  onAddItem: (item: InventoryItem) => void;
  globalSearch: string;
}

export const InventorySheet: React.FC<InventorySheetProps> = ({
  inventory,
  onUpdateStock,
  onAddItem,
  globalSearch,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newCap, setNewCap] = useState('128GB');
  const [newCost, setNewCost] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('1');
  const [exportedCsv, setExportedCsv] = useState(false);

  const filteredItems = inventory.filter(
    (item) =>
      item.model.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.color.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.cap.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.status.includes(globalSearch)
  );

  const handleExportCsv = () => {
    const headers = 'Model,Color,Capacity,Cost,Price,Stock,Status\n';
    const rows = inventory
      .map(
        (i) =>
          `"${i.model}","${i.color}","${i.cap}",${i.cost},${i.price},${i.stock},"${i.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gorilla-stock-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportedCsv(true);
    setTimeout(() => setExportedCsv(false), 2000);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.trim() || !newPrice) return;

    const costNum = Number(newCost) || 0;
    const priceNum = Number(newPrice) || 0;
    const stockNum = Number(newStock) || 0;

    let status: InventoryItem['status'] = 'พร้อมขาย';
    if (stockNum === 0) status = 'หมด';
    else if (stockNum <= 2) status = 'ใกล้หมด';
    else if (stockNum >= 8) status = 'ขายดี';

    onAddItem({
      model: newModel.trim(),
      color: newColor.trim() || 'Black',
      cap: newCap,
      cost: costNum,
      price: priceNum,
      stock: stockNum,
      status,
      img: newModel.toLowerCase().includes('samsung') ? '🤖' : '📱',
    });

    setIsAdding(false);
    setNewModel('');
    setNewColor('');
    setNewCost('');
    setNewPrice('');
    setNewStock('1');
  };

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#34A853] flex items-center justify-center text-white shrink-0">
              <Database size={16} />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span>Template Google Sheet — สต็อกจริง</span>
              </h2>
              <p className="text-[11px] text-[var(--text-2)]">
                ซิงค์ real-time กับ AI แอดมิน • อัปเดตล่าสุดเมื่อสักครู่
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center gap-1.5 text-[var(--text-2)]">
              <span className="w-1.5 h-1.5 bg-[#34A853] rounded-full animate-pulse" />
              <span>SYNCED</span>
            </span>

            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-white hover:border-[var(--neon)] transition-colors flex items-center gap-1"
            >
              <Plus size={11} />
              <span>เพิ่มสินค้า</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-white transition-colors flex items-center gap-1"
              title="ส่งออก CSV"
            >
              {exportedCsv ? <Check size={11} className="text-[var(--neon)]" /> : <Download size={11} />}
              <span>{exportedCsv ? 'ส่งออกแล้ว' : 'CSV'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Add Item Panel (collapsible) */}
      {isAdding && (
        <form
          onSubmit={handleSaveNewItem}
          className="p-4 bg-[var(--surface-2)] border-b border-[var(--border)] space-y-3 animate-in fade-in"
        >
          <div className="mono text-[11px] font-bold text-[var(--neon)]">
            + บันทึกสินค้าเข้าสต็อก Google Sheet
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">ชื่อรุ่นมือถือ</label>
              <input
                type="text"
                required
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder="เช่น iPhone 15 Plus"
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              />
            </div>
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">สีตัวเครื่อง</label>
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="เช่น Blue, Pink"
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              />
            </div>
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">ความจุ</label>
              <select
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              >
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">ราคาทุน (บาท)</label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="20000"
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              />
            </div>
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">ราคาขาย (บาท)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="24500"
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              />
            </div>
            <div>
              <label className="block mono text-[9px] text-[var(--text-3)] mb-1">จำนวนสต็อก</label>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full bg-black border border-[var(--border)] rounded px-2 py-1 text-[11px] text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="mono text-[10px] px-3 py-1 rounded bg-[var(--surface-3)] text-[var(--text-2)]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="mono text-[10px] px-3 py-1 rounded bg-[var(--neon)] text-black font-bold"
            >
              บันทึกลงชีท
            </button>
          </div>
        </form>
      )}

      {/* Stock Table */}
      <div className="overflow-x-auto">
        <table className="w-full mono text-[11px] min-w-[500px]">
          <thead>
            <tr className="bg-[var(--surface-3)] border-b border-[var(--border)] text-[var(--text-2)] text-left">
              <th className="px-3 py-2 font-medium whitespace-nowrap">รุ่น</th>
              <th className="px-2 py-2 font-medium">สี</th>
              <th className="px-2 py-2 font-medium">ความจุ</th>
              <th className="px-2 py-2 font-medium">ราคาทุน</th>
              <th className="px-2 py-2 font-medium">ราคาขาย</th>
              <th className="px-2 py-2 font-medium">สต็อก</th>
              <th className="px-2 py-2 font-medium">สถานะ</th>
              <th className="px-2 py-2 font-medium">รูป</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredItems.map((item) => {
              const { profit, marginPercent } = calculateProfit(item.price, item.cost);

              return (
                <tr
                  key={`${item.model}-${item.color}-${item.cap}`}
                  className="hover:bg-[var(--surface-2)] transition-colors group"
                >
                  <td className="px-3 py-2.5 font-bold whitespace-nowrap text-white">
                    {item.model}
                  </td>
                  <td className="px-2 py-2.5 text-[var(--text-2)] whitespace-nowrap">
                    {item.color}
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)]">
                      {item.cap}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-[var(--text-3)] whitespace-nowrap tabular-nums">
                    {formatPrice(item.cost)}
                  </td>
                  <td className="px-2 py-2.5 font-bold text-white whitespace-nowrap tabular-nums">
                    <div>{formatPrice(item.price)}</div>
                    <div className="text-[9px] text-[var(--neon)] font-normal">
                      +{formatPrice(profit)} ({marginPercent}%)
                    </div>
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateStock(item.model, Math.max(0, item.stock - 1))}
                        className="w-4 h-4 rounded bg-[var(--surface-3)] text-white hover:bg-[var(--border-2)] flex items-center justify-center text-[10px]"
                        title="ลดสต็อก 1"
                      >
                        -
                      </button>
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tabular-nums min-w-[24px] text-center ${
                          item.stock === 0
                            ? 'bg-[rgba(255,77,106,0.1)] border-[rgba(255,77,106,0.3)] text-[#ff4d6a]'
                            : item.stock < 3
                            ? 'bg-[rgba(255,204,51,0.1)] border-[rgba(255,204,51,0.3)] text-[#ffcc33]'
                            : 'bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)] text-[var(--neon)]'
                        }`}
                      >
                        {item.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateStock(item.model, item.stock + 1)}
                        className="w-4 h-4 rounded bg-[var(--surface-3)] text-white hover:bg-[var(--border-2)] flex items-center justify-center text-[10px]"
                        title="เพิ่มสต็อก 1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        item.status === 'หมด'
                          ? 'bg-[#1a1a1a] text-[var(--text-3)]'
                          : item.status === 'ใกล้หมด'
                          ? 'bg-[#332a00] text-[#ffcc33]'
                          : item.status === 'ขายดี'
                          ? 'bg-[rgba(0,255,136,0.12)] text-[var(--neon)]'
                          : 'bg-[var(--surface-3)] text-[var(--text-2)]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-[14px] group-hover:scale-110 transition-transform">
                    {item.img}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer formula bar */}
      <div className="p-3 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 mono text-[10px] text-[var(--text-3)]">
          <Layers size={12} />
          <span>{inventory.length} รายการในชีท • ปรับสต็อกมีผลกับ AI ทันที</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] text-[var(--text-2)]">= ราคาขาย - ทุน</span>
          <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
            📊
          </div>
        </div>
      </div>
    </section>
  );
};
