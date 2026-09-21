import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateRequest {
  id: string;
  type: string;
  createdAt: string;
  completedAt?: string;
  status: 'processing' | 'ready' | 'issued';
}

const ALL_CERTIFICATE_TYPES = [
  { id: 'bank_other', label: 'Справка для предоставления в иные банки' },
  { id: 'shop_3', label: 'Справка о зарплате для магазина (3 месяца)' },
  { id: 'shop_6', label: 'Справка о зарплате для магазина (6 месяцев)' },
  { id: 'belapb', label: 'Справка о зарплате для БелАПБ' },
  { id: 'visa_3', label: 'Справка о зарплате (виза) (3 месяца)' },
  { id: 'visa_6', label: 'Справка о зарплате (виза) (6 месяцев)' },
  { id: 'year_12', label: 'Справка о зарплате за год' },
];

export default function Certificates() {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const [requests, setRequests] = useState<CertificateRequest[]>([
    {
      id: 'СПР-2026-8812',
      type: 'Справка для предоставления в иные банки',
      createdAt: '08.09.2026',
      status: 'processing',
    },
    {
      id: 'СПР-2026-7450',
      type: 'Справка о зарплате (виза) (6 месяцев)',
      createdAt: '22.08.2026',
      completedAt: '23.08.2026',
      status: 'ready',
    },
    {
      id: 'СПР-2026-6104',
      type: 'Справка о зарплате для магазина (6 месяцев)',
      createdAt: '14.07.2026',
      completedAt: '15.07.2026',
      status: 'issued',
    },
  ]);

  const handleRequest = (typeLabel: string) => {
    const newRequest: CertificateRequest = {
      id: `СПР-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: typeLabel,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'processing',
    };

    setRequests([newRequest, ...requests]);
    toast.success(`Запрос оформлен: «${typeLabel}»`, {
      description: 'Заявка успешно передана в бухгалтерию ОАО «Беллакт»',
    });
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = customText.trim();
    if (!trimmed) {
      toast.error('Пожалуйста, опишите какая справка вам необходима');
      return;
    }

    const newRequest: CertificateRequest = {
      id: `СПР-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: `Индивидуальная: ${trimmed}`,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'processing',
    };

    setRequests([newRequest, ...requests]);
    setCustomText('');
    setIsCustomDialogOpen(false);
    toast.success('Индивидуальный запрос отправлен', {
      description: 'Заявка успешно передана в бухгалтерию ОАО «Беллакт»',
    });
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 pb-10">
      {/* Header with Back Button and Custom Request Button in line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Запрос справки
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomDialogOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#002B7F] dark:hover:border-blue-500 text-slate-800 dark:text-slate-200 hover:text-[#002B7F] dark:hover:text-blue-400 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#002B7F] dark:text-blue-400 stroke-[2.5px]" />
          <span>запрос индивидуальной справки</span>
        </button>
      </div>

      {/* Available Certificate Types List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-4 sm:p-5 lg:p-6 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Доступные виды справок
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {ALL_CERTIFICATE_TYPES.map((cert) => (
            <div
              key={cert.id}
              className="py-3 sm:py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {cert.label}
              </span>
              <button
                type="button"
                onClick={() => handleRequest(cert.label)}
                className="w-full sm:w-auto self-end sm:self-center px-4 py-2 rounded-xl bg-[#002B7F] hover:bg-[#0B4DA2] active:bg-[#002161] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs shrink-0 text-center"
              >
                Запросить
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Accounting Schedule Notice */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        Справки забираются в бухгалтерии. График работы: <strong className="font-bold text-slate-900 dark:text-white">с 8:00 до 17:00 в будние дни</strong>.
      </div>

      {/* History of Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-4 sm:p-5 lg:p-6 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            История ваших запросов
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Всего: {requests.length}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {requests.map((item) => (
            <div
              key={item.id}
              className="py-3.5 sm:py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.type}
                </div>
                {item.completedAt && (item.status === 'ready' || item.status === 'issued') && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Дата выполнения: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.completedAt}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {item.status === 'processing' && (
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200/80 dark:border-amber-800/60">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>В обработке</span>
                  </div>
                )}

                {item.status === 'ready' && (
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Готово к выдаче</span>
                  </div>
                )}

                {item.status === 'issued' && (
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Выдана на руки</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Modal for Custom Certificate Request */}
      {isCustomDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
          onClick={() => setIsCustomDialogOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 relative animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Запрос индивидуальной справки
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Опишите в 1–2 предложениях, какая именно справка вам требуется
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomDialogOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={250}
                  rows={3}
                  placeholder="Например: Справка о неполучении пособия на ребенка за период с января по июнь 2026 года для предоставления по месту работы супруги."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B7F]/20 dark:focus:ring-blue-500/40 focus:border-[#002B7F] dark:focus:border-blue-400 resize-none transition-colors"
                  autoFocus
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 px-1">
                  <span>До 2 предложений</span>
                  <span>{customText.length}/250</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomDialogOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#002B7F] hover:bg-[#0B4DA2] active:bg-[#002161] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

