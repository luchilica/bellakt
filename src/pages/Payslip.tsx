import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Download,
  Mail,
  ArrowLeft,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Eye,
  EyeOff,
  Building2,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';

interface PeriodData {
  periodLabel: string;
  accrued: number;
  deducted: number;
  toPay: number;
  accruals: { name: string; amount: number; tag: string; description?: string }[];
  deductions: { name: string; amount: number; tag: string; description?: string }[];
}

const PAYSLIP_RECORDS: Record<string, PeriodData> = {
  '2026-08': {
    periodLabel: 'Август 2026',
    accrued: 2150.00,
    deducted: 538.90,
    toPay: 1611.10,
    accruals: [
      { name: 'Оклад по часам и тарифной ставке', amount: 920.00, tag: 'Тариф', description: '168 раб. часов' },
      { name: 'Премия за качество и выполнение плана (30%)', amount: 276.00, tag: 'Премия', description: 'По приказу №142' },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00, tag: 'Стаж', description: 'Стаж более 5 лет' },
      { name: 'Доплата за работу в ночные смены', amount: 116.00, tag: 'Смены', description: '32 ночных часа' },
      { name: 'Контрактная надбавка за сложность', amount: 500.00, tag: 'Контракт', description: 'Условия контракта' },
      { name: 'Материальная помощь к оздоровлению', amount: 200.00, tag: 'Соцпакет', description: 'Коллективный договор' },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 279.50, tag: 'Налог', description: 'В бюджет Республики Беларусь' },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 21.50, tag: 'ФСЗН', description: 'Фонд социальной защиты' },
      { name: 'Профсоюзный взнос (1%)', amount: 21.50, tag: 'Профком', description: 'Первичная организация ОАО «Беллакт»' },
      { name: 'Питание в столовой предприятия', amount: 57.00, tag: 'Столовая', description: 'Списание по электронному талону' },
      { name: 'Услуги ФОК «Волна»', amount: 25.00, tag: 'Спорт', description: 'Льготный абонемент бассейн' },
      { name: 'Мобильная связь сверх лимита', amount: 3.40, tag: 'Связь', description: 'Корпоративный тариф А1' },
      { name: 'Выплаченный плановый аванс', amount: 131.00, tag: 'Аванс', description: 'Выплачен 15.08.2026' },
    ],
  },
  '2026-07': {
    periodLabel: 'Июль 2026',
    accrued: 2040.00,
    deducted: 512.20,
    toPay: 1527.80,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00, tag: 'Тариф' },
      { name: 'Премия за выполнение плана (30%)', amount: 276.00, tag: 'Премия' },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00, tag: 'Стаж' },
      { name: 'Доплата за ночные смены', amount: 106.00, tag: 'Смены' },
      { name: 'Контрактная надбавка', amount: 500.00, tag: 'Контракт' },
      { name: 'Премия ко Дню предприятия', amount: 100.00, tag: 'Премия' },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 265.20, tag: 'Налог' },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 20.40, tag: 'ФСЗН' },
      { name: 'Профсоюзный взнос (1%)', amount: 20.40, tag: 'Профком' },
      { name: 'Питание в столовой', amount: 64.20, tag: 'Столовая' },
      { name: 'Выплаченный аванс', amount: 142.00, tag: 'Аванс' },
    ],
  },
  '2026-06': {
    periodLabel: 'Июнь 2026',
    accrued: 1980.00,
    deducted: 494.40,
    toPay: 1485.60,
    accruals: [
      { name: 'Оклад по тарифной ставке', amount: 920.00, tag: 'Тариф' },
      { name: 'Премия за качество (25%)', amount: 230.00, tag: 'Премия' },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00, tag: 'Стаж' },
      { name: 'Доплата за ночные смены', amount: 92.00, tag: 'Смены' },
      { name: 'Контрактная надбавка', amount: 500.00, tag: 'Контракт' },
      { name: 'Надбавка за наставничество', amount: 100.00, tag: 'Наставник' },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 257.40, tag: 'Налог' },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 19.80, tag: 'ФСЗН' },
      { name: 'Профсоюзный взнос (1%)', amount: 19.80, tag: 'Профком' },
      { name: 'Питание в столовой', amount: 47.40, tag: 'Столовая' },
      { name: 'Выплаченный аванс', amount: 150.00, tag: 'Аванс' },
    ],
  },
};

