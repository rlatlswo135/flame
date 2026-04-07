'use client';

import { Dialog } from '@flame/ui';
import { useTranslations } from 'next-intl';

const DialogDemo = () => {
  const t = useTranslations('components.dialog.demo');

  return (
    <Dialog closeOutside>
      <Dialog.Trigger>
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
        >
          {t('openDialog')}
        </button>
      </Dialog.Trigger>
      <Dialog.Content className="rounded-xl border border-flame-border shadow-2xl bg-flame-bg text-flame-text backdrop:bg-black/40 p-0 max-w-[420px] w-[90vw]">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-2">{t('welcomeTitle')}</h2>
          <p className="text-sm text-flame-text-secondary mb-6">{t('welcomeDescription')}</p>
          <div className="flex justify-end gap-3">
            <Dialog.Closer>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-flame-bg-tertiary text-flame-text-secondary hover:text-flame-text transition-colors"
              >
                {t('cancel')}
              </button>
            </Dialog.Closer>
            <Dialog.Closer>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
              >
                {t('confirm')}
              </button>
            </Dialog.Closer>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export { DialogDemo };
