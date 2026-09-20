import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  UtensilsCrossed,
  Smartphone,
  Dumbbell,
  ArrowLeft,
  Calendar,
  Receipt,
  Download,
  Info,
  Building2,
  CheckCircle2,
  Sparkles,
  Bus,
  Palmtree,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface CanteenReceipt {
  id: string;
  date: string;
  time: string;
  items: { name: string; count: number; price: number }[];
  total: number;
}

interface SalaryService {
  id: string;
  title: string;
  category: 'sports' | 'wellness' | 'transport';
  description: string;
  date: string;
  employeePrice: number;
  subsidy: number;
  fullPrice: number;
  status: 'held';
}

interface TelecomUsage {
  phone: string;
  plan: string;
  includedMinutes: string;
  usedMinutes: string;
  includedInternet: string;
  usedInternet: string;
  overlimitInternet: string;
  overlimitAmount: number;
  status: 'held';
}

const MONTHS = [
  { id: '2026-08', label: 'Август 2026' },
  { id: '2026-07', label: 'Июль 2026' },
  { id: '2026-06', label: 'Июнь 2026' },
];

export default function Services() {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [activeTab, setActiveTab] = useState<'canteen' | 'salary' | 'telecom'>('canteen');

  // 1. Canteen Receipts Data
  const canteenReceipts: CanteenReceipt[] = [
    {
      id: 'ЧЕК-2026-9901',
      date: '28.08.2026',
      time: '12:45',
      items: [
        { name: 'Борщ с говядиной и сметаной', count: 1, price: 4.80 },
        { name: 'Котлета мясная «По-волковысски»', count: 1, price: 4.90 },
        { name: 'Пюре картофельное на молоке', count: 1, price: 1.60 },
        { name: 'Компот из лесных ягод', count: 1, price: 1.00 },
        { name: 'Хлеб ржано-пшеничный (2 кус.)', count: 1, price: 0.30 },
      ],
      total: 12.60,
    },
    {
      id: 'ЧЕК-2026-9742',
      date: '25.08.2026',
      time: '12:35',
      items: [
        { name: 'Солянка мясная сборная', count: 1, price: 5.40 },
        { name: 'Драники картофельные со сметаной', count: 1, price: 4.60 },
        { name: 'Компот из ягод', count: 1, price: 1.00 },
      ],
      total: 11.00,
    },
    {
      id: 'ЧЕК-2026-9511',
      date: '20.08.2026',
      time: '13:10',
      items: [
        { name: 'Суп куриный с лапшой', count: 1, price: 4.10 },
        { name: 'Филе хека с сыром «Беллакт»', count: 1, price: 5.20 },
        { name: 'Каша гречневая с маслом', count: 1, price: 1.40 },
        { name: 'Салат витаминный', count: 1, price: 1.80 },
      ],
      total: 12.50,
    },
    {
      id: 'ЧЕК-2026-9302',
      date: '14.08.2026',
      time: '12:40',
      items: [
        { name: 'Борщ с говядиной', count: 1, price: 4.80 },
        { name: 'Сырники из творога «Беллакт»', count: 1, price: 3.20 },
        { name: 'Булочка с маком', count: 1, price: 1.10 },
        { name: 'Компот из ягод', count: 1, price: 1.00 },
      ],
      total: 10.10,
    },
    {
      id: 'ЧЕК-2026-9110',
      date: '07.08.2026',
      time: '12:50',
      items: [
        { name: 'Солянка мясная сборная', count: 1, price: 5.40 },
        { name: 'Котлета мясная', count: 1, price: 4.90 },
        { name: 'Пюре картофельное', count: 1, price: 1.60 },
      ],
      total: 10.80,
    },
  ];

  // 2. Services in Salary (ФОК, оздоровление, спорт)
  const salaryServices: SalaryService[] = [
    {
      id: 'УСЛ-2026-441',
      title: 'ФОК «Волна» – Абонемент в бассейн и тренажёрный зал',
      category: 'sports',
      description: '8 посещений в месяц (льготный тариф для сотрудников предприятия)',
      date: 'Август 2026',
      employeePrice: 25.00,
      subsidy: 35.00,
      fullPrice: 60.00,
      status: 'held',
    },
    {
      id: 'УСЛ-2026-389',
      title: 'Санаторно-оздоровительная путевка (софинансирование завода)',
      category: 'wellness',
      description: 'Частичная компенсация путевки в санаторий «Ружанский»',
      date: 'Август 2026',
      employeePrice: 0.00,
      subsidy: 150.00,
      fullPrice: 150.00,
      status: 'held',
    },
    {
      id: 'УСЛ-2026-210',
      title: 'Служебный транспорт / Корпоративная развозка цеха',
      category: 'transport',
      description: 'Проездной билет на служебный автобус завода (маршрут смены №1)',
      date: 'Август 2026',
      employeePrice: 0.00,
      subsidy: 30.00,
      fullPrice: 30.00,
      status: 'held',
    },
  ];

  // 3. Telecom Usage
  const telecomData: TelecomUsage = {
    phone: '+375 (29) 782-45-12',
    plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
    includedMinutes: '3000 мин во все сети РБ',
    usedMinutes: '840 мин (в пределах корпоративного лимита)',
    includedInternet: '15 ГБ на неограниченной скорости',
    usedInternet: '16.8 ГБ',
    overlimitInternet: '1.8 ГБ сверх корпоративного пакета',
    overlimitAmount: 3.40,
    status: 'held',
  };

  const totalCanteen = canteenReceipts.reduce((sum, r) => sum + r.total, 0);
  const totalSalaryServices = salaryServices.reduce((sum, s) => sum + s.employeePrice, 0);
  const totalTelecom = telecomData.overlimitAmount;
  const totalMonthDeductions = totalCanteen + totalSalaryServices + totalTelecom;

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Top Header */}
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
              Оказанные услуги
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Столовая, спорткомплекс «Волна», оздоровление и корпоративная связь
            </p>
          </div>
        </div>

        {/* Month Selector Pills + Export */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
            {MONTHS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMonth === m.id
                    ? 'bg-[#002B7F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Сводная ведомость по услугам за август сформирована (PDF)')}
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-9 px-3.5 text-xs font-bold shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#002B7F] dark:text-blue-400 stroke-[2.2px]" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Summary Row (Squircle Benchmark Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {/* 1. Удержано */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Всего удержано за месяц
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#002B7F] dark:text-[#60A5FA] tracking-tight mt-0.5">
                {totalMonthDeductions.toFixed(2)} руб.
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Включено в расчетный листок за август
          </div>
        </div>

        {/* 2. Льготы завода */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Дотации завода «Беллакт»
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight mt-0.5">
                +215.00 руб.
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Компенсировано предприятием
          </div>
        </div>

        {/* 3. Чеков в столовой */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Обедов в столовой
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {canteenReceipts.length} чеков
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Электронное списание по талону ({totalCanteen.toFixed(2)} руб.)
          </div>
        </div>
      </div>

      {/* 3 Main Tabs strictly matching specification 4.6 with Segmented Control */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('canteen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'canteen'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 stroke-[2.2px]" />
          <span>1. Чеки столовой ({canteenReceipts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('salary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'salary'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4 stroke-[2.2px]" />
          <span>2. Услуги в счёт ЗП (ФОК, спорт)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telecom')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'telecom'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4 stroke-[2.2px]" />
          <span>3. Услуги связи (А1)</span>
        </button>
      </div>

      {/* Tab 1: Чеки столовой (Electronic Voucher Cards) */}
      {activeTab === 'canteen' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Электронные квитанции питания в столовой завода
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              Итого за месяц: {totalCanteen.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-3">
            {canteenReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-4 sm:p-5 lg:p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 stroke-[2.2px]" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{receipt.id}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">• {receipt.date} в {receipt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Сумма чека:</span>
                    <span className="font-extrabold text-base text-[#002B7F] dark:text-blue-400">
                      {receipt.total.toFixed(2)} руб.
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  {receipt.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.name} <span className="text-slate-500 font-normal">× {item.count}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                        {item.price.toFixed(2)} руб.
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Оплачено электронным талоном (удержание из зарплаты)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">Касса №1 • Столовая ОАО «Беллакт»</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Услуги в счёт ЗП (ФОК, санатории) */}
      {activeTab === 'salary' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Спорткомплекс, бассейн и оздоровление сотрудников
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              К удержанию: {totalSalaryServices.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-3">
            {salaryServices.map((srv) => {
              const Icon = srv.category === 'sports' ? Dumbbell : srv.category === 'wellness' ? Palmtree : Bus;
              return (
                <div
                  key={srv.id}
                  className="rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-4 sm:p-5 lg:p-6 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {srv.title}
                          </h3>
                          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                            {srv.id}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {srv.description}
                        </p>
                        <div className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                          Период: <strong className="text-slate-700 dark:text-slate-300">{srv.date}</strong> • Полная стоимость: {srv.fullPrice.toFixed(2)} руб.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-1.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {srv.employeePrice.toFixed(2)} руб.
                      </div>
                      {srv.subsidy > 0 && (
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/60">
                          Завод оплатил: +{srv.subsidy.toFixed(2)} руб.
                        </div>
                      )}
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                        {srv.employeePrice > 0 ? 'Удержано из з/п' : '100% за счет завода'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Услуги связи */}
      {activeTab === 'telecom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Корпоративная мобильная связь и лимиты
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              К списанию: {telecomData.overlimitAmount.toFixed(2)} руб.
            </span>
          </div>

          <div className="rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 stroke-[2.2px]" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                    {telecomData.phone}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {telecomData.plan}
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Удержание за перерасход:</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {telecomData.overlimitAmount.toFixed(2)} руб.
                </span>
              </div>
            </div>

            {/* Usage Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Голосовая связь (минуты)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Лимит соблюден</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[28%]" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Использовано: <strong>{telecomData.usedMinutes}</strong> из {telecomData.includedMinutes}
                </div>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Мобильный интернет (ГБ)</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">Перерасход трафика</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[100%]" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Использовано: <strong>{telecomData.usedInternet}</strong> (лимит {telecomData.includedInternet})
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg border border-amber-200/80 dark:border-amber-800/60">
                  {telecomData.overlimitInternet} • Сумма: {telecomData.overlimitAmount.toFixed(2)} руб.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

