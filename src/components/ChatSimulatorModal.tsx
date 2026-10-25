import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, CircleCheck } from 'lucide-react';
import { InventoryItem } from '../types';
import { simulateAdminReply } from '../utils/storeLogic';

interface ChatSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onNewBooking: (itemModel: string) => void;
}

interface Message {
  sender: 'customer' | 'bot';
  text: string;
  time: string;
  canBook?: boolean;
  itemModel?: string;
}

export const ChatSimulatorModal: React.FC<ChatSimulatorModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onNewBooking,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'สวัสดีครับพี่ชาย! Gorilla Mobile ยินดีให้บริการครับ สนใจ iPhone หรือ Samsung มือสองรุ่นไหน หรือต้องการสอบถามงานซ่อม พิมพ์สอบถามสเปคและสต็อกกับผมได้เลยครับ 🔥',
      time: '10:00',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookedMap, setBookedMap] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const quickOptions = [
    'iPhone 14 Pro ม่วง มีของไหม',
    'Samsung S23 Ultra เครื่องสวยไหม',
    'iPhone 13 มีสีอะไรบ้าง',
    'เปลี่ยนจอ iPhone 12 เท่าไหร่',
  ];

  const handleSendMessage = (msgText: string) => {
    const text = msgText.trim();
    if (!text || isTyping) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newMessages: Message[] = [
      ...messages,
      { sender: 'customer', text, time: timeStr },
    ];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const result = simulateAdminReply(text, inventory);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: result.reply,
          time: timeStr,
          canBook: result.canBook,
          itemModel: result.matchedItem?.model,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleBook = (idx: number, model?: string) => {
    setBookedMap((prev) => ({ ...prev, [idx]: true }));
    if (model) {
      onNewBooking(model);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-sim-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col h-[600px] max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--neon)] text-black flex items-center justify-center font-bold">
              <Bot size={18} />
            </div>
            <div>
              <h2 id="chat-sim-title" className="text-[14px] font-bold text-white flex items-center gap-2">
                <span>Gorilla Sales Bot (GPT-4o)</span>
                <span className="w-2 h-2 rounded-full bg-[var(--neon)] animate-pulse" />
              </h2>
              <p className="text-[10px] text-[var(--text-2)]">
                เชื่อมต่อฐานข้อมูล Google Sheet Real-time
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center text-[var(--text-2)] hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Message history */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/40">
          {messages.map((m, idx) => {
            const isBot = m.sender === 'bot';
            const isBooked = bookedMap[idx];

            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-[var(--neon)] text-black flex items-center justify-center text-[12px] font-bold shrink-0">
                    G
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-[14px] p-3 text-[12px] leading-relaxed ${
                    isBot
                      ? 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]'
                      : 'bg-[var(--neon)] text-black font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`mono text-[9px] mt-1 text-right ${
                      isBot ? 'text-[var(--text-3)]' : 'text-black/60'
                    }`}
                  >
                    {m.time}
                  </div>

                  {isBot && m.canBook && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => handleBook(idx, m.itemModel)}
                        disabled={isBooked}
                        className={`px-3 py-1.5 rounded-lg mono text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                          isBooked
                            ? 'bg-[#34A853] text-white'
                            : 'bg-[var(--neon)] text-black hover:opacity-90'
                        }`}
                      >
                        <CircleCheck size={13} />
                        <span>{isBooked ? 'จองมัดจำสำเร็จแล้ว ✓' : 'จองเลย 500฿ ล็อคเครื่องทันที'}</span>
                      </button>
                    </div>
                  )}
                </div>
                {!isBot && (
                  <div className="w-7 h-7 rounded-full bg-[var(--surface-3)] text-white border border-[var(--border)] flex items-center justify-center text-[12px] shrink-0">
                    <User size={13} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 items-center text-[var(--neon)] mono text-[11px]">
              <Sparkles size={13} className="animate-spin" />
              <span>AI แอดมินกำลังตรวจชีทและพิมพ์ตอบ...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 bg-[var(--surface-2)] border-t border-[var(--border)] flex gap-1.5 overflow-x-auto">
          {quickOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSendMessage(opt)}
              className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-3)] text-[var(--text-2)] hover:text-white hover:border-[var(--neon)] border border-[var(--border)] whitespace-nowrap transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์สอบถาม เช่น iPhone 14 Pro มีไหมครับ..."
            className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[var(--neon)]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 rounded-lg bg-[var(--neon)] text-black font-bold text-[12px] flex items-center gap-1.5 disabled:opacity-40 hover:opacity-90"
          >
            <Send size={13} />
            <span>ส่ง</span>
          </button>
        </form>
      </div>
    </div>
  );
};
