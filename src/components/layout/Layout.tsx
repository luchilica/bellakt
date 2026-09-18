import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  useNavPreferencesStore,
  ALL_AVAILABLE_NAV_ITEMS,
} from '../../store/useNavPreferencesStore';
import {
  Home,
  HeartPulse,
  UtensilsCrossed,
  Receipt,
  ClipboardList,
  Landmark,
  Bell,
  Power,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { OfflineIndicator } from '../OfflineIndicator';
import { LoadingScreen } from '../LoadingScreen';

function getNavIcon(iconName: string, className: string) {
  switch (iconName) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Bell':
      return <Bell className={className} />;
    default:
      return <HeartPulse className={className} />;
  }
}

export function Layout() {
  const { user, employeeData, isLoading, logout } = useAuthStore();
  const { slot1, slot2 } = useNavPreferencesStore();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const item1 = ALL_AVAILABLE_NAV_ITEMS[slot1] || ALL_AVAILABLE_NAV_ITEMS.health;
  const item2 = ALL_AVAILABLE_NAV_ITEMS[slot2] || ALL_AVAILABLE_NAV_ITEMS.canteen;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Format date: e.g. "08 СЕНТЯБРЯ 2026"
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
    .format(currentTime)
    .toUpperCase();

  // Format time: e.g. "11:30:15"
  const formattedTime = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const isHomeActive = location.pathname === '/';
  const isSlot1Active =
    location.pathname === item1.path ||
    (item1.path.includes('?') && location.pathname + location.search === item1.path);
  const isSlot2Active =
    location.pathname === item2.path ||
    (item2.path.includes('?') && location.pathname + location.search === item2.path);

  // Derive initials for avatar
  const initials = employeeData?.full_name
    ? employeeData.full_name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ЕБ';

  return (
    <div className="min-h-screen bg-[#EDF2F7] dark:bg-[#070e1b] flex flex-col justify-between text-slate-800 dark:text-slate-100 font-sans selection:bg-[#002B7F] selection:text-white transition-colors duration-200">
      <OfflineIndicator />

      {/* Corporate Kiosk/Portal Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6 pb-2">
        {/* Top Row: Left Profile Circle | Center Official Logo | Right Settings Circle */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Profile Circular Button (Same height as Logo) */}
          <Link
            to="/profile"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-[#002B7F] dark:hover:border-[#60a5fa] hover:shadow-md transition-all flex items-center justify-center text-[#002B7F] dark:text-[#60a5fa] font-bold text-xs sm:text-sm md:text-base shrink-0 group select-none"
            title="Личный профиль сотрудника"
          >
            <span className="group-hover:scale-105 transition-transform">{initials}</span>
          </Link>

          {/* Center: Official Logo */}
          <div className="flex-1 flex justify-center px-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Беллакт - Главная"
            >
              <img
                src="/logo.svg"
                alt="Волковысское ОАО «Беллакт»"
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[150px] sm:max-w-[200px] object-contain dark:brightness-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </Link>
          </div>

          {/* Right: Settings Gear Circular Button (Same height as Logo) */}
          <Link
            to="/settings"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-[#002B7F] dark:hover:border-[#60a5fa] hover:shadow-md transition-all flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#002B7F] dark:hover:text-[#60a5fa] shrink-0 group select-none"
            title="Настройки портала и темы"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[2.2px] group-hover:rotate-45 transition-transform duration-300" />
          </Link>
        </div>

        {/* Bottom Sub-row: Date & Digital Clock */}
        <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-2 sm:pt-2.5 mt-2 sm:mt-3">
          {/* Left: Current Date */}
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase select-none">
            {formattedDate}
          </div>

          {/* Right: Digital Clock */}
          <div className="text-xs sm:text-sm md:text-base font-mono font-medium tracking-tight text-slate-700 dark:text-slate-200 select-none text-right">
            {formattedTime}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl lg:max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Bottom Floating Navigation Dock */}
      <footer className="w-full max-w-6xl lg:max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 md:pb-6 pt-2 sticky bottom-0 z-30">
        {/* Desktop Bar (PC - lg and above) */}
        <div className="hidden lg:flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md backdrop-saturate-150 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] border border-white/80 dark:border-white/10 ring-1 ring-slate-200/60 dark:ring-slate-800/80 px-6 py-3 transition-all">
          <div className="flex items-center gap-3">
            {/* 1. Permanent Home */}
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                isHomeActive
                  ? 'bg-[#D6E6F9] dark:bg-[#002B7F] text-[#002B7F] dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Home className="w-5 h-5 stroke-[2.2px]" />
              <span>ГЛАВНОЕ МЕНЮ</span>
            </Link>

            {/* 2. Slot 1 (Customizable) */}
            <Link
              to={item1.path}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                isSlot1Active
                  ? 'bg-[#D6E6F9] dark:bg-[#002B7F] text-[#002B7F] dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {getNavIcon(item1.iconName, 'w-5 h-5 stroke-[2.2px]')}
              <span>{item1.label}</span>
            </Link>

            {/* 3. Slot 2 (Customizable) */}
            <Link
              to={item2.path}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                isSlot2Active
                  ? 'bg-[#D6E6F9] dark:bg-[#002B7F] text-[#002B7F] dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {getNavIcon(item2.iconName, 'w-5 h-5 stroke-[2.2px]')}
              <span>{item2.label}</span>
            </Link>
          </div>

          <div>
            <button
              onClick={logout}
              className="flex items-center justify-center px-6 py-2.5 rounded-xl border-2 border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100 dark:active:bg-red-900/40 text-sm font-bold transition-colors cursor-pointer"
            >
              <span>ВЫХОД</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Bar (under lg) */}
        <div className="lg:hidden flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md backdrop-saturate-150 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] border border-white/80 dark:border-white/10 ring-1 ring-slate-200/60 dark:ring-slate-800/80 px-3 sm:px-6 py-2 transition-all">
          {/* Permanent Home */}
          <Link
            to="/"
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
              isHomeActive ? 'text-[#002B7F] dark:text-[#60a5fa] font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'
            )}
          >
            <Home className={cn('w-5 h-5', isHomeActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
            <span className="text-[11px] mt-0.5">Главная</span>
          </Link>

          {/* Slot 1 (Customizable) */}
          <Link
            to={item1.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
              isSlot1Active ? 'text-[#002B7F] dark:text-[#60a5fa] font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'
            )}
          >
            {getNavIcon(
              item1.iconName,
              cn('w-5 h-5', isSlot1Active ? 'stroke-[2.5px]' : 'stroke-[1.8px]')
            )}
            <span className="text-[11px] mt-0.5">{item1.shortLabel}</span>
          </Link>

          {/* Slot 2 (Customizable) */}
          <Link
            to={item2.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
              isSlot2Active ? 'text-[#002B7F] dark:text-[#60a5fa] font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'
            )}
          >
            {getNavIcon(
              item2.iconName,
              cn('w-5 h-5', isSlot2Active ? 'stroke-[2.5px]' : 'stroke-[1.8px]')
            )}
            <span className="text-[11px] mt-0.5">{item2.shortLabel}</span>
          </Link>

          {/* Permanent Logout */}
          <button
            onClick={logout}
            className="flex items-center justify-center bg-[#002B7F] hover:bg-[#0B4DA2] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>ВЫХОД</span>
          </button>
        </div>
      </footer>
    </div>
  );
}


