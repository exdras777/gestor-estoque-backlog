import type { Metadata } from 'next';
import '@/frontend/styles/globals.css';

export const metadata: Metadata = {
  title: 'StockManager — Controle de Inventário',
  description: 'Gerencie seu inventário com precisão e eficiência.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
