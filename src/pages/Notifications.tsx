import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Phone,
  CheckCircle2,
  Plus,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

export interface ContactInfo {
  name?: string;
  role?: string;
  phoneInternal?: string;
  phoneCity?: string;
  phoneMobile?: string;
}

export interface AnnouncementItem {
  id: string;
  category: 'announcement' | 'vacancy';
  title: string;
  subtitle?: string;
  publishDate: string;
  headerType: 'О Б Ъ Я В Л Е Н И Е' | 'В А К А Н С И Я';
  bodyPoints: string[];
  notes?: string;
  contacts: ContactInfo[];
  accentBadge?: string;
  imageUrl?: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    category: 'announcement',
    title: 'Продажа полимерных бочек и древесных отходов',
    subtitle: 'Осуществляется продажа со склада с оплатой за наличный расчет в кассе предприятия',
    publishDate: '07.09.2026',
    headerType: 'О Б Ъ Я В Л Е Н И Е',
    bodyPoints: [
      '• БОЧЕК ПОЛИМЕРНЫХ б/у 200 л, стоимость 1 бочки составляет 36 рублей;',
      '• ОТХОДОВ ДРЕВЕСНЫХ (поддонов б/у) в любом количестве, стоимость 1 м³ (25 поддонов б/у) составляет 6 рублей 50 копеек;',
      '• Доставка возможна как транспортом сотрудника, так и транспортом предприятия.',
    ],
    notes: 'ОБЯЗАТЕЛЬНО ПРИ СЕБЕ ИМЕТЬ ПАСПОРТ.',
    accentBadge: 'Продажа со склада',
    contacts: [
      {
        name: 'Коржич Наталья Леонидовна',
        role: 'Заведующий складом сухих продуктов, компонентов',
        phoneInternal: '2-54',
        phoneCity: '7-50-67',
        phoneMobile: '+375-33-325-20-98',
      },
    ],
  },
  {
    id: 'ann-2',
    category: 'vacancy',
    title: 'Работа по договору подряда в ОАО «Хатьковцы»',
    subtitle: 'Приглашаются сотрудники ОАО «Беллакт» в свободное от основной работы время',
    publishDate: '07.09.2026',
    headerType: 'О Б Ъ Я В Л Е Н И Е',
    bodyPoints: [
      'По договору подряда для работы требуются:',
      '• водители категории C, E',
      '• трактористы 5-го разряда',
      '• слесарь-электрик по ремонту электрооборудования',
      '• электрогазосварщик',
    ],
    notes: 'За информацией по заключению договора обращайтесь в отдел кадров.',
    accentBadge: 'Подработка',
    contacts: [
      {
        name: 'Малиновская Светлана Владимировна',
        role: 'Инспектор отдела кадров ОАО «Хатьковцы»',
        phoneCity: '2-05-52',
        phoneMobile: '+375 (29) 647-26-23',
      },
    ],
  },
  {
    id: 'ann-3',
    category: 'announcement',
    title: 'Продажа ФИНПАКОВ б/у (полимерных ящиков)',
    subtitle: 'Продажа с оплатой за наличный расчет в кассе предприятия',
    publishDate: '07.09.2026',
    headerType: 'О Б Ъ Я В Л Е Н И Е',
    bodyPoints: [
      '• ФИНПАКОВ б/у (ящиков полимерных: высота 280 мм, ширина 300 мм, длина 400 мм) в любом количестве;',
      '• Стоимость за 1 штуку составляет 8 рублей.',
    ],
    notes: 'Оплата производится за наличный расчет в кассе предприятия.',
    accentBadge: 'Продажа тары',
    contacts: [
      {
        name: 'Федутик Максим Валерьянович',
        role: 'Заведующий складом сухих продуктов, компонентов №2',
        phoneInternal: '134',
        phoneMobile: '+375-29-352-10-05',
      },
      {
        name: 'Шостак Анна Юрьевна',
        role: 'Специалист по обработке перевозочных документов',
        phoneInternal: '102',
      },
    ],
  },
  {
    id: 'ann-4',
    category: 'vacancy',
    title: 'На постоянную работу требуются сотрудники на производство',
    subtitle: 'Волковысское ОАО «Беллакт» приглашает на работу в основные производственные цеха',
    publishDate: '07.09.2026',
    headerType: 'О Б Ъ Я В Л Е Н И Е',
    bodyPoints: [
      '• Подсобные рабочие',
      '• Оператор линии в производстве пищевой продукции (с обучением)',
      '• Наладчик оборудования в производстве пищевой продукции (с обучением)',
      '• Грузчики',
    ],
    notes: 'Вакансии также размещены на портале государственной службы занятости gsz.gov.by',
    accentBadge: 'С обучением',
    contacts: [
      {
        role: 'Отдел кадров Волковысского ОАО «Беллакт»',
        phoneInternal: '2-00, 2-01',
        phoneCity: '7-50-00',
        phoneMobile: '+375 (29) 780-00-11',
      },
    ],
  },
  {
    id: 'ann-5',
    category: 'vacancy',
    title: 'Экономист в отдел снабжения',
    subtitle: 'Открыта вакансия в коммерческой дирекции ОАО «Беллакт»',
    publishDate: '01.09.2026',
    headerType: 'В А К А Н С И Я',
    bodyPoints: [
      'Обязанности: расчет потребности в материальных ресурсах, контроль поставок, отслеживание складских остатков.',
      'Требования: высшее/средне-специальное образование, знание 1С:Предприятие 8, MS Excel.',
      'Условия: полный соцпакет, стабильная официальная заработная плата, надбавки ОАО «Беллакт».',
    ],
    notes: 'Для записи на собеседование обращайтесь в отдел кадров завода.',
    accentBadge: 'ИТР / Специалист',
    contacts: [
      {
        role: 'Отдел снабжения и сбыта ОАО «Беллакт»',
        phoneInternal: '2-21',
        phoneMobile: '+375 (29) 648-10-17',
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'bellakt_announcements_v1';
const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

export default function Notifications() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: AnnouncementItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          if (
            item.subtitle === 'Размещено сотрудником' ||
            item.subtitle === 'Размещено через портал сотрудника'
          ) {
            return { ...item, subtitle: undefined };
          }
          return item;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnnouncementItem | null>(null);
  const [appliedVacancies, setAppliedVacancies] = useState<Record<string, boolean>>({});
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form states for simple upload
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'announcement' | 'vacancy'>('announcement');
  const [newDetails, setNewDetails] = useState('');
  const [newContacts, setNewContacts] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto flip effect
  useEffect(() => {
    if (isPaused || announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, announcements.length]);

  const currentItem = announcements[currentIndex] || announcements[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleApply = (id: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAppliedVacancies((prev) => ({ ...prev, [id]: true }));
    toast.success(`Отклик принят: «${title}»`, {
      description: 'Отдел кадров ОАО «Беллакт» свяжется с вами',
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Файл не должен превышать 8 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newImage) {
      toast.error('Введите заголовок или добавьте фото');
      return;
    }
    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      category: newType,
      title: newTitle.trim() || 'Информационное объявление',
      publishDate: new Date().toLocaleDateString('ru-RU'),
      headerType: newType === 'vacancy' ? 'В А К А Н С И Я' : 'О Б Ъ Я В Л Е Н И Е',
      bodyPoints: newDetails
        ? newDetails.split('\n').filter((l) => l.trim().length > 0)
        : ['Материал прикреплен к объявлению.'],
      accentBadge: newType === 'vacancy' ? 'Вакансия' : 'Объявление',
      imageUrl: newImage || undefined,
      contacts: newContacts
        ? [{ name: newContacts.trim() }]
        : [{ role: 'Отдел кадров', phoneInternal: '2-00' }],
    };

    const updated = [newItem, ...announcements];
    setAnnouncements(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    setCurrentIndex(0);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewDetails('');
    setNewContacts('');
    setNewImage(null);
    toast.success('Объявление добавлено');
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-12">
      {/* Top Bar: Minimal header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Уведомления и вакансии
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#002B7F] dark:hover:border-blue-500 text-slate-800 dark:text-slate-200 hover:text-[#002B7F] dark:hover:text-blue-400 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
          title="Добавить объявление"
        >
          <Plus className="w-4 h-4 text-[#002B7F] dark:text-blue-400 stroke-[2.5px]" />
          <span>Подать объявление</span>
        </button>
      </div>

      {/* Main Auto-flipping Card (Clean & Minimalist) */}
      {currentItem && (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-5 sm:p-7 space-y-5 transition-all"
        >
          {/* Top metadata row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  currentItem.category === 'vacancy'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                    : 'bg-[#E8F1FC] text-[#002B7F] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60'
                }`}
              >
                {currentItem.accentBadge || (currentItem.category === 'vacancy' ? 'Вакансия' : 'Объявление')}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {currentItem.publishDate}
              </span>
            </div>

            {/* Play/Pause state & Index indicator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isPaused ? 'Возобновить автопрокрутку' : 'Приостановить автопрокрутку'}
              >
                {isPaused ? <Play className="w-4 h-4 text-[#002B7F] dark:text-blue-400" /> : <Pause className="w-4 h-4" />}
              </button>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {currentIndex + 1} / {announcements.length}
              </span>
            </div>
          </div>

          {/* Interactive announcement body (Clickable for details) */}
          <div
            onClick={() => setSelectedItem(currentItem)}
            className="group cursor-pointer space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-[#002B7F]/30 dark:hover:border-blue-500/30 transition-all"
          >
            {/* Image if available */}
            {currentItem.imageUrl && (
              <div className="w-full max-h-48 sm:max-h-56 rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-slate-700">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="w-full h-full max-h-48 sm:max-h-56 object-contain mx-auto"
                />
              </div>
            )}

            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#002B7F] dark:group-hover:text-blue-400 transition-colors">
              {currentItem.title}
            </h2>

            {currentItem.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {currentItem.subtitle}
              </p>
            )}

            {/* Quick 1-2 points preview */}
            <div className="space-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {currentItem.bodyPoints.slice(0, 2).map((pt, i) => (
                <p key={i} className="line-clamp-1">
                  {pt}
                </p>
              ))}
            </div>

            {/* Action prompt */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-[#002B7F] dark:text-blue-400 group-hover:underline">
                Нажмите для подробностей →
              </span>
              {currentItem.contacts?.[0]?.phoneInternal && (
                <span className="text-xs text-slate-400">
                  Тел: {currentItem.contacts[0].phoneInternal}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Controls: Prev / Next / Dots */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            {/* Slide dots */}
            <div className="flex items-center gap-1.5">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#002B7F] dark:bg-blue-400'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={`Объявление ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <span>Вперед</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Modal: Подробная информация по клику */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in-0"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedItem.category === 'vacancy'
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                        : 'bg-[#E8F1FC] text-[#002B7F] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60'
                    }`}
                  >
                    {selectedItem.accentBadge || (selectedItem.category === 'vacancy' ? 'Вакансия' : 'Объявление')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedItem.publishDate}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image in modal */}
            {selectedItem.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black/5 dark:bg-black/30">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full max-h-64 object-contain mx-auto"
                />
              </div>
            )}

            {selectedItem.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-[#002B7F] dark:text-blue-300">
                {selectedItem.subtitle}
              </p>
            )}

            {/* Points / Details */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-100 dark:border-slate-700/60">
              {selectedItem.bodyPoints.map((pt, idx) => (
                <p key={idx}>{pt}</p>
              ))}
            </div>

            {/* Notes */}
            {selectedItem.notes && (
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs font-bold text-amber-800 dark:text-amber-300">
                {selectedItem.notes}
              </div>
            )}

            {/* Contacts */}
            {selectedItem.contacts && selectedItem.contacts.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Контакты для обращения:
                </div>
                {selectedItem.contacts.map((c, i) => (
                  <div key={i} className="space-y-0.5 text-slate-600 dark:text-slate-300">
                    {c.name && <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>}
                    {c.role && <div>{c.role}</div>}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-700 dark:text-slate-200 font-semibold">
                      {c.phoneInternal && <span>Внутренний: {c.phoneInternal}</span>}
                      {c.phoneCity && <span>Городской: {c.phoneCity}</span>}
                      {c.phoneMobile && (
                        <a
                          href={`tel:${c.phoneMobile}`}
                          className="text-[#002B7F] dark:text-blue-400 font-bold hover:underline"
                        >
                          {c.phoneMobile}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Закрыть
              </button>

              {selectedItem.category === 'vacancy' && (
                appliedVacancies[selectedItem.id] ? (
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Отклик отправлен в ОК</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleApply(selectedItem.id, selectedItem.title, e)}
                    className="px-5 py-2 rounded-xl bg-[#002B7F] hover:bg-[#0B4DA2] active:bg-[#002161] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Откликнуться
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simple Upload Modal */}
      {isUploadOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in-0"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Подать объявление
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('announcement')}
                  className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    newType === 'announcement'
                      ? 'bg-[#002B7F] text-white border-[#002B7F]'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Объявление
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('vacancy')}
                  className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    newType === 'vacancy'
                      ? 'bg-[#002B7F] text-white border-[#002B7F]'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Вакансия
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Продажа пиломатериалов"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B7F]/20"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Фото объявления (необязательно)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {newImage ? (
                    <div className="relative">
                      <img src={newImage} alt="Preview" className="max-h-28 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewImage(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-1 text-slate-500 text-xs">
                      <Upload className="w-4 h-4 text-[#002B7F] dark:text-blue-400" />
                      <span>Прикрепить фото / скан</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Текст и условия
                </label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  rows={2}
                  placeholder="Краткое описание, стоимость, условия..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B7F]/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Контакты
                </label>
                <input
                  type="text"
                  value={newContacts}
                  onChange={(e) => setNewContacts(e.target.value)}
                  placeholder="ФИО, телефон"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B7F]/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#002B7F] text-white text-xs font-bold hover:bg-[#0B4DA2] cursor-pointer shadow-xs"
                >
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
