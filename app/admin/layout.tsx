import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Saad Traders',
  description: 'Admin panel for managing Saad Traders operations',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
