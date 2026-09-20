import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  LogOut,
  Mail,
  Hash,
  Building2,
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Calendar,
  Phone,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';

export default function Profile() {
  const { employeeData, logout } = useAuthStore();

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          title="Назад на главную"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Электронный пропуск сотрудника
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Служебные реквизиты, допуски и идентификатор ОАО «Беллакт»
          </p>
        </div>
      </div>

      {/* Main Electronic ID Card */}
      <div className="rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden">
        {/* Pass Header Banner */}
        <div className="bg-[#002B7F] px-5 sm:px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs tracking-wider border border-white/20">
              БЛТ
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                ОАО «Беллакт» • Волковыск
              </div>
              <div className="text-[11px] text-blue-200">
                Служебное удостоверение / Пропуск в цех
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Активен</span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
              <AvatarImage src={employeeData?.avatar_url || ''} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-[#002B7F] text-white font-bold rounded-2xl">
                {employeeData?.full_name?.charAt(0) || 'И'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {employeeData?.full_name || 'Иванов Иван Иванович'}
                </h2>
                <span className="text-xs font-mono font-bold text-[#002B7F] dark:text-blue-300 bg-[#E8F1FC] dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
                  Таб. № {employeeData?.tab_number || '20481'}
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                {employeeData?.position || 'Инженер-технолог производства детского питания'}
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{employeeData?.department || 'Цех детского питания №1'}</span>
              </div>
            </div>
          </div>

          {/* Squircle Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-6">
            {/* 1. Табельный номер */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Табельный номер
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {employeeData?.tab_number || '20481'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Приказ о зачислении №142-к
                </div>
              </div>
            </div>

            {/* 2. Подразделение */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Подразделение
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                  {employeeData?.department || 'Цех детского питания №1'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Смена №1 (дневная)
                </div>
              </div>
            </div>

            {/* 3. Квалификация / Разряд */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Квалификация
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                  5 квалификационный разряд
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Аттестация пройдена (2026)
                </div>
              </div>
            </div>

            {/* 4. Корпоративный Email */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Корпоративная почта
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                  {employeeData?.email || 'ivanov@bellakt.by'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Внутренний почтовый сервер
                </div>
              </div>
            </div>

            {/* 5. Телефон */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Служебный телефон
                </div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                  +375 (29) 782-45-12
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Внутренний номер АТС: 24-18
                </div>
              </div>
            </div>

            {/* 6. Санитарная книжка / Охрана труда */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Санитарный допуск
                </div>
                <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                  Действует до 15.11.2026
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Сан. минимум пройден успешно
                </div>
              </div>
            </div>
          </div>

          {/* Turnstile / Pass barcode representation */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Электронный пропуск для турникета
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  BLT-PASS-2026-9812-4401 • Проходная №1 и №2
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Доступ разрешен</span>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Installation Card */}
      <PWAInstallButton />

      {/* Logout Action Button (Min 48px hitbox, clear red accent) */}
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 h-13 rounded-2xl text-sm font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <LogOut className="mr-2 h-5 w-5 stroke-[2.2px]" />
          <span>Завершить рабочую сессию (Выход)</span>
        </Button>
      </div>
    </div>
  );
}

