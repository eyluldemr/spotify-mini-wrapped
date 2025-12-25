'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Music2, Calendar } from 'lucide-react';
import { api, Discovery } from '@/lib/api';

export default function DiscoveriesPage() {
    const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDiscoveries();
    }, []);

    async function loadDiscoveries() {
        try {
            const data = await api.getDiscoveries();
            setDiscoveries(data);
        } catch (error) {
            console.error('Failed to load discoveries:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Dashboard'a Dön
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Bu Ay Keşiflerin</h1>
                        <p className="text-gray-400">Son 30 günde ilk kez dinlediğin şarkılar</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            {discoveries.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Henüz keşif yok</h2>
                    <p className="text-gray-400">
                        Bu ay yeni bir şarkı keşfettiğinde burada görünecek.
                        <br />
                        Spotify'da yeni şarkılar dinlemeye başla!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discoveries.map((discovery, index) => (
                        <div
                            key={discovery.trackId}
                            className="glass rounded-xl p-4 card-hover group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Album Art */}
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-spotify-gray-medium flex-shrink-0">
                                    {discovery.albumImage ? (
                                        <Image
                                            src={discovery.albumImage}
                                            alt={discovery.trackName}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Music2 className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{discovery.trackName}</p>
                                    <p className="text-sm text-gray-400 truncate">{discovery.artistName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-spotify-green font-medium">
                                            {discovery.playCount}x dinledin
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(discovery.firstPlayedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
