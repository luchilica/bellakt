import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useHealthStore } from '../store/useHealthStore';
import { cn } from '../lib/utils';
import {
  HeartPulse,
  UtensilsCrossed,
  Receipt,
  ClipboardList,
  Bell,
  Landmark,
} from 'lucide-react';

export default function Dashboard() {
  const { employeeData } = useAuthStore();
  const userName = employeeData?.full_name || 'Евгений Бороденя';
  const { isCheckedInToday } = useHealthStore();
  const isCheckedIn = isCheckedInToday();

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 lg:space-y-8 my-auto">
      {/* Greeting Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-slate-900 dark:text-white tracking-tight">
          <span className="font-medium text-slate-900 dark:text-white">Здравствуйте, </span>
          <span className="font-bold text-[#0B4DA2] dark:text-[#60A5FA]">{userName}!</span>
        </h1>
      </div>

      {/* 6 Grid Cards: 3x2 horizontal grid on PC, phone-like single column on tablet/mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8">
        {/* 1. ЖУРНАЛ ЗДОРОВЬЯ */}
        <Link
          to="/health"
          className={cn(
            'group relative rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer overflow-hidden',
            !isCheckedIn
              ? 'health-alert-pulse bg-gradient-to-r from-red-50/90 via-white to-red-50/90 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/40 border-2 border-red-400/80 dark:border-red-500/70 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]'
              : 'bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'
          )}
        >
          {/* Subtle red shimmer sweep when not checked in */}
          {!isCheckedIn && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/35 dark:via-red-400/20 to-transparent health-shimmer-sweep pointer-events-none rounded-2xl lg:rounded-3xl" />
          )}

          <div
            className={cn(
              'w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
              !isCheckedIn
                ? 'bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 ring-2 ring-red-300/60 dark:ring-red-800/60'
                : 'bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 border border-transparent dark:border-blue-800/40'
            )}
          >
            <HeartPulse className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>

          <div className="flex-1 min-w-0 z-10">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ЖУРНАЛ ЗДОРОВЬЯ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              Отметка самочувствия и просмотр записей
            </div>
          </div>
        </Link>

        {/* 2. МЕНЮ СТОЛОВОЙ */}
        <Link
          to="/canteen"
          className="group bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              МЕНЮ СТОЛОВОЙ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              Просмотр и заказ блюд на сегодня
            </div>
          </div>
        </Link>

        {/* 3. РАСЧЕТНЫЙ ЛИСТ */}
        <Link
          to="/payslip"
          className="group bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0 transition-transform group-hover:scale-105">
            <Receipt className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              РАСЧЕТНЫЙ ЛИСТ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              Начисления и удержания
            </div>
          </div>
        </Link>

        {/* 4. ОКАЗАННЫЕ УСЛУГИ */}
        <Link
          to="/services"
          className="group bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0 transition-transform group-hover:scale-105">
            <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ОКАЗАННЫЕ УСЛУГИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              Архив выполненных запросов
            </div>
          </div>
        </Link>

        {/* 5. УВЕДОМЛЕНИЯ И ВАКАНСИИ */}
        <Link
          to="/notifications"
          className="group bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0 transition-transform group-hover:scale-105">
            <Bell className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              УВЕДОМЛЕНИЯ И ВАКАНСИИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              Актуальные предложения
            </div>
          </div>
        </Link>

        {/* 6. ЗАПРОС СПРАВКИ */}
        <Link
          to="/certificates"
          className="group bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0 transition-transform group-hover:scale-105">
            <Landmark className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ЗАПРОС СПРАВКИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-normal mt-0.5 sm:mt-1">
              О доходах и другие справки
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
