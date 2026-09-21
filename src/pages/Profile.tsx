import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import {
  LogOut,
  Mail,
  Hash,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';

export default function Profile() {
  const { employeeData, logout } = useAuthStore();

  const fullName = employeeData?.full_name || 'Бороденя Евгений Сергеевич';
  const tabNumber = employeeData?.tab_number || '20481';
  const position = employeeData?.position || 'Инженер-технолог производства';
  const department = employeeData?.department || 'Цех детского питания №1';
  const email = employeeData?.email || 'e.borodenya@bellakt.by';
  const phone = '+375 (29) 782-45-12';
  const passId = `BLT-PASS-2026-${tabNumber}-9812`;

  return (
    <div id="profile-container" className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            id="profile-back-button"
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 id="profile-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Профиль
          </h1>
        </div>
      </div>

      {/* Main Profile Card Container */}
      <div
        id="profile-id-card"
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 sm:p-7 lg:p-8 space-y-6 sm:space-y-7"
      >
        {/* 1. Square for Photo + Full Name (ФИО) */}
        <div id="profile-user-header" className="flex items-center gap-4 sm:gap-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div
            id="profile-photo-square"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden"
          >
            <UserIcon className="w-10 h-10 sm:w-11 sm:h-11 text-slate-400 dark:text-slate-500 stroke-[1.5]" />
          </div>

          <div className="min-w-0">
            <h2 id="profile-user-fullname" className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {fullName}
            </h2>
          </div>
        </div>

        {/* 2. Information Tiles Grid */}
        <div id="profile-info-grid" className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Сведения о сотруднике
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {/* Табельный номер */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Табельный номер
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {tabNumber}
                </div>
              </div>
            </div>

            {/* Должность */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Должность
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 leading-snug">
                  {position}
                </div>
              </div>
            </div>

            {/* Цех / Подразделение */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Цех / Подразделение
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 leading-snug">
                  {department}
                </div>
              </div>
            </div>

            {/* Номер телефона */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Служебный телефон
                </div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                  {phone}
                </div>
              </div>
            </div>

            {/* Корпоративная почта */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Корпоративная почта
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                  {email}
                </div>
              </div>
            </div>

            {/* Санитарный допуск */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
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
              </div>
            </div>
          </div>
        </div>

        {/* 3. Centered Large Scannable Electronic Pass */}
        <div id="profile-pass-section" className="pt-2 sm:pt-4">
          <div className="max-w-md mx-auto rounded-3xl border-2 border-[#002B7F]/30 dark:border-blue-500/40 bg-slate-50/70 dark:bg-slate-800/40 p-6 sm:p-7 shadow-xs text-center space-y-5">
            {/* Header of Pass */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Электронный пропуск
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Проходные №1, №2 • Доступ во все производственные зоны цеха
              </p>
            </div>

            {/* High-contrast QR Container for Optical Scanners */}
            <div className="inline-block p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-300 shadow-sm">
              <svg
                viewBox="0 0 160 160"
                className="w-52 h-52 sm:w-60 sm:h-60 mx-auto"
                shapeRendering="crispEdges"
              >
                {/* Clean Pure White Quiet Zone Background */}
                <rect width="160" height="160" fill="#FFFFFF" />

                {/* Top-Left Finder Pattern (7x7) */}
                <rect x="10" y="10" width="42" height="42" fill="#000000" rx="4" />
                <rect x="16" y="16" width="30" height="30" fill="#FFFFFF" rx="2" />
                <rect x="22" y="22" width="18" height="18" fill="#000000" rx="2" />

                {/* Top-Right Finder Pattern (7x7) */}
                <rect x="108" y="10" width="42" height="42" fill="#000000" rx="4" />
                <rect x="114" y="16" width="30" height="30" fill="#FFFFFF" rx="2" />
                <rect x="120" y="22" width="18" height="18" fill="#000000" rx="2" />

                {/* Bottom-Left Finder Pattern (7x7) */}
                <rect x="10" y="108" width="42" height="42" fill="#000000" rx="4" />
                <rect x="16" y="114" width="30" height="30" fill="#FFFFFF" rx="2" />
                <rect x="22" y="120" width="18" height="18" fill="#000000" rx="2" />

                {/* Timing Lines */}
                <rect x="58" y="28" width="6" height="6" fill="#000000" />
                <rect x="70" y="28" width="6" height="6" fill="#000000" />
                <rect x="82" y="28" width="6" height="6" fill="#000000" />
                <rect x="94" y="28" width="6" height="6" fill="#000000" />

                <rect x="28" y="58" width="6" height="6" fill="#000000" />
                <rect x="28" y="70" width="6" height="6" fill="#000000" />
                <rect x="28" y="82" width="6" height="6" fill="#000000" />
                <rect x="28" y="94" width="6" height="6" fill="#000000" />

                {/* Internal Data Matrix Modules */}
                <rect x="58" y="58" width="6" height="6" fill="#000000" />
                <rect x="70" y="58" width="12" height="6" fill="#000000" />
                <rect x="94" y="58" width="6" height="6" fill="#000000" />
                <rect x="106" y="58" width="12" height="6" fill="#000000" />
                <rect x="124" y="58" width="6" height="6" fill="#000000" />
                <rect x="136" y="58" width="12" height="6" fill="#000000" />

                <rect x="10" y="58" width="12" height="6" fill="#000000" />
                <rect x="58" y="70" width="6" height="12" fill="#000000" />
                <rect x="70" y="70" width="6" height="6" fill="#000000" />
                <rect x="88" y="70" width="12" height="6" fill="#000000" />
                <rect x="112" y="70" width="6" height="12" fill="#000000" />
                <rect x="130" y="70" width="6" height="6" fill="#000000" />

                {/* Alignment pattern (around 118, 118) */}
                <rect x="112" y="112" width="30" height="30" fill="#000000" rx="2" />
                <rect x="118" y="118" width="18" height="18" fill="#FFFFFF" rx="1" />
                <rect x="124" y="124" width="6" height="6" fill="#000000" rx="1" />

                {/* Center / Body Modules */}
                <rect x="64" y="82" width="12" height="6" fill="#000000" />
                <rect x="82" y="82" width="6" height="12" fill="#000000" />
                <rect x="94" y="82" width="12" height="6" fill="#000000" />
                <rect x="118" y="82" width="6" height="6" fill="#000000" />
                <rect x="136" y="82" width="12" height="6" fill="#000000" />

                <rect x="58" y="94" width="6" height="12" fill="#000000" />
                <rect x="70" y="94" width="12" height="6" fill="#000000" />
                <rect x="88" y="94" width="6" height="6" fill="#000000" />
                <rect x="100" y="94" width="12" height="6" fill="#000000" />

                <rect x="58" y="112" width="12" height="6" fill="#000000" />
                <rect x="76" y="112" width="6" height="12" fill="#000000" />
                <rect x="88" y="112" width="18" height="6" fill="#000000" />

                <rect x="58" y="124" width="6" height="12" fill="#000000" />
                <rect x="70" y="124" width="6" height="6" fill="#000000" />
                <rect x="82" y="124" width="12" height="6" fill="#000000" />
                <rect x="100" y="124" width="6" height="12" fill="#000000" />

                <rect x="58" y="136" width="18" height="6" fill="#000000" />
                <rect x="82" y="136" width="6" height="12" fill="#000000" />
                <rect x="94" y="136" width="12" height="6" fill="#000000" />
                <rect x="112" y="142" width="18" height="6" fill="#000000" />
                <rect x="136" y="142" width="12" height="6" fill="#000000" />
              </svg>
            </div>

            {/* Pass Code and Guidance */}
            <div className="space-y-1.5">
              <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 tracking-wider inline-block">
                {passId}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Поднесите экран к оптическому считывателю турникета
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Installation Button Card */}
      <PWAInstallButton />

      {/* Logout Action Button */}
      <div className="pt-1">
        <Button
          id="profile-logout-button"
          variant="outline"
          onClick={logout}
          className="w-full border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 h-12 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <LogOut className="mr-2 h-4 w-4 stroke-[2.2px]" />
          <span>Завершить рабочую сессию (Выход)</span>
        </Button>
      </div>
    </div>
  );
}




