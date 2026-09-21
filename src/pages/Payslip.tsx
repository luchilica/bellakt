import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Download,
  Mail,
  ArrowLeft,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';

interface PeriodData {
  periodLabel: string;
  accrued: number;
  deducted: number;
  toPay: number;
  accruals: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}

const PAYSLIP_RECORDS: Record<string, PeriodData> = {
  '2026-08': {
    periodLabel: 'Август 2026',
    accrued: 2150.00,
    deducted: 568.90,
    toPay: 1581.10,
    accruals: [
      { name: 'Оклад по часам и тарифной ставке', amount: 920.00 },
      { name: 'Премия за качество и выполнение плана (30%)', amount: 276.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за работу в ночные смены', amount: 116.00 },
      { name: 'Контрактная надбавка за сложность', amount: 500.00 },
      { name: 'Материальная помощь к оздоровлению', amount: 200.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 279.50 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 21.50 },
      { name: 'Профсоюзный взнос (1%)', amount: 21.50 },
      { name: 'Оказанные услуги', amount: 115.40 },
      { name: 'Выплаченный плановый аванс', amount: 131.00 },
    ],
  },
  '2026-07': {
    periodLabel: 'Июль 2026',
    accrued: 2040.00,
    deducted: 512.20,
    toPay: 1527.80,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00 },
      { name: 'Премия за выполнение плана (30%)', amount: 276.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за ночные смены', amount: 106.00 },
      { name: 'Контрактная надбавка', amount: 500.00 },
      { name: 'Премия ко Дню предприятия', amount: 100.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 265.20 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 20.40 },
      { name: 'Профсоюзный взнос (1%)', amount: 20.40 },
      { name: 'Оказанные услуги', amount: 64.20 },
      { name: 'Выплаченный аванс', amount: 142.00 },
    ],
  },
  '2026-06': {
    periodLabel: 'Июнь 2026',
    accrued: 1980.00,
    deducted: 494.40,
    toPay: 1485.60,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00 },
      { name: 'Премия за качество (25%)', amount: 230.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за ночные смены', amount: 92.00 },
      { name: 'Контрактная надбавка', amount: 500.00 },
      { name: 'Надбавка за наставничество', amount: 100.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 257.40 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 19.80 },
      { name: 'Профсоюзный взнос (1%)', amount: 19.80 },
      { name: 'Оказанные услуги', amount: 47.40 },
      { name: 'Выплаченный аванс', amount: 150.00 },
    ],
  },
  '2026-05': {
    periodLabel: 'Май 2026',
    accrued: 1950.00,
    deducted: 487.50,
    toPay: 1462.50,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00 },
      { name: 'Премия за выполнение плана (25%)', amount: 230.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за праздничные смены (9 Мая)', amount: 162.00 },
      { name: 'Контрактная надбавка', amount: 500.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 253.50 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 19.50 },
      { name: 'Профсоюзный взнос (1%)', amount: 19.50 },
      { name: 'Оказанные услуги', amount: 55.00 },
      { name: 'Выплаченный аванс', amount: 140.00 },
    ],
  },
  '2026-04': {
    periodLabel: 'Апрель 2026',
    accrued: 1920.00,
    deducted: 480.00,
    toPay: 1440.00,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00 },
      { name: 'Премия за качество (25%)', amount: 230.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за ночные смены', amount: 132.00 },
      { name: 'Контрактная надбавка', amount: 500.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 249.60 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 19.20 },
      { name: 'Профсоюзный взнос (1%)', amount: 19.20 },
      { name: 'Оказанные услуги', amount: 52.00 },
      { name: 'Выплаченный аванс', amount: 140.00 },
    ],
  },
  '2026-03': {
    periodLabel: 'Март 2026',
    accrued: 1910.00,
    deducted: 477.50,
    toPay: 1432.50,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00 },
      { name: 'Премия за качество (25%)', amount: 230.00 },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00 },
      { name: 'Доплата за смены', amount: 122.00 },
      { name: 'Контрактная надбавка', amount: 500.00 },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 248.30 },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 19.10 },
      { name: 'Профсоюзный взнос (1%)', amount: 19.10 },
      { name: 'Оказанные услуги', amount: 51.00 },
      { name: 'Выплаченный аванс', amount: 140.00 },
    ],
  },
};

