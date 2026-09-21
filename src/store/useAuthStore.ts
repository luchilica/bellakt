import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  employeeData: any | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setEmployeeData: (data: any) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  loginAsDemo: () => void;
}

export const DEFAULT_EMPLOYEE = {
  id: 'demo-employee-1',
  tab_number: '20481',
  full_name: 'Иванов Иван Иванович',
  position: 'Инженер-технолог молочного производства',
  department: 'Цех детского питания №1',
  email: 'ivanov@bellakt.by',
  avatar_url: '/ivan_ivanov.jpg',
};

const DEMO_SESSION_KEY = 'bellakt_active_session';

function hasActiveDemoSession(): boolean {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem(DEMO_SESSION_KEY) === 'demo';
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const isDemo = hasActiveDemoSession();

  return {
    user: isDemo
      ? ({
          id: 'demo-employee-1',
          email: 'ivanov@bellakt.by',
        } as unknown as User)
      : null,
    employeeData: isDemo ? DEFAULT_EMPLOYEE : null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setEmployeeData: (data) => set({ employeeData: data }),
    loginAsDemo: () => {
      try {
        sessionStorage.setItem(DEMO_SESSION_KEY, 'demo');
      } catch {
        // ignore
      }

      const demoUser = {
        id: 'demo-employee-1',
        email: 'ivanov@bellakt.by',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      set({
        user: demoUser,
        employeeData: DEFAULT_EMPLOYEE,
        isLoading: false,
      });
    },
    logout: async () => {
      try {
        sessionStorage.removeItem(DEMO_SESSION_KEY);
        localStorage.removeItem(DEMO_SESSION_KEY);
      } catch {
        // ignore
      }

      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }

      // Полный сброс сессии и очистка чувствительных данных из памяти
      set({ user: null, employeeData: null });
    },
    checkSession: async () => {
      set({ isLoading: true });
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          set({ user: session.user });
          // Загрузка верифицированного профиля сотрудника
          const { data: employee } = await supabase
            .from('employees')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (employee) {
            set({ employeeData: employee });
          } else {
            set({ employeeData: DEFAULT_EMPLOYEE });
          }
        } else {
          // Если Supabase сессии нет, проверяем явный флаг демонстрационного доступа
          if (hasActiveDemoSession()) {
            const demoUser = {
              id: 'demo-employee-1',
              email: 'ivanov@bellakt.by',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as unknown as User;
            set({
              user: demoUser,
              employeeData: DEFAULT_EMPLOYEE,
            });
          } else {
            // Терминал блокируется: требуются учетные данные, никакого автоматического входа под чужим аккаунтом
            set({ user: null, employeeData: null });
          }
        }
      } catch (e) {
        console.error('Сбой проверки сессии безопасности:', e);
        if (hasActiveDemoSession()) {
          set({
            user: {
              id: 'demo-employee-1',
              email: 'ivanov@bellakt.by',
            } as unknown as User,
            employeeData: DEFAULT_EMPLOYEE,
          });
        } else {
          set({ user: null, employeeData: null });
        }
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
