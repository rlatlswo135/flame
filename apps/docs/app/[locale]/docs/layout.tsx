import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Header } from '@/app/[locale]/_navigation/header';
import { Sidebar } from '@/app/[locale]/_navigation/sidebar';

export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
