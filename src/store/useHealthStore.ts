import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HealthRecord {
  date: string; // YYYY-MM-DD
  selfStatus: 'healthy' | 'ill';
  familyStatus: 'healthy' | 'ill';
  allowed: boolean;
  checkedAt: string;
}

export interface HealthHistoryItem {
  id: string;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  time: string;
  selfStatus: 'healthy' | 'ill';
  familyStatus: 'healthy' | 'ill';
  allowed: boolean;
}

interface HealthState {
  lastCheckedInDate: string | null;
  lastRecord: HealthRecord | null;
  history: HealthHistoryItem[];
  isCheckedInToday: () => boolean;
  markCheckIn: (data: Omit<HealthRecord, 'date' | 'checkedAt'>) => void;
  resetCheckIn: () => void;
  setHistory: (items: HealthHistoryItem[]) => void;
}

export const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatRuDate = (dateIso: string): string => {
  const parts = dateIso.split('-');
  if (parts.length !== 3) return dateIso;
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const day = String(Number(parts[2])).padStart(2, '0');
  const monthName = months[Number(parts[1]) - 1] || '';
  return `${day} ${monthName} ${parts[0]}`;
};

// Initial shift records for September 2026
const defaultHistory: HealthHistoryItem[] = [
  {
    id: 'rec-2026-09-17',
    date: '2026-09-17',
    formattedDate: '17 сентября 2026',
    time: '07:44',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-16',
    date: '2026-09-16',
    formattedDate: '16 сентября 2026',
    time: '07:39',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-15',
    date: '2026-09-15',
    formattedDate: '15 сентября 2026',
    time: '07:50',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-14',
    date: '2026-09-14',
    formattedDate: '14 сентября 2026',
    time: '07:35',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-11',
    date: '2026-09-11',
    formattedDate: '11 сентября 2026',
    time: '07:42',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-10',
    date: '2026-09-10',
    formattedDate: '10 сентября 2026',
    time: '07:48',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-09',
    date: '2026-09-09',
    formattedDate: '09 сентября 2026',
    time: '07:42',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-08',
    date: '2026-09-08',
    formattedDate: '08 сентября 2026',
    time: '07:38',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-07',
    date: '2026-09-07',
    formattedDate: '07 сентября 2026',
    time: '07:45',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-04',
    date: '2026-09-04',
    formattedDate: '04 сентября 2026',
    time: '07:51',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-03',
    date: '2026-09-03',
    formattedDate: '03 сентября 2026',
    time: '07:40',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-02',
    date: '2026-09-02',
    formattedDate: '02 сентября 2026',
    time: '07:36',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
  {
    id: 'rec-2026-09-01',
    date: '2026-09-01',
    formattedDate: '01 сентября 2026',
    time: '07:41',
    selfStatus: 'healthy',
    familyStatus: 'healthy',
    allowed: true,
  },
];

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      lastCheckedInDate: null,
      lastRecord: null,
      history: defaultHistory,

      isCheckedInToday: () => {
        const today = getTodayIsoDate();
        return get().lastCheckedInDate === today;
      },

      markCheckIn: (data) => {
        const today = getTodayIsoDate();
        const now = new Date();
        const time = now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedDate = formatRuDate(today);

        const record: HealthRecord = {
          ...data,
          date: today,
          checkedAt: time,
        };

        const todayHistoryItem: HealthHistoryItem = {
          id: `rec-${today}`,
          date: today,
          formattedDate,
          time,
          selfStatus: data.selfStatus,
          familyStatus: data.familyStatus,
          allowed: data.allowed,
        };

        // Filter out today's previous record if exists, and prepend today's new record
        const previousHistory = get().history || defaultHistory;
        const filtered = previousHistory.filter((h) => h.date !== today);
        const updatedHistory = [todayHistoryItem, ...filtered];

        set({
          lastCheckedInDate: today,
          lastRecord: record,
          history: updatedHistory,
        });
      },

      resetCheckIn: () => {
        const today = getTodayIsoDate();
        const previousHistory = get().history || defaultHistory;
        set({
          lastCheckedInDate: null,
          lastRecord: null,
          history: previousHistory.filter((h) => h.date !== today),
        });
      },

      setHistory: (items) => {
        set({ history: items });
      },
    }),
    {
      name: 'bellakt_health_journal_v3',
    }
  )
);
