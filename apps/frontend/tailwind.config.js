/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                spotify: {
                    green: '#1DB954',
                    'green-dark': '#1ed760',
                    black: '#121212',
                    'gray-dark': '#181818',
                    'gray-medium': '#282828',
                    'gray-light': '#535353',
                    white: '#FFFFFF',
                },
            },
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'spotify-gradient': 'linear-gradient(180deg, rgba(29, 185, 84, 0.4) 0%, transparent 100%)',
            },
        },
    },
    plugins: [],
};
