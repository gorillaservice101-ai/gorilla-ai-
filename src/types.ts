import { LucideIcon } from 'lucide-react';
import { RepairJob, InventoryItem } from './utils/storeLogic';

export interface StatMetric {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  trend: 'up' | 'neutral' | 'down';
  detail: string;
}

export interface PromptTemplate {
  key: string;
  title: string;
  desc: string;
  content: string;
  variables: string[];
}

export interface N8nLogEntry {
  id: string;
  time: string;
  type: 'webhook' | 'sheet' | 'gpt' | 'line' | 'order';
  message: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'system';
  text: string;
  time: string;
  quickAction?: {
    label: string;
    action: string;
  };
}

export type { RepairJob, InventoryItem };
