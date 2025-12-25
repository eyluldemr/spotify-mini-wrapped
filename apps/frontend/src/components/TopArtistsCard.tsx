import Image from 'next/image';
import { Mic2 } from 'lucide-react';
import { TopArtist } from '@/lib/api';
import { clsx } from 'clsx';

interface TopArtistsCardProps {
    artists: TopArtist[];
}

export default function TopArtistsCard({ artists }: TopArtistsCardProps) {
    if (artists.length === 0) {
        return (
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Mic2 className="w-5 h-5 text-spotify-green" />
                    Top Artists
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
                <Mic2 className="w-5 h-5 text-spotify-green" />
                Top Artists
            </h2>

            <div className="space-y-3">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        {/* Rank */}
                        <div
                            className={clsx(
                                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-black',
                                artist.rank === 1 && 'rank-1',
                                artist.rank === 2 && 'rank-2',
                                artist.rank === 3 && 'rank-3',
                                artist.rank > 3 && 'rank-badge'
                            )}
                        >
                            {artist.rank}
                        </div>

                        {/* Image */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-spotify-gray-medium flex-shrink-0">
                            {artist.imageUrl ? (
                                <Image
                                    src={artist.imageUrl}
                                    alt={artist.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Mic2 className="w-6 h-6 text-gray-500" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{artist.name}</p>
                            <p className="text-sm text-gray-400 truncate">
                                {artist.genres.slice(0, 2).join(', ') || 'No genres'}
                            </p>
                        </div>

                        {/* Popularity */}
                        <div className="hidden sm:block">
                            <div className="w-16 h-2 bg-spotify-gray-medium rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-spotify-green rounded-full"
                                    style={{ width: `${artist.popularity}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
