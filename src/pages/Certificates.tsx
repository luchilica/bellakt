import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import {
  Download,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Plus,
  FileText,
  FileCheck,
  Building2,
  Calendar,
  ShoppingBag,
  Globe,
  FileSpreadsheet,
  Check,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface CertificateRequest {
  id: string;
  type: string;
  purpose: string;
  receiveMethod: 'electronic' | 'paper';
  createdAt: string;
  readyAt?: string;
  status: 'processing' | 'ready' | 'issued';
}

const PRESET_CERTIFICATES = [
  {
    id: 'bank_other',
    title: 'Для банка (кредит)',
    subtitle: 'Справка о доходах за 3-6 мес. для кредитования',
    icon: Building2,
    defaultPurpose: 'ОАО «АСБ Беларусбанк» (потребительский кредит)',
    tag: 'Самая частая',
  },
  {
    id: 'shop_6',
    title: 'Для магазина (рассрочка)',
    subtitle: 'Справка о зарплате за 6 месяцев для рассрочки',
    icon: ShoppingBag,
    defaultPurpose: 'Для оформления рассрочки в торговой сети',
    tag: 'Торговля',
  },
  {
    id: 'visa_6',
    title: 'Для визы / посольства',
    subtitle: 'Справка с указанием должности и оклада за 6 мес.',
    icon: Globe,
    defaultPurpose: 'Посольство / консульский отдел / визовый центр',
    tag: 'Консульство',
  },
  {
    id: 'year_12',
    title: 'О доходах за год',
    subtitle: 'Развернутая справка о совокупном доходе за 12 месяцев',
    icon: FileSpreadsheet,
    defaultPurpose: 'По месту требования (налоговые вычеты / субсидии)',
    tag: 'Годовая',
  },
];

const FIXED_CERTIFICATE_TYPES = [
  { id: 'bank_other', label: 'Справка для предоставления в иные банки' },
  { id: 'shop_3', label: 'Справка о зарплате для магазина (3 месяца)' },
  { id: 'shop_6', label: 'Справка о зарплате для магазина (6 месяцев)' },
  { id: 'belapb', label: 'Справка о зарплате для БелАПБ' },
  { id: 'visa_3', label: 'Справка о зарплате (виза) (3 месяца)' },
  { id: 'visa_6', label: 'Справка о зарплате (виза) (6 месяцев)' },
  { id: 'year_12', label: 'Справка о зарплате за год' },
];

export default function Certificates() {
  const [selectedType, setSelectedType] = useState('bank_other');
  const [receiveMethod, setReceiveMethod] = useState<'electronic' | 'paper'>('electronic');
  const [note, setNote] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [requests, setRequests] = useState<CertificateRequest[]>([
    {
      id: 'СПР-2026-8812',
      type: 'Справка для предоставления в иные банки',
      purpose: 'ОАО «АСБ Беларусбанк» (потребительский кредит)',
      receiveMethod: 'electronic',
      createdAt: '08.09.2026',
      status: 'processing',
    },
    {
      id: 'СПР-2026-7450',
      type: 'Справка о зарплате (виза) (6 месяцев)',
      purpose: 'Посольство / визовый центр',
      receiveMethod: 'electronic',
      createdAt: '22.08.2026',
      readyAt: '23.08.2026',
      status: 'ready',
    },
    {
      id: 'СПР-2026-6104',
      type: 'Справка о зарплате для магазина (6 месяцев)',
      purpose: 'Рассрочка в ТЦ «Евроопт»',
      receiveMethod: 'paper',
      createdAt: '14.07.2026',
      readyAt: '15.07.2026',
      status: 'issued',
    },
  ]);

  const handleQuickPreset = (preset: typeof PRESET_CERTIFICATES[0]) => {
    const newRequest: CertificateRequest = {
      id: `СПР-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: preset.title,
      purpose: preset.defaultPurpose,
      receiveMethod: 'electronic',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'processing',
    };

    setRequests([newRequest, ...requests]);
    toast.success(`Запрос оформлен: «${preset.title}»`, {
      description: 'Заявка зарегистрирована и передана в бухгалтерию ОАО «Беллакт» (каб. 204)',
    });
  };

  const submitRequest = () => {
    const typeObj = FIXED_CERTIFICATE_TYPES.find((t) => t.id === selectedType);
    const typeLabel = typeObj ? typeObj.label : 'Справка о доходах';

    const newRequest: CertificateRequest = {
      id: `СПР-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: typeLabel,
      purpose: note.trim() || 'По месту требования',
      receiveMethod,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'processing',
    };

    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    setNote('');
    toast.success('Запрос на справку успешно отправлен в бухгалтерию ОАО «Беллакт»');
  };

  const handleDownload = (req: CertificateRequest) => {
    toast.success(`Справка ${req.id} (${req.type}) успешно скачана (PDF с ЭЦП)`);
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header with Back Button */}
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
              Заказ справок
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Официальные документы о доходах, зарплате и стаже с ЭЦП
            </p>
          </div>
        </div>

        {/* Custom Request Dialog Trigger */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="outline"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#002B7F] dark:text-blue-400 stroke-[2.5px]" />
          <span>Справка с произвольным назначением</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Заказ официальной справки
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Срок формирования справки бухгалтерией ОАО «Беллакт» составляет 1 рабочий день.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Вид справки</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white">
                    <SelectValue placeholder="Выберите вид справки" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                    {FIXED_CERTIFICATE_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs sm:text-sm">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Способ получения</Label>
                <Select
                  value={receiveMethod}
                  onValueChange={(val: any) => setReceiveMethod(val)}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white">
                    <SelectValue placeholder="Выберите способ получения" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                    <SelectItem value="electronic">В электронном виде с ЭЦП (PDF прямо в портале)</SelectItem>
                    <SelectItem value="paper">Печатный оригинал с мокрой печатью (каб. 204)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Место предоставления <span className="text-slate-500 dark:text-slate-400 font-normal">(опционально)</span>
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: В ОАО «АСБ Беларусбанк» для оформления кредита"
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[70px]"
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs sm:text-sm font-semibold cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Отмена
              </Button>
              <Button onClick={submitRequest} className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors">
                Отправить в бухгалтерию
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Presets: 1-Tap Kiosk & Mobile friendly Request Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Быстрый заказ популярной справки (в 1 нажатие)
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Без заполнения полей
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PRESET_CERTIFICATES.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-[#0B4DA2]/40 dark:hover:border-blue-500/40 text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                      <Icon className="w-6 h-6 stroke-[2.2px]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {preset.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#002B7F] dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#002B7F] dark:text-blue-400 font-bold">
                  <span>Заказать в 1 клик</span>
                  <span className="text-lg leading-none">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="bg-[#E8F1FC] dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-blue-900/40 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Building2 className="w-5 h-5 stroke-[2.2px]" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white font-bold">Юридическая сила ЭЦП ОАО «Беллакт»:</strong> Электронная справка с квалифицированной ЭЦП бухгалтера предприятия приравнивается к бумажному документу. Готовые электронные справки доступны для скачивания сразу после готовности.
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            История ваших запросов ({requests.length})
          </h2>
        </div>

        <div className="space-y-3">
          {requests.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-4 sm:p-5 lg:p-6 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8F1FC] dark:bg-blue-950/60 border border-transparent dark:border-blue-800/40 text-[#0B4DA2] dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    {item.status === 'ready' || item.status === 'issued' ? (
                      <FileCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
                    ) : (
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.type}
                      </h3>
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                        {item.id}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Назначение: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{item.purpose}</strong>
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Подано: {item.createdAt}</span>
                      <span>•</span>
                      <span>
                        {item.receiveMethod === 'electronic'
                          ? 'Электронная (с ЭЦП)'
                          : 'Бумажный оригинал (каб. 204)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                  {item.status === 'processing' && (
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200/80 dark:border-amber-800/60">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>В обработке (каб. 204)</span>
                    </div>
                  )}

                  {item.status === 'ready' && (
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Готова к выдаче</span>
                      </div>
                      {item.receiveMethod === 'electronic' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item)}
                          className="rounded-xl bg-[#002B7F] hover:bg-[#0B4DA2] text-white text-xs font-bold h-9 px-4 cursor-pointer transition-colors shadow-xs"
                        >
                          <Download className="w-4 h-4 mr-1.5 stroke-[2.2px]" />
                          Скачать PDF (ЭЦП)
                        </Button>
                      )}
                    </div>
                  )}

                  {item.status === 'issued' && (
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Выдана на руки</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

