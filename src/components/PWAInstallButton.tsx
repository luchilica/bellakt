import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <Button
        onClick={install}
        className="w-full bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl py-6 cursor-pointer transition-colors shadow-xs"
      >
        <Download className="mr-2 h-5 w-5" />
        Установить приложение
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowIOSGuide(true)}
          className="w-full rounded-xl py-6 border-[#0052CC] text-[#0052CC]"
        >
          <Download className="mr-2 h-5 w-5" />
          Установить на iPhone
        </Button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">Установка на iPhone / iPad</h3>
              <p className="mt-4 text-sm text-[#666666] dark:text-slate-300 leading-relaxed">
                1. Нажмите кнопку <strong>Поделиться</strong> в панели Safari (квадрат со стрелкой вверх).<br /><br />
                2. Прокрутите вниз и выберите <strong>«На экран Домой»</strong> (Add to Home Screen).
              </p>
              <Button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                variant="secondary"
              >
                Понятно
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
