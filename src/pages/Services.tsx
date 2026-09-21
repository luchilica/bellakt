import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  UtensilsCrossed,
  Smartphone,
  ArrowLeft,
  TrendingDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
} from 'lucide-react';
import { toast } from 'sonner';

interface CanteenReceiptItem {
  name: string;
  count: number;
  price: number;
}

interface CanteenReceipt {
  id: string;
  date: string;
  time: string;
  items: CanteenReceiptItem[];
}

interface SalaryService {
  type: 'fok' | 'voucher';
  title: string;
  date: string;
  employeePrice: number;
  description?: string;
  subsidy?: number;
  fullPrice?: number;
  provider?: string;
}

interface TelecomData {
  phone: string;
  plan: string;
  period: string;
  includedMinutes: string;
  usedMinutes: string;
  includedInternet: string;
  usedInternet: string;
  overlimitInternet: string;
  overlimitAmount: number;
}

interface MonthServicesData {
  periodId: string;
  periodLabel: string;
  canteenReceipts: CanteenReceipt[];
  salaryServices: SalaryService[];
  telecom: TelecomData;
}

const MONTH_DATA_RECORDS: Record<string, MonthServicesData> = {
  '2026-08': {
    periodId: '2026-08',
    periodLabel: 'Август 2026',
    canteenReceipts: [
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
      },
      {
        id: 'ЧЕК-2026-9110',
        date: '07.08.2026',
        time: '12:50',
        items: [
          { name: 'Солянка мясная сборная', count: 1, price: 4.80 },
          { name: 'Котлета мясная', count: 1, price: 4.40 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
        ],
      },
    ],
    salaryServices: [
      {
        type: 'fok',
        title: 'Услуги ФОКа',
        date: '12.08.2026',
        employeePrice: 25.00,
      },
      {
        type: 'voucher',
        title: 'Санаторно-оздоровительная путевка',
        date: '05.08.2026',
        fullPrice: 150.00,
        subsidy: 120.00,
        employeePrice: 30.00,
        provider: 'Санаторий «Ружанский» • Профком ОАО «Беллакт»',
      },
    ],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Август 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '840 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '16.8 ГБ',
      overlimitInternet: '1.8 ГБ сверх корпоративного пакета',
      overlimitAmount: 3.40,
    },
  },
  '2026-07': {
    periodId: '2026-07',
    periodLabel: 'Июль 2026',
    canteenReceipts: [
      {
        id: 'ЧЕК-2026-8805',
        date: '24.07.2026',
        time: '12:40',
        items: [
          { name: 'Борщ со сметаной', count: 1, price: 4.80 },
          { name: 'Котлета мясная', count: 1, price: 4.90 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Салат овощной', count: 1, price: 1.00 },
          { name: 'Компот из лесных ягод', count: 1, price: 1.00 },
        ],
      },
      {
        id: 'ЧЕК-2026-8612',
        date: '18.07.2026',
        time: '13:05',
        items: [
          { name: 'Щи из свежей капусты', count: 1, price: 4.20 },
          { name: 'Гуляш говяжий с подливой', count: 1, price: 5.80 },
          { name: 'Каша гречневая', count: 1, price: 1.40 },
          { name: 'Морс ягодный', count: 1, price: 1.10 },
        ],
      },
      {
        id: 'ЧЕК-2026-8430',
        date: '12.07.2026',
        time: '12:30',
        items: [
          { name: 'Солянка мясная сборная', count: 1, price: 5.40 },
          { name: 'Птица запеченная с сыром', count: 1, price: 5.60 },
          { name: 'Рис с овощами', count: 1, price: 1.50 },
          { name: 'Салат витаминный', count: 1, price: 1.80 },
        ],
      },
      {
        id: 'ЧЕК-2026-8219',
        date: '07.07.2026',
        time: '12:50',
        items: [
          { name: 'Суп гороховый с копченостями', count: 1, price: 4.10 },
          { name: 'Рыба жареная в тесте', count: 1, price: 5.10 },
          { name: 'Картофель отварной', count: 1, price: 1.50 },
          { name: 'Компот ягодный', count: 1, price: 1.00 },
        ],
      },
      {
        id: 'ЧЕК-2026-8004',
        date: '02.07.2026',
        time: '12:35',
        items: [
          { name: 'Борщ со сметаной', count: 1, price: 4.80 },
          { name: 'Биточек мясной', count: 1, price: 4.70 },
          { name: 'Макароны отварные', count: 1, price: 1.40 },
          { name: 'Напиток яблочный', count: 1, price: 0.90 },
          { name: 'Хлеб ржаной (2 кус.)', count: 1, price: 0.60 },
        ],
      },
    ],
    salaryServices: [],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Июль 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '710 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '12.4 ГБ',
      overlimitInternet: '0 ГБ (в пределах пакета)',
      overlimitAmount: 0.00,
    },
  },
  '2026-06': {
    periodId: '2026-06',
    periodLabel: 'Июнь 2026',
    canteenReceipts: [
      {
        id: 'ЧЕК-2026-7810',
        date: '22.06.2026',
        time: '12:45',
        items: [
          { name: 'Суп куриный с вермишелью', count: 1, price: 4.10 },
          { name: 'Котлета мясная «По-волковысски»', count: 1, price: 4.90 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот из лесных ягод', count: 1, price: 1.20 },
        ],
      },
      {
        id: 'ЧЕК-2026-7602',
        date: '16.06.2026',
        time: '13:00',
        items: [
          { name: 'Борщ с говядиной', count: 1, price: 4.80 },
          { name: 'Тефтели мясные в томатном соусе', count: 1, price: 4.80 },
          { name: 'Каша гречневая', count: 1, price: 1.40 },
          { name: 'Салат из капусты', count: 1, price: 1.20 },
        ],
      },
      {
        id: 'ЧЕК-2026-7391',
        date: '10.06.2026',
        time: '12:35',
        items: [
          { name: 'Солянка мясная сборная', count: 1, price: 5.40 },
          { name: 'Оладьи из печени', count: 1, price: 4.60 },
          { name: 'Чай с лимоном', count: 1, price: 1.50 },
        ],
      },
      {
        id: 'ЧЕК-2026-7120',
        date: '04.06.2026',
        time: '12:40',
        items: [
          { name: 'Уха из речной рыбы', count: 1, price: 4.30 },
          { name: 'Филе минтая запеченное', count: 1, price: 4.90 },
          { name: 'Рис припущенный с маслом', count: 1, price: 1.50 },
          { name: 'Сок яблочный', count: 1, price: 1.20 },
        ],
      },
    ],
    salaryServices: [],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Июнь 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '690 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '13.1 ГБ',
      overlimitInternet: '0 ГБ (в пределах пакета)',
      overlimitAmount: 0.00,
    },
  },
  '2026-05': {
    periodId: '2026-05',
    periodLabel: 'Май 2026',
    canteenReceipts: [
      {
        id: 'ЧЕК-2026-6912',
        date: '26.05.2026',
        time: '12:40',
        items: [
          { name: 'Борщ со сметаной', count: 1, price: 4.80 },
          { name: 'Котлета домашняя', count: 1, price: 5.00 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот', count: 1, price: 1.10 },
        ],
      },
      {
        id: 'ЧЕК-2026-6701',
        date: '20.05.2026',
        time: '13:00',
        items: [
          { name: 'Солянка сборная', count: 1, price: 5.40 },
          { name: 'Поджарка из свинины', count: 1, price: 5.90 },
          { name: 'Гречка отварная', count: 1, price: 1.40 },
          { name: 'Чай с лимоном', count: 1, price: 1.30 },
        ],
      },
      {
        id: 'ЧЕК-2026-6410',
        date: '14.05.2026',
        time: '12:35',
        items: [
          { name: 'Суп с клецками', count: 1, price: 4.20 },
          { name: 'Рыба под маринадом', count: 1, price: 5.30 },
          { name: 'Рис отварной', count: 1, price: 1.50 },
          { name: 'Салат весенний', count: 1, price: 1.50 },
        ],
      },
      {
        id: 'ЧЕК-2026-6180',
        date: '06.05.2026',
        time: '12:50',
        items: [
          { name: 'Щи со свежей зеленью', count: 1, price: 4.20 },
          { name: 'Шницель натуральный', count: 1, price: 5.60 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот из ягод', count: 1, price: 1.60 },
        ],
      },
    ],
    salaryServices: [],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Май 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '650 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '11.8 ГБ',
      overlimitInternet: '0 ГБ (в пределах пакета)',
      overlimitAmount: 0.00,
    },
  },
  '2026-04': {
    periodId: '2026-04',
    periodLabel: 'Апрель 2026',
    canteenReceipts: [
      {
        id: 'ЧЕК-2026-5801',
        date: '23.04.2026',
        time: '12:40',
        items: [
          { name: 'Борщ со сметаной', count: 1, price: 4.80 },
          { name: 'Котлета мясная', count: 1, price: 4.90 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот ягодный', count: 1, price: 1.20 },
        ],
      },
      {
        id: 'ЧЕК-2026-5590',
        date: '17.04.2026',
        time: '13:00',
        items: [
          { name: 'Солянка сборная', count: 1, price: 5.40 },
          { name: 'Гуляш говяжий', count: 1, price: 5.80 },
          { name: 'Гречка с маслом', count: 1, price: 1.40 },
          { name: 'Морс', count: 1, price: 1.40 },
        ],
      },
      {
        id: 'ЧЕК-2026-5321',
        date: '10.04.2026',
        time: '12:35',
        items: [
          { name: 'Суп гороховый', count: 1, price: 4.10 },
          { name: 'Филе хека жареное', count: 1, price: 5.20 },
          { name: 'Рис с овощами', count: 1, price: 1.50 },
          { name: 'Салат из моркови', count: 1, price: 1.70 },
        ],
      },
      {
        id: 'ЧЕК-2026-5080',
        date: '03.04.2026',
        time: '12:50',
        items: [
          { name: 'Суп лапша куриная', count: 1, price: 4.10 },
          { name: 'Биточек по-селянски', count: 1, price: 4.80 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Напиток ягодный', count: 1, price: 1.50 },
          { name: 'Хлеб (2 кус.)', count: 1, price: 1.00 },
        ],
      },
    ],
    salaryServices: [],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Апрель 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '620 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '12.0 ГБ',
      overlimitInternet: '0 ГБ (в пределах пакета)',
      overlimitAmount: 0.00,
    },
  },
  '2026-03': {
    periodId: '2026-03',
    periodLabel: 'Март 2026',
    canteenReceipts: [
      {
        id: 'ЧЕК-2026-4801',
        date: '25.03.2026',
        time: '12:45',
        items: [
          { name: 'Борщ с говядиной', count: 1, price: 4.80 },
          { name: 'Котлета мясная', count: 1, price: 4.90 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот', count: 1, price: 1.20 },
        ],
      },
      {
        id: 'ЧЕК-2026-4550',
        date: '19.03.2026',
        time: '13:00',
        items: [
          { name: 'Солянка сборная', count: 1, price: 5.40 },
          { name: 'Тефтели мясные', count: 1, price: 4.80 },
          { name: 'Гречка с маслом', count: 1, price: 1.40 },
          { name: 'Салат витаминный', count: 1, price: 1.40 },
        ],
      },
      {
        id: 'ЧЕК-2026-4310',
        date: '12.03.2026',
        time: '12:30',
        items: [
          { name: 'Суп с фрикадельками', count: 1, price: 4.30 },
          { name: 'Рыба запеченная', count: 1, price: 5.10 },
          { name: 'Рис припущенный', count: 1, price: 1.50 },
          { name: 'Чай сладкий', count: 1, price: 1.60 },
        ],
      },
      {
        id: 'ЧЕК-2026-4090',
        date: '05.03.2026',
        time: '12:55',
        items: [
          { name: 'Щи из свежей капусты', count: 1, price: 4.20 },
          { name: 'Шницель мясной', count: 1, price: 5.50 },
          { name: 'Пюре картофельное', count: 1, price: 1.60 },
          { name: 'Компот из ягод', count: 1, price: 1.70 },
        ],
      },
    ],
    salaryServices: [],
    telecom: {
      phone: '+375 (29) 782-45-12',
      plan: 'УП «А1» – Корпоративный безлимит ОАО «Беллакт»',
      period: 'Март 2026',
      includedMinutes: '3000 мин во все сети РБ',
      usedMinutes: '605 мин',
      includedInternet: '15 ГБ на неограниченной скорости',
      usedInternet: '10.9 ГБ',
      overlimitInternet: '0 ГБ (в пределах пакета)',
      overlimitAmount: 0.00,
    },
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

export default function Services() {
  const [periodIndex, setPeriodIndex] = useState(0); // 0 = 2026-08 (latest)
  const [activeTab, setActiveTab] = useState<'canteen' | 'salary' | 'telecom'>('canteen');

  const currentPeriod = PERIODS[periodIndex] || PERIODS[0];
  const currentData =
    MONTH_DATA_RECORDS[currentPeriod.id] || MONTH_DATA_RECORDS['2026-08'];

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

  const handleTabChange = (tab: 'canteen' | 'salary' | 'telecom') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Calculate each receipt total dynamically
  const receiptsWithCalculatedTotal = currentData.canteenReceipts.map((receipt) => {
    const total = receipt.items.reduce((sum, item) => sum + item.price * item.count, 0);
    return {
      ...receipt,
      total,
    };
  });

  // 2. Calculate totals dynamically for the plaques
  const totalCanteen = receiptsWithCalculatedTotal.reduce((sum, r) => sum + r.total, 0);
  const totalSalaryServices = currentData.salaryServices.reduce(
    (sum, s) => sum + s.employeePrice,
    0
  );
  const totalTelecom = currentData.telecom.overlimitAmount;
  const totalMonthDeductions = totalCanteen + totalSalaryServices + totalTelecom;

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 pb-10">
      {/* Top Header with Back Button, Title and < Месяц > Arrow Switcher */}
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
            Оказанные услуги
          </h1>
        </div>

        {/* Right controls: < Месяц Год > Switcher and Export button */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2">
          {/* < Месяц > Arrow Switcher (Identical to Payslip) */}
          <div className="h-10 sm:h-11 flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-1">
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
            <span className="px-3 sm:px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white min-w-[110px] sm:min-w-[125px] text-center select-none">
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

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success(`Сводная ведомость по услугам за ${currentData.periodLabel} сформирована (PDF)`)
            }
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-10 sm:h-11 px-4 text-xs sm:text-sm font-bold shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#002B7F] dark:text-blue-400 stroke-[2.2px]" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Summary Row: 4 cards for Total + 3 categories (Icon, Title, Amount as header size, NO subtexts below) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. ВСЕГО УДЕРЖАНО */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0 border border-transparent dark:border-blue-800/40">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
              Всего удержано
            </div>
            <div className="text-base sm:text-lg font-bold text-[#002B7F] dark:text-[#60A5FA] tracking-tight">
              {totalMonthDeductions.toFixed(2)} руб.
            </div>
          </div>
        </div>

        {/* 2. СУММА ОБЕДОВ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/40">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
              Сумма обедов
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {totalCanteen.toFixed(2)} руб.
            </div>
          </div>
        </div>

        {/* 3. УСЛУГИ В СЧЁТ ЗП */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
            <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
              Услуги в счёт ЗП
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {totalSalaryServices.toFixed(2)} руб.
            </div>
          </div>
        </div>

        {/* 4. УСЛУГИ СВЯЗИ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/40">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
              Услуги связи
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {totalTelecom.toFixed(2)} руб.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons: Clean, responsive, NO numbers, NO scroll panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleTabChange('canteen')}
          className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer border ${
            activeTab === 'canteen'
              ? 'bg-[#002B7F] border-[#002B7F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Чеки столовой
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('salary')}
          className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer border ${
            activeTab === 'salary'
              ? 'bg-[#002B7F] border-[#002B7F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Услуги в счёт ЗП
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('telecom')}
          className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer border ${
            activeTab === 'telecom'
              ? 'bg-[#002B7F] border-[#002B7F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Услуги связи
        </button>
      </div>

      {/* Tab 1: Чеки столовой (Icons inside receipts removed, clean layout) */}
      {activeTab === 'canteen' && (
        <div className="space-y-3">
          {receiptsWithCalculatedTotal.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
              В выбранном месяце чеков в столовой предприятия не найдено.
            </div>
          ) : (
            receiptsWithCalculatedTotal.map((receipt) => (
              <div
                key={receipt.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 transition-all"
              >
                {/* Header: without icon, clean text */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {receipt.id}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      • {receipt.date} в {receipt.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Сумма чека:
                    </span>
                    <span className="font-bold text-base text-[#002B7F] dark:text-blue-400">
                      {receipt.total.toFixed(2)} руб.
                    </span>
                  </div>
                </div>

                {/* Items breakdown */}
                <div className="space-y-1.5 text-xs sm:text-sm">
                  {receipt.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.name}{' '}
                        <span className="text-slate-500 font-normal">× {item.count}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                        {(item.price * item.count).toFixed(2)} руб.
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: without icons */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">
                    Оплачено электронным талоном (удержание из зарплаты)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Касса №1 • Столовая ОАО «Беллакт»
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Услуги в счёт ЗП */}
      {activeTab === 'salary' && (
        <div className="space-y-3">
          {currentData.salaryServices.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
              В выбранном месяце дополнительных услуг в счёт зарплаты не зарегистрировано.
            </div>
          ) : (
            currentData.salaryServices.map((srv, idx) => {
              if (srv.type === 'fok') {
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {srv.title}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                          • {srv.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          К удержанию:
                        </span>
                        <span className="font-bold text-base text-[#002B7F] dark:text-blue-400">
                          {srv.employeePrice.toFixed(2)} руб.
                        </span>
                      </div>
                    </div>

                    {/* Footer like other similar services */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">
                        Удержано из заработной платы
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {srv.provider || 'ФОК г. Волковыск'}
                      </span>
                    </div>
                  </div>
                );
              }

              // Voucher (санаторно-оздоровительная путевка)
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 transition-all"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <div>
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {srv.title}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                        • {srv.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        К удержанию (20%):
                      </span>
                      <span className="font-bold text-base text-[#002B7F] dark:text-blue-400">
                        {srv.employeePrice.toFixed(2)} руб.
                      </span>
                    </div>
                  </div>

                  {/* Items breakdown */}
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Полная стоимость путевки
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                        {(srv.fullPrice ?? 0).toFixed(2)} руб.
                      </span>
                    </div>

                    {(srv.subsidy ?? 0) > 0 && (
                      <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                        <span className="font-medium">
                          Покрывает предприятие ОАО «Беллакт» (80%)
                        </span>
                        <span className="font-bold shrink-0 ml-2">
                          −{(srv.subsidy ?? 0).toFixed(2)} руб.
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Сумма к списанию из заработной платы (доля работника 20%)
                      </span>
                      <span className="font-bold text-[#002B7F] dark:text-blue-400 shrink-0 ml-2">
                        {srv.employeePrice.toFixed(2)} руб.
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">
                      Удержано из заработной платы (доля работника 20%)
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {srv.provider || 'Санаторий • Профком ОАО «Беллакт»'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Услуги связи (Оформлено в соответствии с услугами в счёт ЗП) */}
      {activeTab === 'telecom' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 transition-all">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div>
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Корпоративная мобильная связь
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  • {currentData.telecom.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  К удержанию:
                </span>
                <span className="font-bold text-base text-[#002B7F] dark:text-blue-400">
                  {currentData.telecom.overlimitAmount.toFixed(2)} руб.
                </span>
              </div>
            </div>

            {/* Items breakdown in accordance with salary services */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Тарифный план «{currentData.telecom.plan}» ({currentData.telecom.includedMinutes}, {currentData.telecom.includedInternet})
                </span>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                  25.00 руб.
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                <span className="font-medium">
                  Корпоративный лимит ОАО «Беллакт» (компенсация предприятия)
                </span>
                <span className="font-bold shrink-0 ml-2">
                  −25.00 руб.
                </span>
              </div>

              {currentData.telecom.overlimitAmount > 0 ? (
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Сумма к списанию из заработной платы ({currentData.telecom.overlimitInternet})
                  </span>
                  <span className="font-bold text-[#002B7F] dark:text-blue-400 shrink-0 ml-2">
                    {currentData.telecom.overlimitAmount.toFixed(2)} руб.
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Сумма к списанию из заработной платы (в пределах лимита)
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                    0.00 руб.
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">
                {currentData.telecom.overlimitAmount > 0
                  ? 'Удержано из заработной платы'
                  : '100% компенсировано предприятием'}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                УП «А1» • Корпоративный договор ОАО «Беллакт»
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
