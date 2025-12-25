'use client';

import { useRef, useState } from 'react';
import { Download, Share2, X, Loader2 } from 'lucide-react';
import { TopArtist, TopTrack, TimeRange, TIME_RANGE_LABELS, api } from '@/lib/api';

interface ShareCardProps {
    user: { displayName: string | null; profileImage: string | null };
    topArtists: TopArtist[];
    topTracks: TopTrack[];
    topGenre: string | null;
    timeRange: TimeRange;
    onClose: () => void;
}

export default function ShareCard({ user, topArtists, topTracks, topGenre, timeRange, onClose }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [creating, setCreating] = useState(false);
    const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

    async function handleDownload() {
        if (!cardRef.current) return;

        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: '#121212',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
        });

        const link = document.createElement('a');
        link.download = `mini-wrapped-${timeRange.toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    async function handleCreatePlaylist() {
        setCreating(true);
        try {
            const result = await api.createPlaylist(timeRange);
            setPlaylistUrl(result.playlistUrl);
        } catch (error) {
            console.error('Playlist oluşturulamadı:', error);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative max-w-md w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-spotify-gray-medium hover:bg-spotify-gray-light rounded-full flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div
                    ref={cardRef}
                    className="rounded-2xl overflow-hidden p-6"
                    style={{
                        background: 'linear-gradient(180deg, #1a1a2e 0%, #121212 100%)',
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-spotify-green text-sm font-medium">Mini Wrapped</p>
                            <p className="text-gray-400 text-xs">{TIME_RANGE_LABELS[timeRange]}</p>
                        </div>
                        {user.profileImage && (
                            <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full" />
                        )}
                    </div>

                    <h2 className="text-xl font-bold mb-4">{user.displayName}&apos;s Top 5</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase mb-2">Sanatçılar</p>
                            <div className="space-y-2">
                                {topArtists.slice(0, 5).map((artist, i) => (
                                    <div key={artist.id} className="flex items-center gap-2">
                                        <span className="text-spotify-green font-bold text-xs w-4">{i + 1}</span>
                                        {artist.imageUrl && (
                                            <img src={artist.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        )}
                                        <p className="text-xs truncate flex-1">{artist.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-400 text-[10px] uppercase mb-2">Şarkılar</p>
                            <div className="space-y-2">
                                {topTracks.slice(0, 5).map((track, i) => (
                                    <div key={track.id} className="flex items-center gap-2">
                                        <span className="text-spotify-green font-bold text-xs w-4">{i + 1}</span>
                                        {track.albumImage && (
                                            <img src={track.albumImage} alt="" className="w-8 h-8 rounded object-cover" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs truncate">{track.name}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{track.artistName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {topGenre && (
                        <div className="text-center mt-4 pt-3 border-t border-white/10">
                            <p className="text-gray-400 text-[10px] uppercase">Top Genre</p>
                            <p className="text-base font-bold text-spotify-green">{topGenre}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition"
                    >
                        <Download className="w-5 h-5" />
                        İndir
                    </button>

                    {playlistUrl ? (
                        <a
                            href={playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-spotify-green text-black font-medium rounded-full hover:brightness-110 transition"
                        >
                            <Share2 className="w-5 h-5" />
                            Spotify&apos;da Aç
                        </a>
                    ) : (
                        <button
                            onClick={handleCreatePlaylist}
                            disabled={creating}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-spotify-green text-black font-medium rounded-full hover:brightness-110 transition disabled:opacity-50"
                        >
                            {creating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Share2 className="w-5 h-5" />
                            )}
                            Playlist Oluştur
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
