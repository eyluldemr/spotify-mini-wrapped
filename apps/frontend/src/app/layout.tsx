import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: 'Spotify Mini Wrapped',
    description: 'Discover your personal Spotify listening statistics',
    icons: {
        icon: '/spotify-icon.svg',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${outfit.variable} font-sans antialiased text-white`}>
                {children}
            </body>
        </html>
    );
}
