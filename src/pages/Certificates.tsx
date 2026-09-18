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
              Запрос справок
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Официальные справки о доходах и заработной плате
            </p>
          </div>
        </div>

        {/* New Request Button & Modal */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl px-4 py-2.5 font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" />
          <span>Запросить справку</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Заказ официальной справки
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Срок формирования справки бухгалтерией предприятия составляет 1 рабочий день.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Fixed types list from spec */}
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

              {/* Receive method */}
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
                    <SelectItem value="electronic">В электронном виде с ЭЦП (PDF)</SelectItem>
                    <SelectItem value="paper">Печатный оригинал в бухгалтерии (каб. 204)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Optional note / purpose */}
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

      {/* Info Notice Banner */}
      <div className="bg-[#E8F1FC] dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <Building2 className="w-5 h-5 text-[#002B7F] dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Юридическая сила:</strong> Электронная справка с квалифицированной ЭЦП бухгалтера предприятия приравнивается к документу на бумажном носителе. Готовые электронные справки доступны для скачивания прямо из этого раздела.
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            История ваших запросов ({requests.length})
          </h2>
        </div>

        <div className="space-y-3">
          {requests.map((item) => (
            <Card key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] dark:bg-blue-950/60 text-[#0B4DA2] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      {item.status === 'ready' || item.status === 'issued' ? (
                        <FileCheck className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {item.type}
                        </h3>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
                          {item.id}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Назначение: {item.purpose}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Подано: {item.createdAt}</span>
                        <span>•</span>
                        <span>
                          {item.receiveMethod === 'electronic'
                            ? 'В электронном виде (ЭЦП)'
                            : 'Бумажный оригинал в бухгалтерии'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {item.status === 'processing' && (
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 dark:border-amber-800/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>В обработке</span>
                      </div>
                    )}

                    {item.status === 'ready' && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Готова</span>
                        </div>
                        {item.receiveMethod === 'electronic' && (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item)}
                            className="rounded-lg bg-[#002B7F] hover:bg-[#0B4DA2] text-white text-xs font-semibold h-8 cursor-pointer transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Скачать PDF
                          </Button>
                        )}
                      </div>
                    )}

                    {item.status === 'issued' && (
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Выдана на руки</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
