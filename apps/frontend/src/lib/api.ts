const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// Types
export interface User {
    id: string;
    spotifyId: string;
    email: string | null;
    displayName: string | null;
    profileImage: string | null;
    createdAt: string;
}

export interface TopArtist {
    id: string;
    spotifyId: string;
    name: string;
    imageUrl: string | null;
    genres: string[];
    popularity: number;
    rank: number;
}

export interface TopTrack {
    id: string;
    spotifyId: string;
    name: string;
    artistName: string;
    albumName: string;
    albumImage: string | null;
    previewUrl: string | null;
    durationMs: number | null;
    rank: number;
}

export interface GenreDistribution {
    genre: string;
    count: number;
    percentage: number;
}

export interface DashboardStats {
    topArtist: { name: string; image: string | null } | null;
    topTrack: { name: string; artist: string; image: string | null } | null;
    totalListens: number;
    topGenre: string | null;
    genreCount: number;
}

export interface Discovery {
    trackId: string;
    trackName: string;
    artistName: string;
    albumImage: string | null;
    firstPlayedAt: string;
    playCount: number;
}

// API functions
export const api = {
    // Auth
    getMe: () => fetchApi<User>('/auth/me'),

    // Spotify data
    getTopArtists: (timeRange: string = 'MEDIUM_TERM') =>
        fetchApi<TopArtist[]>(`/spotify/top-artists?timeRange=${timeRange}`),

    getTopTracks: (timeRange: string = 'MEDIUM_TERM') =>
        fetchApi<TopTrack[]>(`/spotify/top-tracks?timeRange=${timeRange}`),

    refreshData: () => fetchApi<{ success: boolean }>('/spotify/refresh', { method: 'POST' }),

    // Analytics
    getGenres: (timeRange: string = 'MEDIUM_TERM') =>
        fetchApi<GenreDistribution[]>(`/analytics/genres?timeRange=${timeRange}`),

    getDiscoveries: () => fetchApi<Discovery[]>('/analytics/discoveries'),

    getDashboardStats: () => fetchApi<DashboardStats>('/analytics/dashboard'),

    createPlaylist: (timeRange: string = 'MEDIUM_TERM', name?: string) => {
        const params = new URLSearchParams({ timeRange });
        if (name) params.append('name', name);
        return fetchApi<{ playlistId: string; playlistUrl: string; trackCount: number; name: string }>(
            `/spotify/create-playlist?${params}`,
            { method: 'POST' }
        );
    },
};

export type TimeRange = 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
    SHORT_TERM: 'Son 4 Hafta',
    MEDIUM_TERM: 'Son 6 Ay',
    LONG_TERM: 'Tüm Zamanlar',
};
