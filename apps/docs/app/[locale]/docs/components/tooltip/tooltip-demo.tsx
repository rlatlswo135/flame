'use client';

import { Tooltip } from '@flame/ui';
import { useTranslations } from 'next-intl';

const TooltipDemo = () => {
  const t = useTranslations('components.tooltip.demo');

  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <Tooltip.Trigger>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-flame-accent text-white hover:opacity-90 transition-opacity"
          >
            {t('hoverMe')}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <div className="bg-amber-100 text-black rounded-lg px-6 py-3">{t('tooltipText')}</div>
        </Tooltip.Content>
      </Tooltip>

      <Tooltip enabled={false}>
        <Tooltip.Trigger>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-flame-border text-flame-text hover:bg-flame-bg-secondary transition-colors"
          >
            {t('disabled')}
          </button>
        </Tooltip.Trigger>
      </Tooltip>
    </div>
  );
};

export { TooltipDemo };
