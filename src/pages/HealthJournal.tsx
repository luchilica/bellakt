import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import {
  CheckCircle2,
  ArrowLeft,
  History,
  Clock,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Search,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useHealthStore, formatRuDate, HealthHistoryItem } from '../store/useHealthStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function HealthJournal() {
  const { employeeData } = useAuthStore();
  const { isCheckedInToday, markCheckIn, resetCheckIn, lastRecord, history, setHistory } = useHealthStore();

  const [selfStatus, setSelfStatus] = useState<'healthy' | 'ill'>('healthy');
  const [familyStatus, setFamilyStatus] = useState<'healthy' | 'ill'>('healthy');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastAllowed, setLastAllowed] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  // History filtering states
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [searchDate, setSearchDate] = useState<string>('');

  const todayIso = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check local store first
    if (isCheckedInToday()) {
      setIsSubmitted(true);
      if (lastRecord) {
        setSelfStatus(lastRecord.selfStatus === 'ill' ? 'ill' : 'healthy');
        setFamilyStatus(lastRecord.familyStatus === 'ill' ? 'ill' : 'healthy');
        setLastAllowed(lastRecord.selfStatus === 'healthy');
      }
      return;
    }

    // Fallback check in Supabase for today's record
    async function checkExisting() {
      if (!employeeData?.id) return;
      try {
        const { data } = await supabase
          .from('health_journals')
          .select('*')
          .eq('employee_id', employeeData.id)
          .eq('date', todayIso)
          .maybeSingle();

        if (data) {
          const isHealthy = data.self_status !== 'ill';
          setSelfStatus(data.self_status === 'ill' ? 'ill' : 'healthy');
          setFamilyStatus(data.family_status === 'on_treatment' ? 'ill' : 'healthy');
          setLastAllowed(isHealthy);
          setIsSubmitted(true);
          markCheckIn({
            selfStatus: data.self_status === 'ill' ? 'ill' : 'healthy',
            familyStatus: data.family_status === 'on_treatment' ? 'ill' : 'healthy',
            allowed: isHealthy,
          });
        }
      } catch (err) {
        console.warn('Error checking existing journal:', err);
      }
    }
    checkExisting();
  }, [employeeData?.id, todayIso, isCheckedInToday, lastRecord, markCheckIn]);

  // Load server-side history records and sync with local history
  useEffect(() => {
    async function syncSupabaseHistory() {
      if (!employeeData?.id) return;
      try {
        const { data } = await supabase
          .from('health_journals')
          .select('*')
          .eq('employee_id', employeeData.id)
          .order('date', { ascending: false });

        if (data && data.length > 0) {
          const dbItems: HealthHistoryItem[] = data.map((d) => {
            const isHealthy = d.self_status !== 'ill';
            const time = d.confirmed_at
              ? new Date(d.confirmed_at).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '08:00';
            return {
              id: `db-${d.id || d.date}`,
              date: d.date,
              formattedDate: formatRuDate(d.date),
              time,
              selfStatus: d.self_status === 'ill' ? 'ill' : 'healthy',
              familyStatus: d.family_status === 'on_treatment' ? 'ill' : 'healthy',
              allowed: isHealthy,
            };
          });

          // Merge keeping local items
          const currentHistory = useHealthStore.getState().history || [];
          const map = new Map<string, HealthHistoryItem>();
          currentHistory.forEach((item) => map.set(item.date, item));
          dbItems.forEach((item) => map.set(item.date, item));

          const merged = Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
          setHistory(merged);
        }
      } catch (err) {
        console.warn('Could not sync Supabase history:', err);
      }
    }
    syncSupabaseHistory();
  }, [employeeData?.id, setHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    // Логика допуска: если сам сотрудник здоров — он допускается к смене,
    // даже если члены семьи находятся на лечении. Если сам болеет — не допускается.
    const isAllowed = selfStatus === 'healthy';
    setLastAllowed(isAllowed);

    try {
      if (employeeData?.id) {
        await supabase
          .from('health_journals')
          .upsert({
            employee_id: employeeData.id,
            date: todayIso,
            self_status: selfStatus,
            family_status: familyStatus === 'ill' ? 'on_treatment' : 'healthy',
            confirmed_at: new Date().toISOString(),
          });
      }

      // Mark check-in: this immediately updates store state and prepends to history
      markCheckIn({
        selfStatus,
        familyStatus,
        allowed: isAllowed,
      });

      setIsSubmitted(true);
      if (isAllowed) {
        toast.success('Вы здоровы, можете приступать к работе!');
      } else {
        toast.error('Пожалуйста, обратитесь в медицинский пункт предприятия.');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      markCheckIn({
        selfStatus,
        familyStatus,
        allowed: isAllowed,
      });
      setIsSubmitted(true);
      if (isAllowed) {
        toast.success('Вы здоровы, можете приступать к работе');
      } else {
        toast.error('Пожалуйста, обратитесь в медицинский пункт');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetCheckIn();
    setIsSubmitted(false);
    setSelfStatus('healthy');
    setFamilyStatus('healthy');
    setLastAllowed(true);
    toast.info('Форма сброшена. Вы можете заполнить отметку заново.');
  };

  // Filter history records based on selected month and exact date search
  const filteredHistory = useMemo(() => {
    const list = history || [];
    return list.filter((item) => {
      if (searchDate) {
        return item.date === searchDate;
      }
      if (selectedMonth !== 'all') {
        return item.date.startsWith(selectedMonth);
      }
      return true;
    });
  }, [history, selectedMonth, searchDate]);

  const getMonthDisplayName = (monthIso: string) => {
    if (monthIso === '2026-09') return 'Сентябрь 2026';
    if (monthIso === '2026-08') return 'Август 2026';
    if (monthIso === '2026-07') return 'Июль 2026';
    const parts = monthIso.split('-');
    if (parts.length >= 2) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      const name = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return monthIso;
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
              Журнал здоровья
            </h1>
          </div>
        </div>

        {/* Tab switcher: Today / History */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#002B7F] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Отметка на сегодня</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#002B7F] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>История за месяц</span>
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        isSubmitted ? (
          /* Confirmation Screen with Green/Red result banner */
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-center py-8 sm:py-10 px-6 bg-white dark:bg-slate-900 max-w-3xl mx-auto">
            <CardContent className="flex flex-col items-center">
              {lastAllowed ? (
                /* GREEN BANNER: Вы здоровы, можете приступать к работе */
                <div className="w-full mb-6">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-emerald-50 dark:ring-emerald-900/30 mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="bg-emerald-500 text-white dark:bg-emerald-600 rounded-2xl p-4 sm:p-5 shadow-sm text-center">
                    <div className="flex items-center justify-center text-base sm:text-lg font-bold">
                      <span>Вы здоровы, можете приступать к работе</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-50 mt-1 font-medium">
                      Допуск к рабочей смене на {format(new Date(), 'dd.MM.yyyy')} успешно зафиксирован в журнале цеха
                    </p>
                  </div>
                </div>
              ) : (
                /* RED BANNER: Просьба обратиться в мед пункт */
                <div className="w-full mb-6">
                  <div className="h-16 w-16 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-900/30 mx-auto">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="bg-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm text-center">
                    <div className="flex items-center justify-center text-base sm:text-lg font-bold">
                      <span>Пожалуйста, обратитесь в медицинский пункт</span>
                    </div>
                    <p className="text-xs sm:text-sm text-red-100 mt-1 font-medium">
                      Зафиксированы признаки недомогания. Допуск к рабочей смене приостановлен до осмотра дежурным фельдшером предприятия (каб. 102).
                    </p>
                  </div>
                </div>
              )}

              {/* Employee & Status Summary */}
              <div className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs sm:text-sm space-y-3 mb-6">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Сотрудник:</span>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {employeeData?.full_name || 'Иванов Иван Иванович'}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>1. Сотрудник:</span>
                  <strong
                    className={
                      selfStatus === 'healthy'
                        ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'text-red-600 dark:text-red-400 font-semibold'
                    }
                  >
                    {selfStatus === 'healthy' ? 'Здоров' : 'Имеются признаки'}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>2. Члены семьи:</span>
                  <strong
                    className={
                      familyStatus === 'healthy'
                        ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'text-red-600 dark:text-red-400 font-semibold'
                    }
                  >
                    {familyStatus === 'healthy' ? 'Здоровы' : 'Находятся на лечении'}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-center w-full">
                <Button
                  onClick={handleReset}
                  className="h-12 px-8 rounded-xl bg-[#002B7F] hover:bg-[#0B4DA2] text-white text-sm sm:text-base font-bold shadow-xs cursor-pointer transition-colors w-full sm:w-auto min-w-[240px]"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Перезаполнить отметку
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form for check-in */
          <Card className="rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden bg-white dark:bg-slate-900">
            {/* Employee Card - Only Photo & Full Name per user instruction */}
            <div className="bg-slate-50 dark:bg-slate-800/90 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl ring-1 ring-slate-200 dark:ring-slate-600 overflow-hidden flex items-center justify-center font-bold text-[#002B7F] dark:text-[#D6E6F9] shrink-0 shadow-2xs">
                {employeeData?.avatar_url ? (
                  <img src={employeeData.avatar_url} alt="Фото сотрудника" className="w-full h-full object-cover" />
                ) : (
                  employeeData?.full_name?.charAt(0) || 'И'
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {employeeData?.full_name || 'Иванов Иван Иванович'}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-5 sm:p-6 lg:p-8 space-y-6">
                {/* General Section Title requested by user */}
                <div className="bg-[#E8F1FC] dark:bg-[#002B7F]/25 border border-blue-200/80 dark:border-[#0B4DA2]/40 rounded-xl p-4 sm:p-5">
                  <h2 className="text-sm sm:text-base font-bold text-[#002B7F] dark:text-[#D6E6F9] leading-snug">
                    Отметка об отсутствии кишечных, кожных(заразных) и гнойных заболеваний
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                  {/* 1. Сотрудник */}
                  <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 shadow-2xs">
                    <Label className="text-sm font-bold text-slate-900 dark:text-white block">
                      1. Сотрудник
                    </Label>

                    <RadioGroup
                      value={selfStatus}
                      onValueChange={(val: any) => setSelfStatus(val)}
                      className="gap-3 pt-1"
                    >
                      <label
                        htmlFor="self-healthy"
                        className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          selfStatus === 'healthy'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        <RadioGroupItem value="healthy" id="self-healthy" />
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            selfStatus === 'healthy'
                              ? 'text-emerald-950 dark:text-emerald-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Здоров
                        </span>
                      </label>

                      <label
                        htmlFor="self-sick"
                        className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          selfStatus === 'ill'
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/60 ring-2 ring-red-500/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        <RadioGroupItem value="ill" id="self-sick" />
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            selfStatus === 'ill'
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Имеются признаки
                        </span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* 2. Члены семьи */}
                  <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 shadow-2xs">
                    <Label className="text-sm font-bold text-slate-900 dark:text-white block">
                      2. Члены семьи
                    </Label>

                    <RadioGroup
                      value={familyStatus}
                      onValueChange={(val: any) => setFamilyStatus(val)}
                      className="gap-3 pt-1"
                    >
                      <label
                        htmlFor="family-healthy"
                        className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          familyStatus === 'healthy'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        <RadioGroupItem value="healthy" id="family-healthy" />
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            familyStatus === 'healthy'
                              ? 'text-emerald-950 dark:text-emerald-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Здоровы
                        </span>
                      </label>

                      <label
                        htmlFor="family-sick"
                        className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          familyStatus === 'ill'
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/60 ring-2 ring-red-500/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-700/80'
                        }`}
                      >
                        <RadioGroupItem value="ill" id="family-sick" />
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            familyStatus === 'ill'
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Находятся на лечении
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>

              {/* Submit Confirmation Button */}
              <div className="p-5 sm:p-6 lg:p-8 pt-0 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full max-w-md bg-[#002B7F] hover:bg-[#0B4DA2] h-12 rounded-xl text-sm sm:text-base font-bold transition-colors shadow-xs cursor-pointer text-white"
                >
                  {loading ? 'Фиксация отметки...' : 'Подтвердить'}
                </Button>
              </div>
            </form>
          </Card>
        )
      ) : (
        /* History of records for the month with search and prominent cards */
        <div className="space-y-4">
          {/* Controls Header: Month display & Search / Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Период журнала
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white capitalize">
                  {searchDate
                    ? `Поиск: ${formatRuDate(searchDate)}`
                    : selectedMonth === 'all'
                    ? 'Все записи журнала'
                    : getMonthDisplayName(selectedMonth)}
                </h2>
              </div>

              {/* Record counter */}
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
                Записей: <span className="font-bold text-slate-900 dark:text-white">{filteredHistory.length}</span>
              </div>
            </div>

            {/* Filter controls: Month selector + Date input */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Month dropdown */}
              <div className="flex-1 sm:max-w-xs space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#002B7F] dark:text-[#0B4DA2]" />
                  <span>Выбрать месяц:</span>
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSearchDate('');
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#002B7F] cursor-pointer"
                >
                  <option value="2026-09">Сентябрь 2026 (Текущий)</option>
                  <option value="2026-08">Август 2026</option>
                  <option value="2026-07">Июль 2026</option>
                  <option value="all">Все месяцы</option>
                </select>
              </div>

              {/* Specific Date input */}
              <div className="flex-1 sm:max-w-xs space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#002B7F] dark:text-[#0B4DA2]" />
                  <span>Поиск по точной дате:</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#002B7F] cursor-pointer"
                  />
                  {searchDate && (
                    <button
                      type="button"
                      onClick={() => setSearchDate('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Сбросить дату"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reset Filter button */}
              {(searchDate || selectedMonth !== '2026-09') && (
                <div className="sm:self-end pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMonth('2026-09');
                      setSearchDate('');
                    }}
                    className="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить поиск</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Записи за выбранный период не найдены
                </p>
                <button
                  onClick={() => {
                    setSelectedMonth('2026-09');
                    setSearchDate('');
                  }}
                  className="text-xs font-bold text-[#002B7F] hover:text-[#0B4DA2] dark:text-blue-400 underline cursor-pointer"
                >
                  Показать текущий месяц (Сентябрь 2026)
                </button>
              </div>
            ) : (
              filteredHistory.map((rec) => {
                const isRecAllowed = rec.selfStatus === 'healthy';
                return (
                  <div
                    key={rec.id || rec.date}
                    className={cn(
                      'rounded-2xl p-4 sm:p-5 transition-all shadow-xs bg-white dark:bg-slate-900',
                      isRecAllowed
                        ? 'border-2 border-emerald-500'
                        : 'border-2 border-red-500'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left Info: Date, Time, Responses */}
                      <div className="space-y-2.5">
                        {/* Date & Time header */}
                        <div className="flex items-center flex-wrap gap-2.5">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            {formatRuDate(rec.date)}
                          </h3>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            {rec.time}
                          </span>
                        </div>

                        {/* Responses notes */}
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">1. Сотрудник:</span>
                            <strong
                              className={cn(
                                'font-bold',
                                rec.selfStatus === 'healthy'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              )}
                            >
                              {rec.selfStatus === 'healthy' ? 'Здоров' : 'Имеются признаки'}
                            </strong>
                          </div>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">2. Члены семьи:</span>
                            <strong
                              className={cn(
                                'font-bold',
                                rec.familyStatus === 'healthy'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              )}
                            >
                              {rec.familyStatus === 'healthy' ? 'Здоровы' : 'Находятся на лечении'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Large Badge */}
                      <div className="shrink-0 flex items-center justify-start sm:justify-end">
                        {isRecAllowed ? (
                          <div className="px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold uppercase tracking-wider bg-emerald-500 text-white shadow-xs text-center min-w-[130px]">
                            ДОПУЩЕН
                          </div>
                        ) : (
                          <div className="px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-xs text-center min-w-[130px]">
                            НЕ ДОПУЩЕН
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
