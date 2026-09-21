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
  Send,
  HeartPulse,
  UtensilsCrossed,
  Receipt,
  ClipboardList,
  Landmark,
  Bell,
  Home,
  LogOut,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
import {
  ThemeSettingsCard,
} from '../components/ThemeSwitcher';
import {
  useNavPreferencesStore,
  ALL_AVAILABLE_NAV_ITEMS,
  NavItemKey,
} from '../store/useNavPreferencesStore';
import { useAuthStore } from '../store/useAuthStore';
import { useKioskSecurityStore } from '../store/useKioskSecurityStore';
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
    addSecurityRequest,
  } = useNavPreferencesStore();

  const [activeTab, setActiveTab] = useState<'appearance' | 'navigation' | 'security' | 'kiosk'>('appearance');

  // Security request form state
  const [requestType, setRequestType] = useState<'password' | 'qrcode' | '2fa'>('qrcode');
  const [reason, setReason] = useState('Замена смартфона');
  const [email, setEmail] = useState(employeeData?.email || 'ivanov@bellakt.by');
  const [comment, setComment] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Kiosk security settings state (persisted & enforced globally)
  const { autoLogout, setAutoLogout } = useKioskSecurityStore();
  const [soundFeedback, setSoundFeedback] = useState(true);

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Укажите корпоративную почту для верификации');
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
      reason: reason || 'Смена устройства',
      comment: comment.trim() || undefined,
      contact: email,
    });

    setLastSubmittedId(newReq.id);
    setIsSuccessDialogOpen(true);
    toast.success(`Заявка ${newReq.id} передана в службу безопасности завода`);
    setComment('');
  };

  const item1 = ALL_AVAILABLE_NAV_ITEMS[slot1];
  const item2 = ALL_AVAILABLE_NAV_ITEMS[slot2];

  return (
    <div id="settings-container" className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            id="settings-back-button"
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 id="settings-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Настройки
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Персонализация и параметры инфокиоска
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 sm:p-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl sm:rounded-2xl shadow-2xs gap-1 sm:gap-1.5 h-11 sm:h-12 items-stretch">
          <TabsTrigger
            value="appearance"
            className="h-full rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm data-active:bg-white dark:data-active:bg-slate-900 data-active:text-[#002B7F] dark:data-active:text-blue-300 data-active:shadow-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center px-1 sm:px-3 transition-all text-center min-w-0 cursor-pointer select-none"
          >
            <span className="truncate max-w-full leading-none">
              <span className="hidden sm:inline">Тема и стиль</span>
              <span className="sm:hidden">Тема</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="navigation"
            className="h-full rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm data-active:bg-white dark:data-active:bg-slate-900 data-active:text-[#002B7F] dark:data-active:text-blue-300 data-active:shadow-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center px-1 sm:px-3 transition-all text-center min-w-0 cursor-pointer select-none"
          >
            <span className="truncate max-w-full leading-none">
              <span className="hidden sm:inline">Нижняя навигация</span>
              <span className="sm:hidden">Навигация</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="h-full rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm data-active:bg-white dark:data-active:bg-slate-900 data-active:text-[#002B7F] dark:data-active:text-blue-300 data-active:shadow-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center px-1 sm:px-3 transition-all text-center min-w-0 cursor-pointer select-none"
          >
            <span className="truncate max-w-full leading-none">
              <span className="hidden sm:inline">Пароль и QR-код</span>
              <span className="sm:hidden">Пароль и QR</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="kiosk"
            className="h-full rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm data-active:bg-white dark:data-active:bg-slate-900 data-active:text-[#002B7F] dark:data-active:text-blue-300 data-active:shadow-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center px-1 sm:px-3 transition-all text-center min-w-0 cursor-pointer select-none"
          >
            <span className="truncate max-w-full leading-none">
              Инфокиоск
            </span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 0: THEME & APPEARANCE */}
        <TabsContent value="appearance" className="mt-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs p-4 sm:p-6">
            <ThemeSettingsCard />
          </div>
        </TabsContent>

        {/* TAB 1: CUSTOM NAVIGATION DOCK */}
        <TabsContent value="navigation" className="mt-5 space-y-5">
          {/* Live Preview Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  Предпросмотр нижней панели инфокиоска
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Так панель быстрого доступа отображается внизу экрана
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  resetToDefaults();
                }}
                className="rounded-xl text-xs font-bold h-8 px-3 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                По умолчанию
              </Button>
            </div>

            {/* Mockup of bottom bar - matching the Layout dock exactly */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-1.5 sm:p-2.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div className="grid grid-cols-4 items-center gap-1.5 sm:gap-2.5 w-full">
                {/* 1. Fixed Home */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 py-1.5 sm:py-2 rounded-xl bg-[#D6E6F9] dark:bg-[#002B7F] text-[#002B7F] dark:text-white text-[10px] sm:text-xs font-bold min-w-0 text-center shadow-xs select-none">
                  <Home className="w-4 h-4 stroke-[2.2px] shrink-0" />
                  <span className="hidden sm:inline truncate">ГЛАВНОЕ МЕНЮ</span>
                  <span className="sm:hidden truncate max-w-full leading-tight">Главная</span>
                </div>

                {/* 2. Slot 1 dynamic */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-bold border border-slate-200/80 dark:border-slate-700/80 min-w-0 text-center shadow-2xs select-none">
                  {renderNavIcon(item1.iconName, 'w-4 h-4 stroke-[2.2px] shrink-0 text-[#002B7F] dark:text-[#60a5fa]')}
                  <span className="hidden sm:inline truncate">{item1.label}</span>
                  <span className="sm:hidden truncate max-w-full leading-tight">{item1.shortLabel || item1.label}</span>
                </div>

                {/* 3. Slot 2 dynamic */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-bold border border-slate-200/80 dark:border-slate-700/80 min-w-0 text-center shadow-2xs select-none">
                  {renderNavIcon(item2.iconName, 'w-4 h-4 stroke-[2.2px] shrink-0 text-[#002B7F] dark:text-[#60a5fa]')}
                  <span className="hidden sm:inline truncate">{item2.label}</span>
                  <span className="sm:hidden truncate max-w-full leading-tight">{item2.shortLabel || item2.label}</span>
                </div>

                {/* 4. Fixed Logout */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 py-1.5 sm:py-2 rounded-xl border-2 border-[#E53935] text-[#E53935] text-[10px] sm:text-xs font-bold min-w-0 text-center select-none">
                  <LogOut className="w-4 h-4 stroke-[2.2px] shrink-0" />
                  <span className="hidden sm:inline truncate">ВЫХОД</span>
                  <span className="sm:hidden truncate max-w-full leading-tight">Выход</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Touch Slot Choosers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Slot 1 Chooser */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs space-y-3.5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Кнопка слева
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Слот №1: <span className="hidden sm:inline">{item1.label}</span><span className="sm:hidden">{item1.shortLabel || item1.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(Object.keys(ALL_AVAILABLE_NAV_ITEMS) as NavItemKey[]).map((key) => {
                  const it = ALL_AVAILABLE_NAV_ITEMS[key];
                  const isSelected = slot1 === key;
                  return (
                    <button
                      key={`slot1-btn-${key}`}
                      type="button"
                      onClick={() => {
                        setSlot1(key);
                      }}
                      className={cn(
                        'p-2 sm:p-2.5 rounded-xl border text-left flex items-center gap-2 sm:gap-2.5 transition-all cursor-pointer min-h-[44px] min-w-0',
                        isSelected
                          ? 'bg-[#E8F1FC] dark:bg-blue-950/60 border-[#002B7F] dark:border-blue-500 text-[#002B7F] dark:text-blue-300 ring-1 ring-[#002B7F]/20'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                        isSelected
                          ? 'bg-[#002B7F] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      )}>
                        {renderNavIcon(it.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold truncate block">
                          <span className="hidden sm:inline">{it.label}</span>
                          <span className="sm:hidden">{it.shortLabel || it.label}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot 2 Chooser */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs space-y-3.5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Кнопка справа
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Слот №2: <span className="hidden sm:inline">{item2.label}</span><span className="sm:hidden">{item2.shortLabel || item2.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(Object.keys(ALL_AVAILABLE_NAV_ITEMS) as NavItemKey[]).map((key) => {
                  const it = ALL_AVAILABLE_NAV_ITEMS[key];
                  const isSelected = slot2 === key;
                  return (
                    <button
                      key={`slot2-btn-${key}`}
                      type="button"
                      onClick={() => {
                        setSlot2(key);
                      }}
                      className={cn(
                        'p-2 sm:p-2.5 rounded-xl border text-left flex items-center gap-2 sm:gap-2.5 transition-all cursor-pointer min-h-[44px] min-w-0',
                        isSelected
                          ? 'bg-[#E8F1FC] dark:bg-blue-950/60 border-[#002B7F] dark:border-blue-500 text-[#002B7F] dark:text-blue-300 ring-1 ring-[#002B7F]/20'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                        isSelected
                          ? 'bg-[#002B7F] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      )}>
                        {renderNavIcon(it.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold truncate block">
                          <span className="hidden sm:inline">{it.label}</span>
                          <span className="sm:hidden">{it.shortLabel || it.label}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PASSWORD & QR-CODE RECOVERY */}
        <TabsContent value="security" className="mt-5 space-y-6">
          {/* Security Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Служба безопасности ОАО «Беллакт»:</strong> При смене мобильного устройства или забытом пароле от аккаунта подайте официальную заявку. Временный код доступа будет направлен на корпоративную почту сотрудника после подтверждения службой безопасности.
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs">
            <form onSubmit={handleSecuritySubmit} className="space-y-5">
              {/* 1. Touch Type Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Тип восстанавливаемого доступа
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRequestType('qrcode')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer min-h-[48px]',
                      requestType === 'qrcode'
                        ? 'bg-[#E8F1FC] dark:bg-blue-950/70 border-[#002B7F] dark:border-blue-500 text-[#002B7F] dark:text-blue-300 ring-1 ring-[#002B7F]/20 dark:ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      requestType === 'qrcode'
                        ? 'bg-[#002B7F] dark:bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    )}>
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold">QR-код пропуска</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('password')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer min-h-[48px]',
                      requestType === 'password'
                        ? 'bg-[#E8F1FC] dark:bg-blue-950/70 border-[#002B7F] dark:border-blue-500 text-[#002B7F] dark:text-blue-300 ring-1 ring-[#002B7F]/20 dark:ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      requestType === 'password'
                        ? 'bg-[#002B7F] dark:bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    )}>
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold">Пароль аккаунта</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('2fa')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer min-h-[48px]',
                      requestType === '2fa'
                        ? 'bg-[#E8F1FC] dark:bg-blue-950/70 border-[#002B7F] dark:border-blue-500 text-[#002B7F] dark:text-blue-300 ring-1 ring-[#002B7F]/20 dark:ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      requestType === '2fa'
                        ? 'bg-[#002B7F] dark:bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    )}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold">Сброс привязки 2FA</div>
                  </button>
                </div>
              </div>

              {/* 2. Reason Preset Chips */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Причина обращения
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Замена смартфона',
                    'Смена мобильного устройства',
                    'Забыл пароль от системы',
                    'Подозрение на компрометацию',
                    'Плановый перевыпуск QR',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px]',
                        reason === r
                          ? 'bg-[#002B7F] dark:bg-[#0B4DA2] text-white border-[#002B7F] dark:border-blue-400 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Корпоративная почта для отправки кода
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.borodenya@bellakt.by"
                    className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 h-11 text-xs sm:text-sm font-semibold"
                    required
                  />
                </div>

                {/* Employee info badge */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Идентификатор сотрудника
                  </Label>
                  <div className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {employeeData?.full_name || 'Иванов Иван Иванович'} (Таб. № {employeeData?.tab_number || '20481'})
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Примечание для бюро пропусков (необязательно)
                </Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительные детали при необходимости..."
                  className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 min-h-[70px] text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl px-6 h-11 font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Подать официальный запрос</span>
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* TAB 3: KIOSK & SYSTEM SETTINGS */}
        <TabsContent value="kiosk" className="mt-5 space-y-4">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Автоматический выход при неактивности
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Защита персональных данных на общем сенсорном терминале
                </div>
              </div>
              <div className="grid grid-cols-4 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                {[
                  { value: '2', label: '2 мин' },
                  { value: '5', label: '5 мин' },
                  { value: '10', label: '10 мин' },
                  { value: 'never', label: 'Выкл' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAutoLogout(opt.value as '2' | '5' | '10' | 'never')}
                    className={cn(
                      'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                      autoLogout === opt.value
                        ? 'bg-white dark:bg-slate-700 text-[#002B7F] dark:text-blue-300 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2 gap-3">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Звуковой отклик интерфейса
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Подтверждение касания экрана и считывания QR пропуска
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSoundFeedback(!soundFeedback);
                }}
                className={cn(
                  'rounded-xl text-xs font-bold px-4 h-10 cursor-pointer min-w-[90px] sm:min-w-[100px] shrink-0',
                  soundFeedback
                    ? 'bg-[#E8F1FC] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 dark:border-slate-700'
                )}
              >
                {soundFeedback ? 'Включен' : 'Выключен'}
              </Button>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#E8F1FC] dark:bg-blue-950/70 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5 text-[#002B7F] dark:text-[#60a5fa]" />
              </div>
              <span className="font-medium leading-snug">
                Корпоративный портал Волковысского ОАО «Беллакт»
              </span>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 pl-8.5 sm:pl-0">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200/90 dark:border-slate-600/80 font-mono text-[11px] sm:text-xs font-semibold text-[#002B7F] dark:text-blue-300 shadow-2xs whitespace-nowrap">
                v2.4.2 (Сборка 2026)
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Modal for Security Request */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 mx-auto ring-4 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900 dark:text-white">
              Запрос успешно зарегистрирован
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
              Номер вашей официальной заявки: <strong className="text-slate-900 dark:text-white font-mono text-sm">{lastSubmittedId}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-700">
            <p>• Заявка направлена в отдел безопасности и бюро пропусков завода.</p>
            <p>• Временный код доступа или ссылка на новый QR-код электронного пропуска поступит на почту <strong>{email}</strong> после подтверждения оператором.</p>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl px-6 py-2 text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