const PERIODS = [
  { id: '2026-08', label: 'Август 2026' },
  { id: '2026-07', label: 'Июль 2026' },
  { id: '2026-06', label: 'Июнь 2026' },
];

export default function Payslip() {
  const { employeeData } = useAuthStore();
  const [period, setPeriod] = useState('2026-08');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const currentData = PAYSLIP_RECORDS[period] || PAYSLIP_RECORDS['2026-08'];

  const formatAmount = (val: number, prefix: string = '') => {
    if (isPrivacyMode) return '•••••• руб.';
    return `${prefix}${val.toFixed(2)} руб.`;
  };

  const handleDownload = () => {
    toast.success(`Расчетный лист за ${currentData.periodLabel} сформирован и загружен (PDF с ЭЦП)`);
  };

  const handleSendEmail = () => {
    toast.success(`Расчетный лист за ${currentData.periodLabel} отправлен на корпоративный email: ${employeeData?.email || 'ivanov@bellakt.by'}`);
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header with Segmented Period Pills & Privacy Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Расчётный лист
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Электронный квиток по заработной плате и налогам
            </p>
          </div>
        </div>

        {/* Right side controls: Period segmented pills + Kiosk Privacy Switcher */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2">
          {/* Segmented Period Switcher (like Canteen & HealthJournal) */}
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  period === p.id
                    ? 'bg-[#002B7F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Privacy Toggle Button for Kiosk Safety */}
          <button
            type="button"
            onClick={() => {
              setIsPrivacyMode(!isPrivacyMode);
              toast.info(isPrivacyMode ? 'Суммы отображены' : 'Суммы скрыты (защита от посторонних глаз)');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-bold cursor-pointer shrink-0 shadow-2xs ${
              isPrivacyMode
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isPrivacyMode ? 'Показать суммы' : 'Скрыть суммы (защита от посторонних глаз)'}
          >
            {isPrivacyMode ? (
              <>
                <Eye className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span className="hidden sm:inline">Показать суммы</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Скрыть суммы</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Employee Identity Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 border border-transparent dark:border-blue-800/40">
            {employeeData?.full_name?.charAt(0) || 'Е'}
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {employeeData?.full_name || 'Бороденя Евгений Сергеевич'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Табельный номер: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{employeeData?.tab_number || '20481'}</span> • {employeeData?.position || 'Инженер-технолог цеха №1'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            ОАО «Беллакт»
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            ЭЦП бухгалтерии активна
          </span>
        </div>
      </div>

      {/* Main Total Summary Cards (Benchmark Squircle style like Dashboard & HealthJournal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {/* 1. К ВЫДАЧЕ НА КАРТУ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-2 border-[#0B4DA2]/30 dark:border-[#60A5FA]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 flex items-center justify-center text-[#0B4DA2] dark:text-blue-300 shrink-0">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                К выдаче на карту
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#002B7F] dark:text-[#60A5FA] tracking-tight mt-0.5">
                {formatAmount(currentData.toPay)}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Банк зачисления:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Беларусбанк
            </span>
          </div>
        </div>

        {/* 2. ВСЕГО НАЧИСЛЕНО */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Всего начислено
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {formatAmount(currentData.accrued, '+')}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Позиций дохода:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentData.accruals.length} выплат
            </span>
          </div>
        </div>

        {/* 3. ВСЕГО УДЕРЖАНО */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Всего удержано
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-700 dark:text-slate-300 tracking-tight mt-0.5">
                {formatAmount(currentData.deducted, '-')}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Включая аванс:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              налоги 13%, ФСЗН, столовая
            </span>
          </div>
        </div>
      </div>

      {/* Details Columns: Accruals vs Deductions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Accruals List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 sm:p-5 lg:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Начисления ({currentData.accruals.length})
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {formatAmount(currentData.accrued, '+')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {currentData.accruals.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white shrink-0 ml-2">
                  {formatAmount(item.amount, '+')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 sm:p-5 lg:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Удержания ({currentData.deductions.length})
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {formatAmount(currentData.deducted, '-')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {currentData.deductions.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                  {formatAmount(item.amount, '-')}
                </div>
              </div>
            ))}
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
          Скачать расчетный лист (PDF с ЭЦП)
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

