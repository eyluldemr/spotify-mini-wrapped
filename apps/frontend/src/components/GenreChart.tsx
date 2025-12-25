'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { GenreDistribution } from '@/lib/api';

interface GenreChartProps {
    genres: GenreDistribution[];
}

const COLORS = [
    '#1DB954', // Spotify Green
    '#1ed760',
    '#2ecc71',
    '#9b59b6',
    '#8e44ad',
    '#3498db',
    '#2980b9',
    '#e74c3c',
    '#f39c12',
    '#e67e22',
    '#1abc9c',
    '#16a085',
    '#f1c40f',
    '#d35400',
    '#c0392b',
];

export default function GenreChart({ genres }: GenreChartProps) {
    if (genres.length === 0) {
        return (
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-yellow-400" />
                    Genre Dağılımı
                </h2>
                <p className="text-gray-400 text-center py-8">
                    Henüz genre verisi yok. Verilerinizi yenilemek için butona tıklayın.
                </p>
            </div>
        );
    }

    const chartData = genres.slice(0, 10).map((g, i) => ({
        name: g.genre.charAt(0).toUpperCase() + g.genre.slice(1),
        value: g.percentage,
        count: g.count,
    }));

    return (
        <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-yellow-400" />
                Genre Dağılımı
            </h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 100, bottom: 0 }}
                    >
                        <XAxis
                            type="number"
                            domain={[0, 'auto']}
                            tickFormatter={(v) => `${v}%`}
                            stroke="#666"
                            fontSize={12}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#999"
                            fontSize={12}
                            width={90}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#282828',
                                border: '1px solid #535353',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Oran']}
                            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            animationDuration={1000}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Genre Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
                {genres.slice(0, 15).map((genre, index) => (
                    <span
                        key={genre.genre}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                            backgroundColor: `${COLORS[index % COLORS.length]}20`,
                            color: COLORS[index % COLORS.length],
                        }}
                    >
                        {genre.genre}
                    </span>
                ))}
            </div>
        </div>
    );
}
