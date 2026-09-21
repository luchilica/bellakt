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

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-employee-1',
    email: 'ivanov@bellakt.by',
  } as unknown as User,
  employeeData: DEFAULT_EMPLOYEE,
  isLoading: true,
  setUser: (user) => set({ user }),
  setEmployeeData: (data) => set({ employeeData: data }),
  loginAsDemo: () => {
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
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    set({ user: null, employeeData: null });
    // Reset other stores or cache here if needed
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
        // Fetch employee data
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
        set({
          user: {
            id: 'demo-employee-1',
            email: 'ivanov@bellakt.by',
          } as unknown as User,
          employeeData: DEFAULT_EMPLOYEE,
        });
      }
    } catch (e) {
      console.error(e);
      set({
        user: {
          id: 'demo-employee-1',
          email: 'ivanov@bellakt.by',
        } as unknown as User,
        employeeData: DEFAULT_EMPLOYEE,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
