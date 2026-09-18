import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
      description: '8 посещений в месяц (льготный тариф для сотрудников завода)',
      date: 'Август 2026',
      employeePrice: 25.00,
      subsidy: 35.00,
      fullPrice: 60.00,
      status: 'held',
    },
    {
      id: 'УСЛ-2026-389',
      title: 'Санаторно-оздоровительная путевка (софинансирование)',
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
      title: 'Служебный транспорт / Корпоративная развозка',
      category: 'transport',
      description: 'Проездной билет на служебный автобус завода (смена №1)',
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
    plan: 'УП «А1» – Корпоративный безлимит «Беллакт»',
    includedMinutes: '3000 мин во все сети РБ',
    usedMinutes: '840 мин (в пределах лимита)',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Услуги предприятия, удержанные из заработной платы
            </p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs sm:text-sm h-10 w-[180px] text-slate-900 dark:text-white">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              <SelectItem value="2026-08">Август 2026</SelectItem>
              <SelectItem value="2026-07">Июль 2026</SelectItem>
              <SelectItem value="2026-06">Июнь 2026</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Сводный отчет по услугам экспортирован')}
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-10 px-3 text-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#002B7F] dark:text-blue-400" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Всего удержано за месяц
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#002B7F] dark:text-blue-400 mt-1.5">
              {totalMonthDeductions.toFixed(2)} руб.
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Включено в расчетный лист за август
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Льготы и дотации завода
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">
              +215.00 руб.
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Компенсировано предприятием «Беллакт»
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Обедов в столовой
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {canteenReceipts.length} чеков ({totalCanteen.toFixed(2)} руб.)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Электронное списание по талону
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3 Main Tabs strictly matching specification 4.6 */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('canteen')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'canteen'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>1. Чеки столовой ({canteenReceipts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('salary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'salary'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>2. Услуги в счёт ЗП (ФОК, спорт)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telecom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'telecom'
              ? 'bg-[#002B7F] text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>3. Услуги связи (А1)</span>
        </button>
      </div>

      {/* Tab 1: Чеки столовой */}
      {activeTab === 'canteen' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Детализация заказов и электронных чеков столовой ({selectedMonth})
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              Итого: {totalCanteen.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-3">
            {canteenReceipts.map((receipt) => (
              <Card key={receipt.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#002B7F] dark:text-blue-400" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{receipt.id}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">• {receipt.date} в {receipt.time}</span>
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-[#002B7F] dark:text-blue-400">
                      {receipt.total.toFixed(2)} руб.
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm divide-y divide-slate-50 dark:divide-slate-800/60">
                    {receipt.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0 text-slate-700 dark:text-slate-300">
                        <span>{item.name} × {item.count}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{item.price.toFixed(2)} руб.</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Услуги в счёт ЗП */}
      {activeTab === 'salary' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Спорткомплекс, бассейн и оздоровление сотрудников
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              К удержанию: {totalSalaryServices.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-3">
            {salaryServices.map((srv) => (
              <Card key={srv.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {srv.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {srv.description}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Период: {srv.date} • Стоимость без льготы: {srv.fullPrice.toFixed(2)} руб.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-1 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {srv.employeePrice.toFixed(2)} руб.
                    </div>
                    {srv.subsidy > 0 && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                        Оплачено заводом: +{srv.subsidy.toFixed(2)} руб.
                      </div>
                    )}
                    <span className="text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md mt-1">
                      Удержано из з/п
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Услуги связи */}
      {activeTab === 'telecom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Корпоративная мобильная связь и лимиты
            </h2>
            <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400">
              К списанию: {telecomData.overlimitAmount.toFixed(2)} руб.
            </span>
          </div>

          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {telecomData.phone}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">{telecomData.plan}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-600 dark:text-slate-400 block">Удержание за перерасход:</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {telecomData.overlimitAmount.toFixed(2)} руб.
                  </span>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Голосовая связь (минуты)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Лимит соблюден</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Использовано: {telecomData.usedMinutes} из {telecomData.includedMinutes}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Мобильный интернет (ГБ)</span>
                    <span className="text-amber-700 dark:text-amber-400 font-bold">Перерасход трафика</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Использовано: {telecomData.usedInternet} (лимит {telecomData.includedInternet})
                  </div>
                  <div className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    {telecomData.overlimitInternet} • Сумма: {telecomData.overlimitAmount.toFixed(2)} руб.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
