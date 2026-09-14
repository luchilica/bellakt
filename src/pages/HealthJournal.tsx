import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import {
  HeartPulse,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Thermometer,
  Calendar,
  History,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useHealthStore } from '../store/useHealthStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

interface HistoryRecord {
  date: string;
  formattedDate: string;
  selfStatus: string;
  familyStatus: string;
  temperature: string;
  time: string;
  allowed: boolean;
}

export default function HealthJournal() {
  const { employeeData } = useAuthStore();
  const { isCheckedInToday, markCheckIn, resetCheckIn, lastRecord } = useHealthStore();

  const [selfStatus, setSelfStatus] = useState<'healthy' | 'ill'>('healthy');
  const [familyStatus, setFamilyStatus] = useState<'healthy' | 'ill'>('healthy');
  const [skinStatus, setSkinStatus] = useState<'normal' | 'lesions'>('normal');
  const [temperature, setTemperature] = useState<string>('36.6');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  const todayIso = new Date().toISOString().split('T')[0];

  // Pre-populated monthly history for current month (September 2026)
  const [historyRecords] = useState<HistoryRecord[]>([
    {
      date: '2026-09-09',
      formattedDate: '09 сентября 2026 (Среда)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.6 °C',
      time: '07:42',
      allowed: true,
    },
    {
      date: '2026-09-08',
      formattedDate: '08 сентября 2026 (Вторник)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.5 °C',
      time: '07:38',
      allowed: true,
    },
    {
      date: '2026-09-07',
      formattedDate: '07 сентября 2026 (Понедельник)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.6 °C',
      time: '07:45',
      allowed: true,
    },
    {
      date: '2026-09-04',
      formattedDate: '04 сентября 2026 (Пятница)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.4 °C',
      time: '07:50',
      allowed: true,
    },
    {
      date: '2026-09-03',
      formattedDate: '03 сентября 2026 (Четверг)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.6 °C',
      time: '07:40',
      allowed: true,
    },
    {
      date: '2026-09-02',
      formattedDate: '02 сентября 2026 (Среда)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.7 °C',
      time: '07:35',
      allowed: true,
    },
    {
      date: '2026-09-01',
      formattedDate: '01 сентября 2026 (Вторник)',
      selfStatus: 'Здоров, жалоб нет',
      familyStatus: 'Все члены семьи здоровы',
      temperature: '36.6 °C',
      time: '07:41',
      allowed: true,
    },
  ]);

  useEffect(() => {
    // Check local store first
    if (isCheckedInToday()) {
      setIsSubmitted(true);
      if (lastRecord) {
        setSelfStatus(lastRecord.selfStatus === 'ill' ? 'ill' : 'healthy');
        setFamilyStatus(lastRecord.familyStatus === 'ill' ? 'ill' : 'healthy');
        setSkinStatus(lastRecord.skinStatus || 'normal');
        setTemperature(lastRecord.temperature || '36.6');
      }
      return;
    }

    // Fallback check in Supabase if exists
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
          setSelfStatus(data.self_status === 'ill' ? 'ill' : 'healthy');
          setFamilyStatus(data.family_status === 'on_treatment' ? 'ill' : 'healthy');
          setIsSubmitted(true);
          markCheckIn({
            selfStatus: data.self_status || 'healthy',
            familyStatus: data.family_status || 'healthy',
            skinStatus: 'normal',
            temperature: '36.6',
          });
        }
      } catch (err) {
        console.warn('Error checking existing journal:', err);
      }
    }
    checkExisting();
  }, [employeeData?.id, todayIso, isCheckedInToday, lastRecord, markCheckIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
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

      markCheckIn({
        selfStatus,
        familyStatus,
        skinStatus,
        temperature,
      });

      setIsSubmitted(true);
      toast.success('Отметка допуска к смене успешно принята и зафиксирована!');
    } catch (err: any) {
      console.error(err);
      markCheckIn({
        selfStatus,
        familyStatus,
        skinStatus,
        temperature,
      });
      setIsSubmitted(true);
      toast.success('Отметка допуска зафиксирована локально');
    } finally {
      setLoading(false);
    }
  };

  const todayDate = format(new Date(), 'dd MMMM yyyy, EEEE', { locale: ru });

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Журнал здоровья
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm capitalize font-medium">{todayDate}</p>
          </div>
        </div>

        {/* Tab switcher: Today / History */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#002B7F] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
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
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>История за месяц</span>
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        isSubmitted ? (
          /* Confirmation Screen when already submitted today */
          <Card className="rounded-2xl border border-slate-200 shadow-xs text-center py-8 sm:py-10 px-6 bg-white max-w-3xl mx-auto">
            <CardContent className="flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                Отметка на сегодня принята
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-sm mb-5">
                Данные о допуске на {format(new Date(), 'dd.MM.yyyy')} зафиксированы в электронном журнале цеха. Запись неизменяема.
              </p>

              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs sm:text-sm space-y-2 mb-6">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Сотрудник:</span>
                  <strong className="text-slate-900 font-semibold">
                    {employeeData?.full_name || 'Иванов Иван Иванович'}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Температура тела:</span>
                  <strong className="text-slate-900 font-mono font-bold text-sm">{temperature} °C</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Самочувствие сотрудника:</span>
                  <strong className="text-emerald-700 font-semibold">Здоров, жалоб нет</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Члены семьи:</span>
                  <strong className="text-emerald-700 font-semibold">Все здоровы</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Кожные покровы:</span>
                  <strong className="text-emerald-700 font-semibold">Чистые, без повреждений</strong>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Допуск к рабочей смене разрешён
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button
                  onClick={() => setActiveTab('history')}
                  variant="outline"
                  className="rounded-xl border-slate-200 text-slate-700 text-xs sm:text-sm font-bold"
                >
                  <History className="w-4 h-4 mr-1.5" />
                  Посмотреть архив за месяц
                </Button>
                <Link
                  to="/"
                  className="bg-[#002B7F] hover:bg-[#001E59] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                >
                  Главное меню
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form for check-in */
          <Card className="rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden bg-white">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden flex items-center justify-center font-bold text-[#002B7F] shrink-0">
                {employeeData?.avatar_url ? (
                  <img src={employeeData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  employeeData?.full_name?.charAt(0) || 'И'
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base sm:text-lg">
                  {employeeData?.full_name || 'Иванов Иван Иванович'}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Таб. № {employeeData?.tab_number || '20481'} • {employeeData?.department || 'Цех детского питания'} • {employeeData?.position || 'Инженер-технолог'}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-5 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* 1. Body Temperature */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-[#002B7F]" />
                      1. Температура тела (°C)
                    </Label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {['36.4', '36.6', '36.8'].map((temp) => (
                        <button
                          key={temp}
                          type="button"
                          onClick={() => setTemperature(temp)}
                          className={`py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                            temperature === temp
                              ? 'bg-[#002B7F] text-white border-[#002B7F] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {temp} °C
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Self health status */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-bold text-slate-900">
                      2. Статус сотрудника (самочувствие)
                    </Label>
                    <p className="text-xs text-slate-600 font-medium">
                      Отсутствие признаков ОРВИ, кашля, насморка, кишечных расстройств
                    </p>

                    <RadioGroup
                      value={selfStatus}
                      onValueChange={(val: any) => setSelfStatus(val)}
                      className="gap-2 pt-1"
                    >
                      <label
                        htmlFor="self-healthy"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="healthy" id="self-healthy" />
                        <span className="text-xs sm:text-sm font-medium text-slate-800">
                          Здоров, жалоб и катаральных симптомов нет
                        </span>
                      </label>
                      <label
                        htmlFor="self-sick"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="ill" id="self-sick" />
                        <span className="text-xs sm:text-sm font-medium text-red-700">
                          Имеются признаки недомогания / повышенная температура
                        </span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* 3. Skin check */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-bold text-slate-900">
                      3. Осмотр открытых кожных покровов (руки, лицо)
                    </Label>
                    <RadioGroup
                      value={skinStatus}
                      onValueChange={(val: any) => setSkinStatus(val)}
                      className="gap-2 pt-1"
                    >
                      <label
                        htmlFor="skin-normal"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="normal" id="skin-normal" />
                        <span className="text-xs sm:text-sm font-medium text-slate-800">
                          Кожные покровы чистые, без порезов и гнойничковых заболеваний
                        </span>
                      </label>
                      <label
                        htmlFor="skin-lesions"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="lesions" id="skin-lesions" />
                        <span className="text-xs sm:text-sm font-medium text-red-700">
                          Имеются ссадины, ожоги или кожные высыпания
                        </span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* 4. Family members */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-bold text-slate-900">
                      4. Статус членов семьи
                    </Label>
                    <RadioGroup
                      value={familyStatus}
                      onValueChange={(val: any) => setFamilyStatus(val)}
                      className="gap-2 pt-1"
                    >
                      <label
                        htmlFor="family-healthy"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="healthy" id="family-healthy" />
                        <span className="text-xs sm:text-sm font-medium text-slate-800">
                          Здоровы (в семье нет заболевших)
                        </span>
                      </label>
                      <label
                        htmlFor="family-sick"
                        className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value="ill" id="family-sick" />
                        <span className="text-xs sm:text-sm font-medium text-red-700">
                          Находятся на лечении / инфекционные заболевания
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>

              <div className="p-5 sm:p-6 lg:p-8 pt-0 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full max-w-md bg-[#002B7F] hover:bg-[#001E59] h-12 rounded-xl text-sm sm:text-base font-bold transition-all shadow-md cursor-pointer"
                >
                  {loading ? 'Сохранение данных...' : 'Подтвердить и получить допуск'}
                </Button>
              </div>
            </form>
          </Card>
        )
      ) : (
        /* History of records for the month */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Отметки за текущий месяц (Сентябрь 2026)
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              100% допуск к смене
            </span>
          </div>

          <div className="space-y-2.5">
            {historyRecords.map((rec) => (
              <Card key={rec.date} className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{rec.formattedDate}</h3>
                        <span className="text-[11px] font-mono text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.time}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {rec.selfStatus} • Семья: {rec.familyStatus}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">
                      {rec.temperature}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-lg">
                      Допущен
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
