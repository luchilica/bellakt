import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { LogOut, Mail, Hash, Building2, ArrowLeft } from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';

export default function Profile() {
  const { employeeData, logout } = useAuthStore();

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Назад на главную"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Профиль сотрудника</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Личные данные и служебные параметры</p>
        </div>
      </div>

      <Card className="rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden bg-white">
        <div className="h-28 sm:h-32 bg-gradient-to-r from-[#002B7F] via-[#003B99] to-[#0052CC] relative p-4 flex justify-end items-start">
          <span className="text-[11px] font-semibold text-white/90 bg-white/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-white/20">
            ОАО «Беллакт»
          </span>
        </div>
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="absolute -top-12 sm:-top-14 border-4 border-white rounded-full bg-white shadow-sm">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
              <AvatarImage src={employeeData?.avatar_url || ''} />
              <AvatarFallback className="text-3xl bg-[#002B7F] text-white font-bold">
                {employeeData?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="pt-16 sm:pt-18 pb-5 border-b border-slate-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{employeeData?.full_name || 'Сотрудник'}</h2>
            <p className="text-slate-500 text-sm sm:text-base mt-0.5">{employeeData?.position || 'Должность'}</p>
          </div>

          <div className="py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B7F] flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500">Табельный номер</div>
                <div className="font-semibold text-slate-800 text-sm sm:text-base">{employeeData?.tab_number || '20481'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B7F] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500">Подразделение</div>
                <div className="font-semibold text-slate-800 text-sm sm:text-base truncate">{employeeData?.department || 'Цех детского питания №1'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B7F] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500">Корпоративный Email</div>
                <div className="font-semibold text-slate-800 text-sm sm:text-base truncate">{employeeData?.email || 'ivanov@bellakt.by'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="py-2">
        <PWAInstallButton />
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={logout}
          className="w-full max-w-md border-[#E53935] text-[#E53935] hover:bg-red-50 h-12 rounded-xl text-base font-semibold"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
