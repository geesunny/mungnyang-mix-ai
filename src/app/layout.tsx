import type { Metadata } from 'next';

import './globals.css';
import BackgroundPaws from './components/BackgroundPaws';

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
        <html lang="ko">
            <body>
                {' '}
                <BackgroundPaws>{children}</BackgroundPaws>
            </body>
        </html>
    );
}
