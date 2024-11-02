import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Fattocs - Sistema de Tarefas',
  description: 'Sistema de tarefas simples para organizar suas atividades diárias.',
  authors: [{name: 'DRYPZZ DEV', url: 'https://drypzz.netlify.app'}],
  creator: 'DRYPZZ DEV',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body>
        {children}
      </body>
    </html>
  );
}
