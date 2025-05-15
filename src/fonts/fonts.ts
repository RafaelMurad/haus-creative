import { Inter, Space_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// Using Inter as an alternative to Diatype
export const diatype = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-diatype',
});

// Using Space Mono as an alternative to Monument Grotesk Mono
export const monumentGroteskMono = Space_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-monument-grotesk-mono',
});

// Keep the times font for backward compatibility
export const times = localFont({
    src: './times.ttf',
    variable: '--font-times',
    display: 'swap',
});