'use client';

import { Popover } from '@flame/ui';
import { useTranslations } from 'next-intl';

const PopoverDemo = () => {
  const t = useTranslations('components.popover.demo');

  return (
    <Popover transition>
      <Popover.Trigger>
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
        >
          {t('openPopover')}
        </button>
      </Popover.Trigger>
      <Popover.Content className="rounded-xl border border-flame-border shadow-lg bg-flame-bg p-5 max-w-xs">
        <h3 className="text-sm font-semibold text-flame-text mb-1">{t('popoverTitle')}</h3>
        <p className="text-sm text-flame-text-secondary">{t('popoverDescription')}</p>
      </Popover.Content>
    </Popover>
  );
};

export { PopoverDemo };
