'use client';

import { useTranslations } from 'next-intl';

const DrawerDemo = () => {
  const t = useTranslations('components.drawer.demo');

  return (
    <div className="flex items-center justify-center px-4 py-10 text-sm text-flame-text-secondary">
      {t('comingSoon')}
    </div>
  );
};

export { DrawerDemo };
