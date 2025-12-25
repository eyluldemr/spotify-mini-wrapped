import Link from 'next/link';
import { Music, BarChart3, Sparkles, Clock } from 'lucide-react';

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    return (
        <main className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
                {/* Background gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-spotify-green/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-spotify-green rounded-full flex items-center justify-center spotify-glow animate-pulse-slow">
                                <Music className="w-12 h-12 text-black" />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-spotify-green via-green-400 to-emerald-300 bg-clip-text text-transparent">
                        Mini Wrapped
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        Discover your personal Spotify listening statistics anytime.
                        See your top artists, tracks, and musical journey.
                    </p>

                    {/* Login Button */}
                    <a
                        href={`${apiUrl}/auth/spotify`}
                        className="inline-flex items-center gap-3 bg-spotify-green hover:bg-spotify-green-dark text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 spotify-glow hover:scale-105"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        Login with Spotify
                    </a>

                    {/* Features */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart3 className="w-8 h-8" />}
                            title="Top Artists & Tracks"
                            description="See who you've been listening to the most across different time periods"
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-8 h-8" />}
                            title="Genre Analysis"
                            description="Discover your musical taste through detailed genre breakdowns"
                        />
                        <FeatureCard
                            icon={<Clock className="w-8 h-8" />}
                            title="Monthly Discoveries"
                            description="Track the new songs and artists you've discovered"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-8 text-gray-500 text-sm">
                <p>Built with 💚 for music lovers</p>
                <p className="mt-2">Not affiliated with Spotify AB</p>
            </footer>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="glass rounded-2xl p-6 card-hover">
            <div className="w-14 h-14 bg-spotify-green/20 rounded-xl flex items-center justify-center text-spotify-green mb-4 mx-auto">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
}
