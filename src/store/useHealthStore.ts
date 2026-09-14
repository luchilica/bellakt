import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HealthRecord {
  date: string; // YYYY-MM-DD
  temperature: string;
  selfStatus: 'healthy' | 'ill' | 'symptoms';
  familyStatus: 'healthy' | 'ill';
  skinStatus: 'normal' | 'lesions';
  checkedAt: string;
}

interface HealthState {
  lastCheckedInDate: string | null;
  lastRecord: HealthRecord | null;
  isCheckedInToday: () => boolean;
  markCheckIn: (data: Omit<HealthRecord, 'date' | 'checkedAt'>) => void;
  resetCheckIn: () => void;
}

const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      lastCheckedInDate: null,
      lastRecord: null,

      isCheckedInToday: () => {
        const today = getTodayIsoDate();
        return get().lastCheckedInDate === today;
      },

      markCheckIn: (data) => {
        const today = getTodayIsoDate();
        const record: HealthRecord = {
          ...data,
          date: today,
          checkedAt: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        set({
          lastCheckedInDate: today,
          lastRecord: record,
        });
      },

      resetCheckIn: () => {
        set({
          lastCheckedInDate: null,
          lastRecord: null,
        });
      },
    }),
    {
      name: 'bellakt_health_journal_v2',
    }
  )
);
