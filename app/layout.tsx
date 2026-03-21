import type { Metadata } from 'next';
import ThemeRegistry from '../theme/ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habu - Welcome Back',
  description: 'Login to your Habu account',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}