import React from 'react';
import { Sun, Moon, Laptop, Check, RefreshCw } from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();

  const handleSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          Тема оформления интерфейса
        </div>
      </div>

      {/* 3 Option Segmented Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Светлая */}
        <button
          type="button"
          onClick={() => handleSelect('light')}
          className={cn(
            'relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3',
            theme === 'light'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#002B7F] dark:border-[#3b82f6] shadow-xs ring-1 ring-[#002B7F]/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                theme === 'light'
                  ? 'bg-[#002B7F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              <Sun className="w-5 h-5" />
            </div>
            {theme === 'light' && (
              <span className="w-5 h-5 rounded-full bg-[#002B7F] dark:bg-[#3b82f6] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3px]" />
              </span>
            )}
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">
            Светлая тема
          </div>
        </button>

        {/* 2. Тёмная */}
        <button
          type="button"
          onClick={() => handleSelect('dark')}
          className={cn(
            'relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3',
            theme === 'dark'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#002B7F] dark:border-[#3b82f6] shadow-xs ring-1 ring-[#002B7F]/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                theme === 'dark'
                  ? 'bg-[#002B7F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              <Moon className="w-5 h-5" />
            </div>
            {theme === 'dark' && (
              <span className="w-5 h-5 rounded-full bg-[#002B7F] dark:bg-[#3b82f6] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3px]" />
              </span>
            )}
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">
            Тёмная тема
          </div>
        </button>

        {/* 3. Системная */}
        <button
          type="button"
          onClick={() => handleSelect('system')}
          className={cn(
            'relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3',
            theme === 'system'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#002B7F] dark:border-[#3b82f6] shadow-xs ring-1 ring-[#002B7F]/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                theme === 'system'
                  ? 'bg-[#002B7F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              <Laptop className="w-5 h-5" />
            </div>
            {theme === 'system' && (
              <span className="w-5 h-5 rounded-full bg-[#002B7F] dark:bg-[#3b82f6] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3px]" />
              </span>
            )}
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Системная</span>
            <span className="text-[10px] font-semibold bg-[#D6E6F9] dark:bg-blue-900/60 text-[#002B7F] dark:text-blue-200 px-1.5 py-0.5 rounded">
              АВТО
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export function ThemeQuickToggleButton({ className }: { className?: string }) {
  const { theme, toggleTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        toggleTheme();
      }}
      className={cn(
        'p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#002B7F] dark:hover:text-[#60a5fa] hover:border-[#002B7F] dark:hover:border-[#60a5fa] transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold group',
        className
      )}
      title="Переключить тему оформления (Светлая / Тёмная / Системная)"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
      )}
      <span className="hidden sm:inline">
        {theme === 'system' ? 'Тема: Авто' : theme === 'dark' ? 'Тёмная' : 'Светлая'}
      </span>
    </button>
  );
}
