import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore, EMPLOYEES, Employee } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  Loader2,
  Users,
  KeyRound,
  Building,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Shield,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Введите email или табельный номер'),
  password: z.string().min(4, 'Пароль должен быть не менее 4 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, loginWithCredentials, loginAsEmployee } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectWorkerOpen, setIsSelectWorkerOpen] = useState(false);
  const [showCredentialsHint, setShowCredentialsHint] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [employeesList, setEmployeesList] = useState<Employee[]>(EMPLOYEES);

  useEffect(() => {
    async function loadSupaEmployees() {
      try {
        const { data, error } = await supabase.from('employees').select('*').order('full_name');
        if (!error && data && data.length > 0) {
          const mapped: Employee[] = data.map((d: any) => ({
            id: d.id,
            tab_number: d.tab_number || '00000',
            full_name: d.full_name,
            position: d.position || 'Сотрудник предприятия',
            department: d.department || 'Производство',
            email: d.email || `${d.tab_number}@bellakt.by`,
            phone: d.phone || '+375 (29) 000-00-00',
            password: '123456',
            role: (d.role as any) || 'employee',
            avatar_url: d.avatar_url,
            pass_id: d.pass_id || `BLT-PASS-2026-${d.tab_number}-9812`,
            shift: d.shift || 'Смена А (07:00 – 15:30)',
            hire_date: '01.01.2020',
          }));
          setEmployeesList(mapped);
        }
      } catch (err) {
        console.warn('Error loading employees from Supabase:', err);
      }
    }
    loadSupaEmployees();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: 'ivanov@bellakt.by',
      password: '123456',
    },
  });

  if (isLoading) {
    return <LoadingScreen message="Авторизация в системе «Беллакт»..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await loginWithCredentials(data.identifier, data.password);
      if (res.success) {
        toast.success('Успешный вход в систему', {
          description: 'Сессия подтверждена корпоративным каталогом «Беллакт»',
        });
      } else {
        toast.error('Ошибка авторизации', {
          description: res.error || 'Проверьте табельный номер, email и пароль',
        });
      }
    } catch {
      toast.error('Ошибка связи с сервером', {
        description: 'Повторите попытку через несколько секунд',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEmployee = (emp: Employee) => {
    loginAsEmployee(emp);
    setIsSelectWorkerOpen(false);
    toast.success(`Вход выполнен: ${emp.full_name}`, {
      description: `${emp.position} • ${emp.department}`,
    });
  };

  const handleFillCredentials = (emp: Employee) => {
    setValue('identifier', emp.tab_number);
    setValue('password', emp.password);
    setShowCredentialsHint(false);
    toast.info(`Учетные данные подставлены: Таб. № ${emp.tab_number}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#F0F4F9] via-[#F5F8FC] to-[#EDF2F7] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="Волковысское ОАО «Беллакт»"
            className="h-16 md:h-20 w-auto max-w-[260px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
          Единый корпоративный портал ОАО «Беллакт»
        </p>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          г. Волковыск • Производственная безопасность и сервисы сотрудников
        </span>
      </div>

      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="pb-4 pt-6 text-center border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Вход в систему
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Используйте табельный номер или корпоративную почту
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="identifier"
                className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400"
              >
                Табельный номер или Email
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="20481 или ivanov@bellakt.by"
                className="rounded-xl h-11 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-[#002B7F]"
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-xs text-red-500">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400"
                >
                  Пароль
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                className="rounded-xl h-11 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-[#002B7F]"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#002B7F] hover:bg-[#0B4DA2] text-white font-semibold h-11 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Войти в портал'
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500">
                  Быстрый доступ
                </span>
              </div>
            </div>

            {/* Быстрый вход по выбору сотрудника из базы */}
            <Button
              type="button"
              variant="secondary"
              className="w-full h-11 rounded-xl text-sm bg-[#D6E6F9] text-[#002B7F] border border-[#0B4DA2]/20 hover:bg-[#c4dbf7] font-semibold cursor-pointer flex items-center justify-center gap-2"
              onClick={() => setIsSelectWorkerOpen(true)}
            >
              <Users className="w-4 h-4" />
              Выбрать профиль сотрудника ({employeesList.length})
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl text-sm text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-2"
              onClick={() => setQrModalOpen(true)}
            >
              <QrCode className="w-4 h-4" />
              Войти по электронному пропуску
            </Button>
          </form>

          {/* Информационный аккордеон с данными для входа */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCredentialsHint(!showCredentialsHint)}
              className="w-full flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#0B4DA2]" />
                Учетные данные сотрудников предприятия
              </span>
              {showCredentialsHint ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showCredentialsHint && (
              <div className="mt-3 space-y-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-700">
                  Все сотрудники зарегистрированы в базе данных и Supabase. Единый пароль по умолчанию: <strong className="text-slate-800 dark:text-slate-200">123456</strong>
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {employeesList.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 hover:border-blue-400 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {emp.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Таб. № {emp.tab_number} • {emp.position}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2.5 text-[#002B7F] hover:bg-[#D6E6F9] shrink-0 font-medium"
                        onClick={() => handleFillCredentials(emp)}
                      >
                        Заполнить
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Диалог выбора профиля сотрудника */}
      <Dialog open={isSelectWorkerOpen} onOpenChange={setIsSelectWorkerOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-[#002B7F]" />
              Сотрудники ОАО «Беллакт»
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Выберите учетную запись для мгновенного входа в портал или инфокиоск
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 pt-2">
            {employeesList.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectEmployee(emp)}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#002B7F] dark:hover:border-[#0B4DA2] bg-slate-50/60 dark:bg-slate-800/40 hover:bg-[#D6E6F9]/30 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#002B7F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {emp.full_name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {emp.full_name}
                    </div>
                    <div className="text-xs text-[#0B4DA2] dark:text-sky-400 font-medium truncate">
                      {emp.position}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {emp.department} • Таб. № {emp.tab_number}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center text-xs font-semibold text-[#002B7F] dark:text-sky-300 opacity-90 group-hover:translate-x-0.5 transition-transform">
                  Войти
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно пропуска */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="max-w-sm text-center rounded-2xl bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Вход по пропуску
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Приложите бесконтактный RFID-пропуск к считывателю инфокиоска или отсканируйте QR-код
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-4">
              <QrCode className="w-20 h-20 text-[#002B7F] dark:text-[#0B4DA2] animate-pulse" />
              <span className="text-[11px] font-medium text-slate-500 mt-2">
                Ожидание считывания...
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full text-xs"
            onClick={() => {
              setQrModalOpen(false);
              handleSelectEmployee(employeesList[0] || EMPLOYEES[0]);
            }}
          >
            Смоделировать прикладывание пропуска (Таб. 20481)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
