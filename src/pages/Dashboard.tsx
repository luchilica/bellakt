import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  X,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  published_at: string;
}

export default function Dashboard() {
  const { employeeData } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'vacancies'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [vacancies, setVacancies] = useState<NewsItem[]>([]);
  const [appliedVacancies, setAppliedVacancies] = useState<Record<string, boolean>>({});

  const handleApplyVacancy = (vacancyTitle: string, vacancyId: string) => {
    setAppliedVacancies((prev) => ({ ...prev, [vacancyId]: true }));
    toast.success(`Отклик на вакансию «${vacancyTitle}» успешно отправлен в отдел кадров завода!`);
  };

  useEffect(() => {
    if (searchParams.get('notifications') === 'open') {
      setIsNotificationsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const { data } = await supabase
          .from('news_vacancies')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (data && data.length > 0) {
          setNews(data.filter((item: NewsItem) => item.type === 'news'));
          setVacancies(data.filter((item: NewsItem) => item.type === 'vacancy'));
        }
      } catch (err) {
        console.warn('Could not load announcements:', err);
      }
    }
    loadAnnouncements();
  }, []);

  const userName = employeeData?.full_name || 'Евгений Бороденя';
  const { isCheckedInToday, lastRecord } = useHealthStore();
  const isCheckedIn = isCheckedInToday();

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 lg:space-y-8 my-auto">
      {/* Greeting Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-slate-900 tracking-tight">
          <span className="font-medium">Здравствуйте, </span>
          <span className="font-bold">{userName}!</span>
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
              ? 'health-alert-pulse bg-gradient-to-r from-red-50/90 via-white to-red-50/90 border-2 border-red-400/80 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]'
              : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200'
          )}
        >
          {/* Subtle red shimmer sweep when not checked in */}
          {!isCheckedIn && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/35 to-transparent health-shimmer-sweep pointer-events-none rounded-2xl lg:rounded-3xl" />
          )}

          <div
            className={cn(
              'w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
              !isCheckedIn
                ? 'bg-red-100 text-red-600 ring-2 ring-red-300/60'
                : 'bg-[#E8F1FC] text-[#0B4DA2]'
            )}
          >
            <HeartPulse className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>

          <div className="flex-1 min-w-0 z-10">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ЖУРНАЛ ЗДОРОВЬЯ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              Просмотр записей и аналитики
            </div>
          </div>
        </Link>

        {/* 2. МЕНЮ СТОЛОВОЙ */}
        <Link
          to="/canteen"
          className="group bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] flex items-center justify-center text-[#0B4DA2] shrink-0 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              МЕНЮ СТОЛОВОЙ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              Заказ блюд на сегодня
            </div>
          </div>
        </Link>

        {/* 3. РАСЧЕТНЫЙ ЛИСТ */}
        <Link
          to="/payslip"
          className="group bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] flex items-center justify-center text-[#0B4DA2] shrink-0 transition-transform group-hover:scale-105">
            <Receipt className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              РАСЧЕТНЫЙ ЛИСТ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              Начисления и удержания
            </div>
          </div>
        </Link>

        {/* 4. ОКАЗАННЫЕ УСЛУГИ */}
        <Link
          to="/services"
          className="group bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] flex items-center justify-center text-[#0B4DA2] shrink-0 transition-transform group-hover:scale-105">
            <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ОКАЗАННЫЕ УСЛУГИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              Архив выполненных запросов
            </div>
          </div>
        </Link>

        {/* 5. УВЕДОМЛЕНИЯ И ВАКАНСИИ */}
        <button
          type="button"
          onClick={() => setIsNotificationsOpen(true)}
          className="group relative bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 text-left cursor-pointer w-full"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] flex items-center justify-center text-[#0B4DA2] shrink-0 transition-transform group-hover:scale-105">
            <Bell className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              УВЕДОМЛЕНИЯ И ВАКАНСИИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              Актуальные предложения
            </div>
          </div>
        </button>

        {/* 6. ЗАПРОС СПРАВКИ */}
        <Link
          to="/certificates"
          className="group bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all flex flex-row items-center gap-4 lg:gap-5 xl:gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-2xl lg:rounded-3xl bg-[#E8F1FC] flex items-center justify-center text-[#0B4DA2] shrink-0 transition-transform group-hover:scale-105">
            <Landmark className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 stroke-[2.2px] lg:stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl tracking-tight uppercase leading-snug">
              ЗАПРОС СПРАВКИ
            </div>
            <div className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-500 font-normal mt-0.5 sm:mt-1">
              О доходах и других справках
            </div>
          </div>
        </Link>
      </div>

      {/* Notifications & Vacancies Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden border-slate-100 shadow-xl">
          <DialogHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0B4DA2]" />
              Уведомления и Вакансии предприятия
            </DialogTitle>
          </DialogHeader>

          {/* Tabs header */}
          <div className="flex border-b border-slate-100 px-5 pt-2 gap-4">
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'border-[#002B7F] text-[#002B7F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Новости и объявления
            </button>
            <button
              onClick={() => setActiveTab('vacancies')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'vacancies'
                  ? 'border-[#002B7F] text-[#002B7F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Открытые вакансии (3)
            </button>
          </div>

          {/* Body content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 divide-y divide-slate-100">
            {activeTab === 'news' ? (
              news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.published_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    {item.body && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="pt-2 first:pt-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Изменение графика работы столовой в праздничные дни
                      </h4>
                      <span className="text-[11px] text-slate-400">05.09.2026</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Столовая предприятия обслуживает сотрудников с 11:00 до 15:00. Комплексные обеды подаются по стандартному графику списания через электронный пропуск.
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Открытие нового спортивного сезона в ФОК
                      </h4>
                      <span className="text-[11px] text-slate-400">02.09.2026</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Сотрудникам Волковысского ОАО «Беллакт» предоставляются льготные абонементы на бассейн и тренажёрный зал в ФОК «Волна».
                    </p>
                  </div>
                </>
              )
            ) : (
              vacancies.length > 0 ? (
                vacancies.map((item) => {
                  const isApplied = !!appliedVacancies[item.id];
                  return (
                    <div key={item.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <span className="text-[10px] uppercase font-bold bg-blue-50 text-[#002B7F] px-2 py-0.5 rounded-md">
                          Внутренний конкурс
                        </span>
                      </div>
                      {item.body && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.body}
                        </p>
                      )}
                      <div className="flex justify-end pt-1">
                        {isApplied ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                            ✓ Отклик отправлен в ОК
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyVacancy(item.title, item.id)}
                            className="bg-[#002B7F] hover:bg-[#001D56] text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            Откликнуться
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="pt-2 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Инженер-технолог молочного производства
                      </h4>
                      <span className="text-[10px] uppercase font-bold bg-blue-50 text-[#002B7F] px-2 py-0.5 rounded-md">
                        Цех детского питания
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Опыт работы от 2 лет, профильное высшее образование. Сменный график, расширенный соцпакет ОАО «Беллакт».
                    </p>
                    <div className="flex justify-end pt-1">
                      {appliedVacancies['vac-1'] ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          ✓ Отклик отправлен в ОК
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyVacancy('Инженер-технолог молочного производства', 'vac-1')}
                          className="bg-[#002B7F] hover:bg-[#001D56] text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Откликнуться
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Экономист в отдел снабжения и сбыта
                      </h4>
                      <span className="text-[10px] uppercase font-bold bg-blue-50 text-[#002B7F] px-2 py-0.5 rounded-md">
                        Управление
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Полный рабочий день, знание 1С:Предприятие 8. Социальный пакет и надбавки предприятия.
                    </p>
                    <div className="flex justify-end pt-1">
                      {appliedVacancies['vac-2'] ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          ✓ Отклик отправлен в ОК
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyVacancy('Экономист в отдел снабжения и сбыта', 'vac-2')}
                          className="bg-[#002B7F] hover:bg-[#001D56] text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Откликнуться
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
