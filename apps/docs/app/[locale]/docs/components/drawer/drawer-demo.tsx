'use client';

import { Drawer } from '@flame/ui';
import { useTranslations } from 'next-intl';

const DrawerDemo = () => {
  const t = useTranslations('components.drawer.demo');

  return (
    <div className="flex items-center gap-3">
      {(['right', 'left', 'top', 'bottom'] as const).map((placement) => (
        <Drawer key={placement} placement={placement}>
          <Drawer.Trigger>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-flame-accent text-white hover:opacity-90 transition-opacity"
            >
              {placement}
            </button>
          </Drawer.Trigger>
          <Drawer.Content
            className={`fixed bg-flame-bg border border-flame-border shadow-2xl ${
              placement === 'right' ? 'top-0 right-0 h-full w-80' :
              placement === 'left' ? 'top-0 left-0 h-full w-80' :
              placement === 'top' ? 'top-0 left-0 w-full h-48' :
              'bottom-0 left-0 w-full h-48'
            }`}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-flame-text mb-2">
                {t('title')}
              </h2>
              <p className="text-sm text-flame-text-secondary mb-6">
                {t('description')}
              </p>
              <Drawer.Closer>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-flame-border text-flame-text hover:bg-flame-bg-secondary transition-colors"
                >
                  {t('close')}
                </button>
              </Drawer.Closer>
            </div>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  );
};

export { DrawerDemo };
