import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { LoadingScreen } from '../components/LoadingScreen';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, checkSession, loginAsDemo } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ivanov@bellakt.by',
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      await checkSession();
    } catch (error: any) {
      toast.error('Ошибка авторизации', {
        description: 'Проверьте логин и пароль',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#F0F4F9] via-[#F5F8FC] to-[#EDF2F7]">
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
        <p className="text-sm text-slate-600 mt-1">
          Корпоративный портал сотрудников ОАО «Беллакт»
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-slate-200/80 bg-white">
        <CardHeader className="pb-4 pt-6 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase text-slate-600">Email или табельный номер</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivanov@bellakt.by"
                className="rounded-xl h-11 border-slate-300 focus-visible:ring-[#002B7F]"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase text-slate-600">Пароль</Label>
              </div>
              <Input
                id="password"
                type="password"
                className="rounded-xl h-11 border-slate-300 focus-visible:ring-[#002B7F]"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#002B7F] hover:bg-[#001E59] text-white font-semibold h-11 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Войти в портал'
              )}
            </Button>
            
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Быстрый доступ</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full h-11 rounded-xl text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold"
              onClick={() => {
                loginAsDemo();
                toast.success('Авторизован как тестовый сотрудник');
              }}
            >
              ⚡ Быстрый вход (Тестовый сотрудник)
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl text-sm text-slate-600 border-slate-200 hover:bg-slate-50"
              onClick={() => toast.info('Функция входа по QR-коду находится в разработке')}
            >
              Войти по QR-коду пропуска
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-md">
        <PWAInstallButton />
      </div>
    </div>
  );
}
