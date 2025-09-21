'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '../theme-provider';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '../ui/toaster';
import { cn } from '../../lib/utils';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export function MainLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1 pt-16">{children}</main>
                        <Footer />
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
