import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NavItemKey = 'health' | 'canteen' | 'payslip' | 'services' | 'certificates' | 'notifications';

export interface NavItemConfig {
  id: NavItemKey;
  label: string;
  shortLabel: string;
  path: string;
  iconName: 'HeartPulse' | 'UtensilsCrossed' | 'Receipt' | 'ClipboardList' | 'Landmark' | 'Bell';
  description: string;
}

export const ALL_AVAILABLE_NAV_ITEMS: Record<NavItemKey, NavItemConfig> = {
  health: {
    id: 'health',
    label: 'ЖУРНАЛ ЗДОРОВЬЯ',
    shortLabel: 'Журнал',
    path: '/health',
    iconName: 'HeartPulse',
    description: 'Допуск к смене и медицинские замеры',
  },
  canteen: {
    id: 'canteen',
    label: 'МЕНЮ СТОЛОВОЙ',
    shortLabel: 'Столовая',
    path: '/canteen',
    iconName: 'UtensilsCrossed',
    description: 'Заказ комплексных обедов и меню на день',
  },
  payslip: {
    id: 'payslip',
    label: 'РАСЧЕТНЫЙ ЛИСТ',
    shortLabel: 'Расчетка',
    path: '/payslip',
    iconName: 'Receipt',
    description: 'Зарплата, надбавки, премии и удержания',
  },
  services: {
    id: 'services',
    label: 'ОКАЗАННЫЕ УСЛУГИ',
    shortLabel: 'Услуги',
    path: '/services',
    iconName: 'ClipboardList',
    description: 'Архив удержаний за столовую, спорт и связь',
  },
  certificates: {
    id: 'certificates',
    label: 'ЗАПРОС СПРАВОК',
    shortLabel: 'Справки',
    path: '/certificates',
    iconName: 'Landmark',
    description: 'Заказ справок о доходах и с места работы',
  },
  notifications: {
    id: 'notifications',
    label: 'УВЕДОМЛЕНИЯ',
    shortLabel: 'Уведомления',
    path: '/?notifications=open',
    iconName: 'Bell',
    description: 'Приказы завода, объявления и вакансии',
  },
};

export interface SecurityRequest {
  id: string;
  type: 'password' | 'qrcode' | '2fa';
  typeLabel: string;
  reason: string;
  comment?: string;
  contact: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'completed';
}

interface NavPreferencesState {
  // Configured slots for bottom dock (up to 2 custom dynamic items)
  slot1: NavItemKey;
  slot2: NavItemKey;
  securityRequests: SecurityRequest[];
  setSlot1: (item: NavItemKey) => void;
  setSlot2: (item: NavItemKey) => void;
  resetToDefaults: () => void;
  addSecurityRequest: (req: Omit<SecurityRequest, 'id' | 'createdAt' | 'status'>) => SecurityRequest;
}

export const useNavPreferencesStore = create<NavPreferencesState>()(
  persist(
    (set, get) => ({
      slot1: 'health',
      slot2: 'canteen',
      securityRequests: [
        {
          id: 'REQ-2026-4190',
          type: 'qrcode',
          typeLabel: 'Перевыпуск QR-пропуска',
          reason: 'Замена смартфона',
          comment: 'Сменил служебный телефон, требуется привязка нового QR-кода.',
          contact: '+375 (29) 782-45-12',
          createdAt: '2026-08-25T09:30:00.000Z',
          status: 'completed',
        },
      ],
      setSlot1: (item) => {
        const currentSlot2 = get().slot2;
        // If user selects the same as slot2, swap them
        if (item === currentSlot2) {
          set({ slot1: item, slot2: get().slot1 });
        } else {
          set({ slot1: item });
        }
      },
      setSlot2: (item) => {
        const currentSlot1 = get().slot1;
        // If user selects the same as slot1, swap them
        if (item === currentSlot1) {
          set({ slot2: item, slot1: get().slot2 });
        } else {
          set({ slot2: item });
        }
      },
      resetToDefaults: () => {
        set({ slot1: 'health', slot2: 'canteen' });
      },
      addSecurityRequest: (req) => {
        const newReq: SecurityRequest = {
          ...req,
          id: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((state) => ({
          securityRequests: [newReq, ...state.securityRequests],
        }));
        return newReq;
      },
    }),
    {
      name: 'bellakt_nav_preferences',
    }
  )
);
