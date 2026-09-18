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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  Receipt,
  Download,
  Mail,
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';

interface PeriodData {
  periodLabel: string;
  accrued: number;
  deducted: number;
  toPay: number;
  accruals: { name: string; amount: number; description?: string }[];
  deductions: { name: string; amount: number; description?: string }[];
}

const PAYSLIP_RECORDS: Record<string, PeriodData> = {
  '2026-08': {
    periodLabel: 'Август 2026',
    accrued: 2150.00,
    deducted: 538.90,
    toPay: 1611.10,
    accruals: [
      { name: 'Оклад по часам и тарифной ставке', amount: 920.00, description: '168 раб. часов' },
      { name: 'Премия за качество и выполнение плана (30%)', amount: 276.00, description: 'По приказу №142' },
      { name: 'Надбавка за выслугу лет (15%)', amount: 138.00, description: 'Стаж более 5 лет' },
      { name: 'Доплата за работу в ночные смены', amount: 116.00, description: '32 ночных часа' },
      { name: 'Контрактная надбавка за сложность', amount: 500.00, description: 'Условия контракта' },
      { name: 'Материальная помощь к оздоровлению', amount: 200.00, description: 'Коллективный договор' },
    ],
    deductions: [
      { name: 'Подоходный налог (13%)', amount: 279.50, description: 'В бюджет РБ' },
      { name: 'Пенсионный взнос в ФСЗН (1%)', amount: 21.50, description: 'Фонд соц. защиты' },
      { name: 'Профсоюзный взнос (1%)', amount: 21.50, description: 'Профком ОАО «Беллакт»' },
      { name: 'Питание в столовой предприятия', amount: 57.00, description: 'Списание по электронному талону' },
      { name: 'Услуги ФОК «Волна»', amount: 25.00, description: 'Льготный абонемент бассейн' },
      { name: 'Мобильная связь сверх лимита', amount: 3.40, description: 'Корпоративный тариф А1' },
      { name: 'Выплаченный плановый аванс', amount: 131.00, description: 'Выплачен 15.08.2026' },
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
      { name: 'Питание в столовой', amount: 64.20 },
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
      { name: 'Питание в столовой', amount: 47.40 },
      { name: 'Выплаченный аванс', amount: 150.00 },
    ],
  },
};

export default function Payslip() {
  const { employeeData } = useAuthStore();
  const [period, setPeriod] = useState('2026-08');

  const currentData = PAYSLIP_RECORDS[period] || PAYSLIP_RECORDS['2026-08'];

  const handleDownload = () => {
    toast.success(`Расчетный лист за ${currentData.periodLabel} сформирован и загружен (PDF)`);
  };

  const handleSendEmail = () => {
    toast.success(`Расчетный лист за ${currentData.periodLabel} отправлен на корпоративный email: ${employeeData?.email || 'ivanov@bellakt.com'}`);
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header */}
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
              Расчётный лист
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Начисления и удержания за выбранный период
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <Calendar className="w-4 h-4 text-[#002B7F] dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Период:</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
              <SelectValue placeholder="Выберите месяц" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              <SelectItem value="2026-08">Август 2026</SelectItem>
              <SelectItem value="2026-07">Июль 2026</SelectItem>
              <SelectItem value="2026-06">Июнь 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee Info Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm shadow-2xs">
        <div>
          <span className="text-slate-600 dark:text-slate-400">Сотрудник: </span>
          <strong className="text-slate-900 dark:text-white font-semibold">{employeeData?.full_name || 'Иванов Иван Иванович'}</strong>
          <span className="text-slate-600 dark:text-slate-400 ml-2">• Таб. №: </span>
          <strong className="font-mono text-slate-900 dark:text-white font-bold">{employeeData?.tab_number || '20481'}</strong>
        </div>
        <div>
          <span className="text-slate-600 dark:text-slate-400">Должность: </span>
          <strong className="text-slate-900 dark:text-white font-semibold">{employeeData?.position || 'Инженер-технолог'}</strong>
        </div>
      </div>

      {/* Main Total Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6">
        {/* 1. To Pay */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              К выдаче на карту
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#002B7F] dark:text-blue-400 mt-1.5">
              {currentData.toPay.toFixed(2)} <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">руб.</span>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ОАО «АСБ Беларусбанк»
            </span>
          </CardContent>
        </Card>

        {/* 2. Total Accrued */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Всего начислено
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              +{currentData.accrued.toFixed(2)} <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">руб.</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Оклад, премии, ночные, надбавки
            </span>
          </CardContent>
        </Card>

        {/* 3. Total Deducted */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Всего удержано
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-200 mt-1.5">
              -{currentData.deducted.toFixed(2)} <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">руб.</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Налоги 13%, ФСЗН 1%, профсоюз, столовая, аванс
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Details columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Accruals List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Начисления ({currentData.accruals.length})
            </h3>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              +{currentData.accrued.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            {currentData.accruals.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs sm:text-sm pt-2 first:pt-0">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                  )}
                </div>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                  +{item.amount.toFixed(2)} руб.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Удержания ({currentData.deductions.length})
            </h3>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              -{currentData.deducted.toFixed(2)} руб.
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            {currentData.deductions.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs sm:text-sm pt-2 first:pt-0">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                  )}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                  -{item.amount.toFixed(2)} руб.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons: PDF Download + Email */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button
          className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white h-11 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer px-6"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4 stroke-[2.2px]" />
          Скачать расчетный лист (PDF)
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-11 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer px-6"
          onClick={handleSendEmail}
        >
          <Mail className="mr-2 h-4 w-4 text-[#002B7F] dark:text-blue-400" />
          Отправить на email
        </Button>
      </div>
    </div>
  );
}
