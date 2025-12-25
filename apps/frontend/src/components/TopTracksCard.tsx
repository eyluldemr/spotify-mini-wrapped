'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Music2, Play, Pause } from 'lucide-react';
import { TopTrack } from '@/lib/api';
import { clsx } from 'clsx';

interface TopTracksCardProps {
    tracks: TopTrack[];
}

export default function TopTracksCard({ tracks }: TopTracksCardProps) {
    const [playing, setPlaying] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    function handlePlayPreview(track: TopTrack) {
        if (!track.previewUrl) return;

        if (playing === track.id) {
            audioRef.current?.pause();
            setPlaying(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(track.previewUrl);
            audioRef.current.volume = 0.3;
            audioRef.current.play();
            audioRef.current.onended = () => setPlaying(null);
            setPlaying(track.id);
        }
    }

    function formatDuration(ms: number | null): string {
        if (!ms) return '--:--';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (tracks.length === 0) {
        return (
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-purple-400" />
                    Top Tracks
                </h2>
                <p className="text-gray-400 text-center py-8">
                    Henüz veri yok. Verilerinizi yenilemek için butona tıklayın.
                </p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Music2 className="w-5 h-5 text-purple-400" />
                Top Tracks
            </h2>

            <div className="space-y-3">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        {/* Rank */}
                        <div
                            className={clsx(
                                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-black',
                                track.rank === 1 && 'rank-1',
                                track.rank === 2 && 'rank-2',
                                track.rank === 3 && 'rank-3',
                                track.rank > 3 && 'rank-badge'
                            )}
                        >
                            {track.rank}
                        </div>

                        {/* Album Art with Play Button */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-spotify-gray-medium flex-shrink-0 group/play">
                            {track.albumImage ? (
                                <Image
                                    src={track.albumImage}
                                    alt={track.albumName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Music2 className="w-6 h-6 text-gray-500" />
                                </div>
                            )}

                            {/* Play overlay */}
                            {track.previewUrl && (
                                <button
                                    onClick={() => handlePlayPreview(track)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/play:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    {playing === track.id ? (
                                        <Pause className="w-5 h-5 text-white" />
                                    ) : (
                                        <Play className="w-5 h-5 text-white ml-0.5" />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.name}</p>
                            <p className="text-sm text-gray-400 truncate">{track.artistName}</p>
                        </div>

                        {/* Duration */}
                        <span className="text-sm text-gray-500 hidden sm:block">
                            {formatDuration(track.durationMs)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
