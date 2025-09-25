import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
    title: '멍냥',
    description: '반려동물 품종 믹스를 추정하는 웹앱',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
