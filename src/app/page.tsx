import { redirect } from 'next/navigation';

// This page should redirect to the default locale
export default function RootPage() {
  redirect('/en');
}