const PERIODS = [
  { id: '2026-08', label: 'Август 2026' },
  { id: '2026-07', label: 'Июль 2026' },
  { id: '2026-06', label: 'Июнь 2026' },
  { id: '2026-05', label: 'Май 2026' },
  { id: '2026-04', label: 'Апрель 2026' },
  { id: '2026-03', label: 'Март 2026' },
];

export default function Payslip() {
  const { employeeData } = useAuthStore();
  const [periodIndex, setPeriodIndex] = useState(0); // 0 corresponds to 2026-08 (latest)
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const corporateEmail = employeeData?.email || 'ivanov@bellakt.by';

  // Instant one-click subscription toggle to corporate email from profile (no popup modal)
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('bellakt_payslip_subscribed') === 'true';
  });

  const handleToggleSubscription = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    localStorage.setItem('bellakt_payslip_subscribed', String(nextState));

    if (nextState) {
      toast.success(
        `Подписка оформлена! Расчётный листок будет автоматически приходить за 1 день до зарплаты на рабочую почту ${corporateEmail}`
      );
    } else {
      toast.info('Подписка на рассылку расчетного листа отключена');
    }
  };

  const currentPeriod = PERIODS[periodIndex] || PERIODS[0];
  const currentData =
    PAYSLIP_RECORDS[currentPeriod.id] || PAYSLIP_RECORDS['2026-08'];

  const formatAmount = (val: number, prefix: string = '') => {
    if (isPrivacyMode) return '•••••• руб.';
    return `${prefix}${val.toFixed(2)} руб.`;
  };

  const handlePrevPeriod = () => {
    if (periodIndex < PERIODS.length - 1) {
      setPeriodIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPeriod = () => {
    if (periodIndex > 0) {
      setPeriodIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    toast.success(`Расчетный лист за ${currentData.periodLabel} сформирован и загружен`);
  };

  const handleSendEmail = () => {
    toast.success(
      `Расчетный лист за ${currentData.periodLabel} отправлен на рабочую почту сотрудника: ${corporateEmail}`
    );
  };

  return (
    <div
      className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 pb-10 border-[#fff6f5]"
      style={{ borderColor: '#fff6f5' }}
    >
      {/* Header with Month Arrow Switcher & Privacy Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Расчётный лист
          </h1>
        </div>

        {/* Right controls: < месяц > + Подписка на рассылку (быстрое включение на корпоративную почту без всплывающих окон) + Скрыть суммы */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 w-full lg:w-auto lg:min-w-[560px]">
          {/* < Месяц > Arrow Switcher */}
          <div className="h-10 sm:h-11 flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-1 w-full">
            <button
              type="button"
              onClick={handlePrevPeriod}
              disabled={periodIndex >= PERIODS.length - 1}
              className="h-full aspect-square flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              title="Предыдущий месяц"
              aria-label="Предыдущий месяц"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="px-2 sm:px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white text-center select-none truncate flex-1">
              {currentData.periodLabel}
            </span>
            <button
              type="button"
              onClick={handleNextPeriod}
              disabled={periodIndex <= 0}
              className="h-full aspect-square flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              title="Следующий месяц"
              aria-label="Следующий месяц"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Subscription Button - direct toggle to corporate email from profile without modal */}
          <button
            type="button"
            onClick={handleToggleSubscription}
            className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 w-full ${
              isSubscribed
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={`Рассылка расчетного листа на рабочую почту ${corporateEmail}`}
          >
            <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#002B7F] dark:text-blue-400 shrink-0" />
            <span className="truncate">{isSubscribed ? 'Рассылка активна' : 'Подписка на рассылку'}</span>
          </button>

          {/* Privacy Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsPrivacyMode(!isPrivacyMode);
              toast.info(
                isPrivacyMode
                  ? 'Суммы отображены'
                  : 'Суммы скрыты (защита от посторонних глаз)'
              );
            }}
            className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl border transition-all text-xs sm:text-sm font-bold cursor-pointer shadow-2xs flex items-center justify-center gap-2 w-full ${
              isPrivacyMode
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={
              isPrivacyMode
                ? 'Показать суммы'
                : 'Скрыть суммы (защита от посторонних глаз)'
            }
          >
            {isPrivacyMode ? (
              <>
                <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span className="truncate">Показать суммы</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">Скрыть суммы</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Employee Identity Strip - Minimalist, like HealthJournal, no badges/labels */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center gap-3.5 shadow-2xs">
        <img
          src={employeeData?.avatar_url || '/ivan_ivanov.jpg'}
          alt={employeeData?.full_name || 'Иванов Иван Иванович'}
          referrerPolicy="no-referrer"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
        />
        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {employeeData?.full_name || 'Иванов Иван Иванович'}
        </div>
      </div>

      {/* Main Total Summary Cards: Only Icon, Label and Amount */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {/* 1. К ВЫДАЧЕ НА КАРТУ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0 border border-transparent dark:border-blue-800/40">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              К выдаче на карту
            </div>
            <div className="text-base sm:text-lg font-bold text-[#002B7F] dark:text-[#60A5FA] tracking-tight">
              {formatAmount(currentData.toPay)}
            </div>
          </div>
        </div>

        {/* 2. ВСЕГО НАЧИСЛЕНО */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Всего начислено
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {formatAmount(currentData.accrued, '+')}
            </div>
          </div>
        </div>

        {/* 3. ВСЕГО УДЕРЖАНО */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-800/40">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Всего удержано
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 tracking-tight">
              {formatAmount(currentData.deducted, '-')}
            </div>
          </div>
        </div>
      </div>

      {/* Details Columns: Accruals vs Deductions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Accruals List (Styled in Green, no dot, no extra explanations) */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl lg:rounded-3xl border-2 border-emerald-300/80 dark:border-emerald-800/60 p-4 sm:p-5 lg:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200/80 dark:border-emerald-800/60 pb-3">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm sm:text-base">
              Начисления ({currentData.accruals.length})
            </h3>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {formatAmount(currentData.accrued, '+')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {currentData.accruals.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between gap-3 shadow-2xs"
              >
                <span className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </span>
                <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">
                  {formatAmount(item.amount, '+')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions List (Styled in Rose/Deductions theme, no dot, no extra explanations) */}
        <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl lg:rounded-3xl border-2 border-rose-300/80 dark:border-rose-800/60 p-4 sm:p-5 lg:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-200/80 dark:border-rose-800/60 pb-3">
            <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm sm:text-base">
              Удержания ({currentData.deductions.length})
            </h3>
            <span className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300">
              {formatAmount(currentData.deducted, '-')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {currentData.deductions.map((item, idx) => {
              if (item.name === 'Оказанные услуги') {
                return (
                  <Link
                    key={idx}
                    to="/services"
                    title="Перейти к детализации в раздел «Оказанные услуги»"
                    className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-rose-900/40 hover:border-[#002B7F]/40 dark:hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 shadow-2xs transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-[#002B7F] dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-[#002B7F] dark:group-hover:text-blue-400 transition-colors shrink-0">
                        (подробнее →)
                      </span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-400 shrink-0 ml-2">
                      {formatAmount(item.amount, '-')}
                    </span>
                  </Link>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <span className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-400 shrink-0 ml-2">
                    {formatAmount(item.amount, '-')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons: PDF Download + Email */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button
          className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white h-12 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer px-7"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4 stroke-[2.2px]" />
          Скачать расчетный лист
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-12 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer px-7"
          onClick={handleSendEmail}
        >
          <Mail className="mr-2 h-4 w-4 text-[#002B7F] dark:text-blue-400" />
          Отправить на email сотрудника
        </Button>
      </div>
    </div>
  );
}
