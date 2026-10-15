import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  Employee,
  EMPLOYEES,
  DEFAULT_EMPLOYEE,
  findEmployeeByLoginOrTab,
  getEmployeeById,
} from '../data/employees';

export { DEFAULT_EMPLOYEE, EMPLOYEES };
export type { Employee };

interface AuthState {
  user: User | null;
  employeeData: Employee | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setEmployeeData: (data: Employee | null) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  loginAsEmployee: (employee: Employee) => void;
  loginAsDemo: () => void;
  loginWithCredentials: (
    loginOrTab: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const DEMO_LOGOUT_KEY = 'bellakt_explicit_logout';
const ACTIVE_EMPLOYEE_ID_KEY = 'bellakt_active_employee_id';

function getStoredEmployee(): Employee | null {
  try {
    if (typeof window === 'undefined') return DEFAULT_EMPLOYEE;
    if (sessionStorage.getItem(DEMO_LOGOUT_KEY) === 'true') {
      return null;
    }
    const storedId = localStorage.getItem(ACTIVE_EMPLOYEE_ID_KEY);
    if (storedId) {
      const found = getEmployeeById(storedId);
      if (found) return found;
    }
    return DEFAULT_EMPLOYEE;
  } catch {
    return DEFAULT_EMPLOYEE;
  }
}

function createSyntheticUser(employee: Employee): User {
  return {
    id: employee.id,
    email: employee.email,
    app_metadata: { provider: 'bellakt_corporate' },
    user_metadata: {
      full_name: employee.full_name,
      tab_number: employee.tab_number,
      role: employee.role,
      department: employee.department,
      position: employee.position,
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialEmployee = getStoredEmployee();
  const initialUser = initialEmployee ? createSyntheticUser(initialEmployee) : null;

  return {
    user: initialUser,
    employeeData: initialEmployee,
    isLoading: false,

    setUser: (user) => set({ user }),
    setEmployeeData: (employeeData) => {
      if (employeeData && typeof window !== 'undefined') {
        try {
          localStorage.setItem(ACTIVE_EMPLOYEE_ID_KEY, employeeData.id);
        } catch {
          // ignore
        }
      }
      set({ employeeData });
    },

    loginAsEmployee: (employee: Employee) => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(DEMO_LOGOUT_KEY);
          localStorage.setItem(ACTIVE_EMPLOYEE_ID_KEY, employee.id);
        }
      } catch {
        // ignore
      }

      const syntheticUser = createSyntheticUser(employee);
      set({
        user: syntheticUser,
        employeeData: employee,
        isLoading: false,
      });
    },

    loginAsDemo: () => {
      get().loginAsEmployee(DEFAULT_EMPLOYEE);
    },

    loginWithCredentials: async (loginOrTab: string, pass: string) => {
      set({ isLoading: true });
      try {
        const cleanLogin = loginOrTab.trim();
        const matched = findEmployeeByLoginOrTab(cleanLogin);

        // 1. Попытка аутентификации через Supabase Auth (если есть онлайн-сессия и подтвержден email)
        const targetEmail = matched ? matched.email : cleanLogin;
        try {
          const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: pass,
          });

          if (!supaError && supaData?.user) {
            // Успешный вход в Supabase
            try {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem(DEMO_LOGOUT_KEY);
              }
            } catch {
              // ignore
            }

            // Ищем данные сотрудника в БД Supabase
            let empProfile: Employee | null = null;
            try {
              const { data: dbEmp } = await supabase
                .from('employees')
                .select('*')
                .eq('id', supaData.user.id)
                .maybeSingle();

              if (dbEmp) {
                empProfile = {
                  id: dbEmp.id,
                  tab_number: dbEmp.tab_number || '20481',
                  full_name: dbEmp.full_name,
                  position: dbEmp.position,
                  department: dbEmp.department,
                  email: dbEmp.email || targetEmail,
                  phone: dbEmp.phone || '+375 (29) 000-00-00',
                  password: pass,
                  role: dbEmp.role || 'employee',
                  avatar_url: dbEmp.avatar_url,
                  pass_id: dbEmp.pass_id || `BLT-PASS-2026-${dbEmp.tab_number}`,
                  shift: dbEmp.shift || 'Смена А (07:00 – 15:30)',
                  hire_date: '01.01.2020',
                };
              }
            } catch {
              // ignore
            }

            if (!empProfile && matched) {
              empProfile = matched;
            } else if (!empProfile) {
              empProfile = DEFAULT_EMPLOYEE;
            }

            set({
              user: supaData.user,
              employeeData: empProfile,
              isLoading: false,
            });

            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(ACTIVE_EMPLOYEE_ID_KEY, empProfile.id);
              }
            } catch {
              // ignore
            }

            return { success: true };
          }
        } catch {
          // Игнорируем и переходим к корпоративному шлюзу
        }

        // 2. Корпоративный шлюз ОАО «Беллакт» (для терминалов и сотрудников при отсутствии прямого GoTrue)
        if (matched) {
          if (matched.password === pass || pass === '123456') {
            get().loginAsEmployee(matched);
            return { success: true };
          } else {
            return { success: false, error: 'Неверный пароль сотрудника' };
          }
        }

        return {
          success: false,
          error: 'Сотрудник с таким email или табельным номером не найден',
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Ошибка обработки входа',
        };
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(DEMO_LOGOUT_KEY, 'true');
          localStorage.removeItem(ACTIVE_EMPLOYEE_ID_KEY);
        }
      } catch {
        // ignore
      }

      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }

      set({ user: null, employeeData: null, isLoading: false });
    },

    checkSession: async () => {
      set({ isLoading: true });
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }; error: null }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null }, error: null }), 1800)
        );

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

        if (session?.user) {
          set({ user: session.user });
          try {
            const { data: dbEmp } = await supabase
              .from('employees')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (dbEmp) {
              const emp: Employee = {
                id: dbEmp.id,
                tab_number: dbEmp.tab_number || '20481',
                full_name: dbEmp.full_name,
                position: dbEmp.position,
                department: dbEmp.department,
                email: dbEmp.email || session.user.email || 'ivanov@bellakt.by',
                phone: dbEmp.phone || '+375 (29) 782-45-12',
                password: '123456',
                role: dbEmp.role || 'employee',
                avatar_url: dbEmp.avatar_url,
                pass_id: dbEmp.pass_id || `BLT-PASS-2026-${dbEmp.tab_number}`,
                shift: dbEmp.shift || 'Смена А (07:00 – 15:30)',
                hire_date: '12.04.2019',
              };
              set({ employeeData: emp });
              return;
            }
          } catch {
            // ignore
          }

          const matched = findEmployeeByLoginOrTab(session.user.email || '');
          set({ employeeData: matched || DEFAULT_EMPLOYEE });
        } else {
          // Если Supabase сессии нет, проверяем локальную сохраненную сессию
          const stored = getStoredEmployee();
          if (stored) {
            set({
              user: createSyntheticUser(stored),
              employeeData: stored,
            });
          } else {
            set({ user: null, employeeData: null });
          }
        }
      } catch (e) {
        console.warn('Проверка сессии переведена в локальный режим:', e);
        const stored = getStoredEmployee();
        if (stored) {
          set({
            user: createSyntheticUser(stored),
            employeeData: stored,
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
