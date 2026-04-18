'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const COMPONENTS = [
  'Accordion',
  'Dialog',
  'Drawer',
  'Funnel',
  'Popover',
  'Select',
  'Toast',
] as const;

function linkClass(isActive: boolean) {
  return `block px-3 py-1.5 rounded-md text-sm transition-colors ${
    isActive
      ? 'bg-flame-accent-soft text-flame-accent font-medium'
      : 'text-flame-text-secondary hover:text-flame-text hover:bg-flame-bg-tertiary'
  }`;
}

function Sidebar() {
  const pathname = usePathname();
  const { locale } = useParams<{ locale: string }>();

  return (
    <nav className="w-60 shrink-0 border-r border-flame-border p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-flame-text-tertiary mb-2">
          Overview
        </h3>
        <Link href={`/${locale}/docs`} className={linkClass(pathname === `/${locale}/docs`)}>
          Getting Started
        </Link>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-flame-text-tertiary mb-2">
          Components
        </h3>
        <ul className="space-y-0.5">
          {COMPONENTS.map((name) => {
            const slug = name.toLowerCase();
            const href = `/${locale}/docs/components/${slug}`;

            return (
              <li key={name}>
                <Link href={href} className={linkClass(pathname === href)}>
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export { Sidebar };
