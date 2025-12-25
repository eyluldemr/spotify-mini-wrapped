import { clsx } from 'clsx';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: 'green' | 'purple' | 'yellow' | 'blue';
}

const colorClasses = {
    green: 'bg-spotify-green/20 text-spotify-green',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
};

export default function StatsCard({ icon, label, value, color }: StatsCardProps) {
    return (
        <div className="glass rounded-xl p-4 card-hover">
            <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colorClasses[color])}>
                {icon}
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
            <p className="font-semibold text-lg truncate">{value}</p>
        </div>
    );
}
