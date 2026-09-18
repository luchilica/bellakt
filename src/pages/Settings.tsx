import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  SlidersHorizontal,
  KeyRound,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Clock,
  Send,
  Sparkles,
  HeartPulse,
  UtensilsCrossed,
  Receipt,
  ClipboardList,
  Landmark,
  Bell,
  Home,
  Power,
  ShieldAlert,
  Info,
  ChevronDown,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { LoadingScreen } from '../components/LoadingScreen';
import {
  ThemeSettingsCard,
  ThemeQuickToggleButton,
} from '../components/ThemeSwitcher';
import {
  useNavPreferencesStore,
  ALL_AVAILABLE_NAV_ITEMS,
  NavItemKey,
} from '../store/useNavPreferencesStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

// Helper to render icon by name
function renderNavIcon(name: string, className: string = 'w-5 h-5') {
  switch (name) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Bell':
      return <Bell className={className} />;
    default:
      return <SlidersHorizontal className={className} />;
  }
}

export default function Settings() {
  const { employeeData } = useAuthStore();
  const {
    slot1,
    slot2,
    setSlot1,
    setSlot2,
    resetToDefaults,
    securityRequests,
    addSecurityRequest,
  } = useNavPreferencesStore();

  const [activeTab, setActiveTab] = useState<'appearance' | 'navigation' | 'security' | 'kiosk'>('appearance');

  // Security request form state
  const [requestType, setRequestType] = useState<'password' | 'qrcode' | '2fa'>('qrcode');
  const [reason, setReason] = useState('Замена смартфона');
  const [phone, setPhone] = useState('+375 (29) 782-45-12');
  const [comment, setComment] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Kiosk settings state
  const [autoLogout, setAutoLogout] = useState('5');
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [showTestLoading, setShowTestLoading] = useState(false);

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Укажите контактный номер для верификации');
      return;
    }

    const typeLabels = {
      password: 'Сброс и восстановление пароля',
      qrcode: 'Перевыпуск QR-кода пропуска',
      '2fa': 'Сброс двухфакторной аутентификации',
    };

    const newReq = addSecurityRequest({
      type: requestType,
      typeLabel: typeLabels[requestType],
      reason: reason || 'Утеря / Смена устройства',
      comment: comment.trim() || undefined,
      contact: phone,
    });

    setLastSubmittedId(newReq.id);
    setIsSuccessDialogOpen(true);
    toast.success(`Заявка ${newReq.id} передана в службу безопасности завода`);
    setComment('');
  };

  const item1 = ALL_AVAILABLE_NAV_ITEMS[slot1];
  const item2 = ALL_AVAILABLE_NAV_ITEMS[slot2];

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Настройки портала
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Тема оформления, персонализация навигации и безопасность
            </p>
          </div>
        </div>

        {/* Quick theme switch in header */}
        <div className="flex items-center gap-2">
          <ThemeQuickToggleButton />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs h-13">
          <TabsTrigger
            value="appearance"
            className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-[#D6E6F9] dark:data-[state=active]:bg-[#002B7F] data-[state=active]:text-[#002B7F] dark:data-[state=active]:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Тема и стиль</span>
            <span className="sm:hidden">Тема</span>
          </TabsTrigger>
          <TabsTrigger
            value="navigation"
            className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-[#D6E6F9] dark:data-[state=active]:bg-[#002B7F] data-[state=active]:text-[#002B7F] dark:data-[state=active]:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Нижняя навигация</span>
            <span className="sm:hidden">Навигация</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-[#D6E6F9] dark:data-[state=active]:bg-[#002B7F] data-[state=active]:text-[#002B7F] dark:data-[state=active]:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden sm:inline">Пароль и QR-код</span>
            <span className="sm:hidden">Безопасность</span>
          </TabsTrigger>
          <TabsTrigger
            value="kiosk"
            className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-[#D6E6F9] dark:data-[state=active]:bg-[#002B7F] data-[state=active]:text-[#002B7F] dark:data-[state=active]:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Инфокиоск</span>
            <span className="sm:hidden">Система</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 0: THEME & APPEARANCE */}
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <ThemeSettingsCard />
        </TabsContent>

        {/* TAB 1: CUSTOM NAVIGATION DOCK */}
        <TabsContent value="navigation" className="mt-4 space-y-4">
          {/* Live Preview Card */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 shadow-xs overflow-hidden">
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Предпросмотр нижней панели
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetToDefaults();
                    toast.success('Настройки навигации сброшены по умолчанию');
                  }}
                  className="rounded-xl text-xs h-7 px-2.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  По умолчанию
                </Button>
              </div>

              {/* Mockup of bottom bar */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-2 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-1.5 sm:gap-2">
                {/* Fixed Home */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#D6E6F9] dark:bg-[#002B7F] text-[#002B7F] dark:text-white text-xs font-bold shrink-0">
                  <Home className="w-3.5 h-3.5 stroke-[2.2px]" />
                  <span className="hidden sm:inline">ГЛАВНОЕ МЕНЮ</span>
                  <span className="sm:hidden">Главная</span>
                </div>

                {/* Slot 1 dynamic */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#002B7F] dark:text-blue-300 text-xs font-bold border border-blue-200/80 dark:border-blue-900/50 truncate">
                  {renderNavIcon(item1.iconName, 'w-3.5 h-3.5 stroke-[2.2px] shrink-0')}
                  <span className="truncate">{item1.label}</span>
                </div>

                {/* Slot 2 dynamic */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#002B7F] dark:text-blue-300 text-xs font-bold border border-blue-200/80 dark:border-blue-900/50 truncate">
                  {renderNavIcon(item2.iconName, 'w-3.5 h-3.5 stroke-[2.2px] shrink-0')}
                  <span className="truncate">{item2.label}</span>
                </div>

                {/* Fixed Logout */}
                <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-[#E53935] text-[#E53935] text-xs font-bold shrink-0">
                  <span>ВЫХОД</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                Кнопки <strong>«Главное меню»</strong> и <strong>«Выход»</strong> закреплены постоянно. Две центральные кнопки можно настроить.
              </p>
            </CardContent>
          </Card>

          {/* Minimalist Dropdowns Card */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Slot 1 Select */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Первая кнопка (Слот 1)
                    </Label>
                    <span className="text-[11px] font-bold text-[#002B7F] dark:text-blue-300 bg-[#D6E6F9] dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {item1.shortLabel}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={slot1}
                      onChange={(e) => {
                        const val = e.target.value as NavItemKey;
                        setSlot1(val);
                        toast.success(`Слот 1 изменён на «${ALL_AVAILABLE_NAV_ITEMS[val].label}»`);
                      }}
                      className="w-full h-10 pl-3 pr-9 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#002B7F] focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      {(Object.keys(ALL_AVAILABLE_NAV_ITEMS) as NavItemKey[]).map((key) => {
                        const item = ALL_AVAILABLE_NAV_ITEMS[key];
                        return (
                          <option key={`slot1-${key}`} value={key} className="dark:bg-slate-900">
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <ChevronDown className="w-4 h-4 stroke-[2.2px]" />
                    </div>
                  </div>
                </div>

                {/* Slot 2 Select */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Вторая кнопка (Слот 2)
                    </Label>
                    <span className="text-[11px] font-bold text-[#002B7F] dark:text-blue-300 bg-[#D6E6F9] dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {item2.shortLabel}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={slot2}
                      onChange={(e) => {
                        const val = e.target.value as NavItemKey;
                        setSlot2(val);
                        toast.success(`Слот 2 изменён на «${ALL_AVAILABLE_NAV_ITEMS[val].label}»`);
                      }}
                      className="w-full h-10 pl-3 pr-9 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#002B7F] focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      {(Object.keys(ALL_AVAILABLE_NAV_ITEMS) as NavItemKey[]).map((key) => {
                        const item = ALL_AVAILABLE_NAV_ITEMS[key];
                        return (
                          <option key={`slot2-${key}`} value={key} className="dark:bg-slate-900">
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <ChevronDown className="w-4 h-4 stroke-[2.2px]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PASSWORD & QR-CODE RECOVERY */}
        <TabsContent value="security" className="mt-5 space-y-6">
          {/* Security Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Служба безопасности ОАО «Беллакт»:</strong> При утере физического бейджа, забытом пароле от инфокиоска или смене мобильного устройства подайте заявку ниже. Новый пароль или QR-код будет сгенерирован и отправлен на ваш подтвержденный номер телефона после верификации в отделе кадров.
            </div>
          </div>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Request Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Что необходимо восстановить?
                    </Label>
                    <Select
                      value={requestType}
                      onValueChange={(val: any) => setRequestType(val)}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="qrcode">
                          <span className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-[#002B7F] dark:text-[#60a5fa]" />
                            Перевыпуск QR-кода пропуска
                          </span>
                        </SelectItem>
                        <SelectItem value="password">
                          <span className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-[#002B7F] dark:text-[#60a5fa]" />
                            Восстановление пароля учетной записи
                          </span>
                        </SelectItem>
                        <SelectItem value="2fa">
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#002B7F] dark:text-[#60a5fa]" />
                            Сброс привязанного устройства (2FA)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Причина обращения
                    </Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="Забыл пароль от системы">Забыл пароль от системы</SelectItem>
                        <SelectItem value="Замена смартфона">Замена смартфона / устройства</SelectItem>
                        <SelectItem value="Утерян или поврежден физический QR-бейдж">
                          Утерян / поврежден физический QR-бейдж
                        </SelectItem>
                        <SelectItem value="Подозрение на компрометацию доступа">
                          Подозрение на компрометацию доступа
                        </SelectItem>
                        <SelectItem value="Плановая замена учетных данных">
                          Плановая замена учетных данных
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Контактный номер для SMS с временным кодом
                    </Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+375 (XX) XXX-XX-XX"
                      className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 h-11"
                      required
                    />
                  </div>

                  {/* Employee info badge */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Данные сотрудника (из профиля)
                    </Label>
                    <div className="h-11 px-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                      {employeeData?.full_name || 'Иванов Иван Иванович'} (Таб. № {employeeData?.tab_number || '20481'})
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Дополнительный комментарий (необязательно)
                  </Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Укажите подробности при необходимости..."
                    className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 min-h-[80px]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl px-6 py-2.5 font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Подать официальный запрос
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Requests History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#002B7F] dark:text-[#60a5fa]" />
              История поданных запросов безопасности
            </h3>

            <div className="space-y-2.5">
              {securityRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                      {req.type === 'qrcode' ? (
                        <QrCode className="w-5 h-5" />
                      ) : (
                        <KeyRound className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{req.typeLabel}</span>
                        <span className="text-xs font-mono font-normal text-slate-400">
                          {req.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Причина: {req.reason} • {new Date(req.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {req.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Выполнено
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        В обработке СБ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: KIOSK & SYSTEM SETTINGS */}
        <TabsContent value="kiosk" className="mt-5 space-y-4">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardContent className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Автоматический выход при неактивности
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Защита персональных данных на общем сенсорном терминале
                  </div>
                </div>
                <Select value={autoLogout} onValueChange={setAutoLogout}>
                  <SelectTrigger className="w-36 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 h-10 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="2">2 минуты</SelectItem>
                    <SelectItem value="5">5 минут</SelectItem>
                    <SelectItem value="10">10 минут</SelectItem>
                    <SelectItem value="never">Не выходить</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Звуковой отклик интерфейса
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Подтверждение касания экрана и успешного считывания QR
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSoundFeedback(!soundFeedback);
                    toast.success(
                      soundFeedback ? 'Звук отключен' : 'Звуковой отклик включен'
                    );
                  }}
                  className={cn(
                    'rounded-xl text-xs font-bold px-4 h-9',
                    soundFeedback
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#002B7F] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 dark:border-slate-700'
                  )}
                >
                  {soundFeedback ? 'Включен' : 'Выключен'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Экран загрузки с анимацией логотипа
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Фирменный Splash Screen при запуске и входе в терминал
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTestLoading(true)}
                  className="rounded-xl text-xs font-bold px-4 h-9 bg-blue-50 dark:bg-blue-950/40 text-[#002B7F] dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Посмотреть анимацию
                </Button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Идентификатор инфокиоска / терминала
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Волковыск, ул. Октябрьская, 133 • Проходная №1
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  KIOSK-BLT-01
                </span>
              </div>
            </CardContent>
          </Card>

          {showTestLoading && (
            <LoadingScreen
              minDuration={2400}
              onFinished={() => setShowTestLoading(false)}
            />
          )}

          <div className="p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#002B7F] dark:text-[#60a5fa]" />
              <span>Корпоративный портал Волковысского ОАО «Беллакт»</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">v2.4.2 (Сборка 2026)</span>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Modal for Security Request */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900 dark:text-white">
              Запрос успешно зарегистрирован
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
              Номер вашей официальной заявки: <strong className="text-slate-900 font-mono text-sm">{lastSubmittedId}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-2">
            <p>• Заявка направлена в отдел безопасности и бюро пропусков завода.</p>
            <p>• Смс с временным кодом или ссылка на новый QR-код поступит на номер <strong>{phone}</strong> после подтверждения оператором.</p>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl px-6 py-2 text-xs font-bold cursor-pointer transition-colors"
            >
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
