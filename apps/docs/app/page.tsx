import { redirect } from 'next/navigation';
import { routing } from '@/src/features/i18n/routing';

export default function RootPage() {
  redirect(routing.defaultLocale);
}
