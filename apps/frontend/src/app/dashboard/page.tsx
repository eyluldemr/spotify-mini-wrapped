'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    RefreshCw,
    LogOut,
    Music2,
    Mic2,
    Clock,
    Sparkles,
    ChevronDown,
    Share2
} from 'lucide-react';
import {
    api,
    User,
    TopArtist,
    TopTrack,
    GenreDistribution,
    DashboardStats,
    TimeRange,
    TIME_RANGE_LABELS
} from '@/lib/api';
import TopArtistsCard from '@/components/TopArtistsCard';
import TopTracksCard from '@/components/TopTracksCard';
import GenreChart from '@/components/GenreChart';
import StatsCard from '@/components/StatsCard';
import ShareCard from '@/components/ShareCard';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('MEDIUM_TERM');
    const [showShareCard, setShowShareCard] = useState(false);

    const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
    const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
    const [genres, setGenres] = useState<GenreDistribution[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, timeRange]);

    async function loadUser() {
        try {
            const userData = await api.getMe();
            setUser(userData);
        } catch (error) {
            // Redirect to login if not authenticated
            window.location.href = '/';
        } finally {
            setLoading(false);
        }
    }

    async function loadData() {
        try {
            const [artistsData, tracksData, genresData, statsData] = await Promise.all([
                api.getTopArtists(timeRange),
                api.getTopTracks(timeRange),
                api.getGenres(timeRange),
                api.getDashboardStats(),
            ]);

            setTopArtists(artistsData);
            setTopTracks(tracksData);
            setGenres(genresData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    async function handleRefresh() {
        setRefreshing(true);
        try {
            await api.refreshData();
            await loadData();
        } catch (error) {
            console.error('Failed to refresh:', error);
        } finally {
            setRefreshing(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    {user.profileImage && (
                        <Image
                            src={user.profileImage}
                            alt={user.displayName || 'Profile'}
                            width={56}
                            height={56}
                            className="rounded-full ring-2 ring-spotify-green"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">Merhaba, {user.displayName} 👋</h1>
                        <p className="text-gray-400 text-sm">Mini Wrapped Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Time Range Selector */}
                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="appearance-none bg-spotify-gray-medium text-white py-2 px-4 pr-10 rounded-full text-sm font-medium cursor-pointer hover:bg-spotify-gray-light transition-colors"
                        >
                            {Object.entries(TIME_RANGE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 rounded-full bg-spotify-gray-medium hover:bg-spotify-gray-light transition-colors disabled:opacity-50"
                        title="Verileri yenile"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => setShowShareCard(true)}
                        className="p-2 rounded-full bg-spotify-green text-black hover:brightness-110 transition"
                        title="Paylaş"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    <a
                        href={`${apiUrl}/auth/logout`}
                        className="p-2 rounded-full bg-spotify-gray-medium hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Çıkış yap"
                    >
                        <LogOut className="w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        icon={<Mic2 className="w-5 h-5" />}
                        label="Top Artist"
                        value={stats.topArtist?.name || '-'}
                        color="green"
                    />
                    <StatsCard
                        icon={<Music2 className="w-5 h-5" />}
                        label="Top Track"
                        value={stats.topTrack?.name || '-'}
                        color="purple"
                    />
                    <StatsCard
                        icon={<Sparkles className="w-5 h-5" />}
                        label="Top Genre"
                        value={stats.topGenre || '-'}
                        color="yellow"
                    />
                    <StatsCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Kayıtlı Dinleme"
                        value={stats.totalListens.toString()}
                        color="blue"
                    />
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Artists */}
                <TopArtistsCard artists={topArtists.slice(0, 10)} />

                {/* Top Tracks */}
                <TopTracksCard tracks={topTracks.slice(0, 10)} />

                {/* Discoveries Link */}
                <a
                    href="/dashboard/discoveries"
                    className="lg:col-span-2 glass rounded-2xl p-6 card-hover flex items-center justify-between group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Bu Ay Keşiflerin</h3>
                            <p className="text-gray-400">Son 30 günde keşfettiğin yeni şarkıları gör</p>
                        </div>
                    </div>
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors -rotate-90" />
                </a>

                {/* Genre Distribution */}
                <div className="lg:col-span-2">
                    <GenreChart genres={genres} />
                </div>
            </div>

            {showShareCard && user && (
                <ShareCard
                    user={user}
                    topArtists={topArtists}
                    topTracks={topTracks}
                    topGenre={stats?.topGenre || null}
                    timeRange={timeRange}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </div>
    );
}
