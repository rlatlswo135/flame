'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { I18nSwitcher } from '@/src/features/i18n/i18n-switcher';
import { ThemeToggle } from '@/src/features/theme/theme-toggle';

function Header() {
  const pathname = usePathname();
  const { locale } = useParams<{ locale: string }>();

  const isMainPage = pathname === `/${locale}`;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 border-b border-flame-border bg-flame-bg/80 backdrop-blur-sm">
      <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold text-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="text-flame-accent"
        >
          <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12z" fill="currentColor" />
          {!isMainPage && (
            <path
              d="M12 8c-2 3-4 5-4 7a4 4 0 0 0 8 0c0-2-2-4-4-7z"
              className="fill-flame-accent-soft"
            />
          )}
        </svg>
        <span>Flame</span>
      </Link>
      <div className="flex items-center gap-1">
        <I18nSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}

export { Header };
