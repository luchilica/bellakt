import { create } from 'zustand';

export type AutoLogoutOption = '2' | '5' | '10' | 'never';

interface KioskSecurityState {
  autoLogout: AutoLogoutOption;
  setAutoLogout: (val: AutoLogoutOption) => void;
  getTimeoutMs: () => number | null;
  lastActivity: number;
  updateActivity: () => void;
}

const STORAGE_KEY = 'bellakt_kiosk_autologout';

function getInitialTimeout(): AutoLogoutOption {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '2' || saved === '5' || saved === '10' || saved === 'never') {
      return saved;
    }
  } catch {
    // ignore
  }
  return '5'; // Дефолтное время безопасной сессии терминала: 5 минут
}

export const useKioskSecurityStore = create<KioskSecurityState>((set, get) => ({
  autoLogout: getInitialTimeout(),
  lastActivity: Date.now(),
  setAutoLogout: (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, val);
    } catch {
      // ignore
    }
    set({ autoLogout: val });
  },
  updateActivity: () => set({ lastActivity: Date.now() }),
  getTimeoutMs: () => {
    const { autoLogout } = get();
    switch (autoLogout) {
      case '2':
        return 2 * 60 * 1000;
      case '5':
        return 5 * 60 * 1000;
      case '10':
        return 10 * 60 * 1000;
      case 'never':
        return null;
      default:
        return 5 * 60 * 1000;
    }
  },
}));
