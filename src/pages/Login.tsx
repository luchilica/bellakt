import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore, EMPLOYEES } from '../store/useAuthStore';
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
  QrCode,
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
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
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
                placeholder="Например: 20481 или ivanov@bellakt.by"
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
                placeholder="••••••••"
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
                  Инфокиоск / Пропуск
                </span>
              </div>
            </div>

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
        </CardContent>
      </Card>

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
              loginAsEmployee(EMPLOYEES[0]);
            }}
          >
            Смоделировать прикладывание пропуска (Таб. 20481)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
