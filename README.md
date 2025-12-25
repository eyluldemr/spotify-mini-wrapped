# 🎵 Spotify Mini Wrapped

Your personal Spotify listening statistics, anytime. Discover your top artists, tracks, and musical journey without waiting for December!

![Mini Wrapped Dashboard](docs/screenshots/dashboard.png)

## ✨ Features

- **🎤 Top Artists & Tracks** - See who you've been listening to the most
- **📊 Genre Analysis** - Discover your musical taste through detailed genre breakdown
- **🔍 Monthly Discoveries** - Find tracks you discovered in the last 30 days
- **⏱️ Time Range Filters** - View stats for last 4 weeks, 6 months, or all time
- **📤 Share Card** - Generate beautiful shareable images of your stats
- **🎶 Create Playlist** - Turn your top tracks into a Spotify playlist

## 📸 Screenshots

<table>
  <tr>
    <td><img src="docs/screenshots/login.png" alt="Login" width="250"/></td>
    <td><img src="docs/screenshots/dashboard.png" alt="Dashboard" width="250"/></td>
    <td><img src="docs/screenshots/tracks.png" alt="Top Tracks" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><b>Login Page</b></td>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Top Tracks</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/discoveries.png" alt="Discoveries" width="250"/></td>
    <td><img src="docs/screenshots/genres.png" alt="Genres" width="250"/></td>
    <td></td>
  </tr>
  <tr>
    <td align="center"><b>Monthly Discoveries</b></td>
    <td align="center"><b>Genre Analysis</b></td>
    <td></td>
  </tr>
</table>

## 🛠️ Tech Stack

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Passport.js** - Spotify OAuth authentication
- **JWT** - Token-based authentication

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **html2canvas** - Image generation

## 🚀 Live Demo

**[Try it now →](https://spotify-mini-wrapped.vercel.app)**

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Spotify Developer Account

### 1. Clone the repository
```bash
git clone https://github.com/eyluldemr/spotify-mini-wrapped.git
cd spotify-mini-wrapped
```

### 2. Backend Setup
```bash
cd apps/backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npm run start:dev
```

### 3. Frontend Setup
```bash
cd apps/frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/spotify_wrapped
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_CALLBACK_URL=http://localhost:4000/auth/spotify/callback
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎯 Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:4000/auth/spotify/callback` to Redirect URIs
4. Copy Client ID and Client Secret to your `.env` file

## 📝 License

MIT License - feel free to use this project for your portfolio!

## 👤 Author

Made with ❤️ by [Eylül Demir](https://github.com/eyluldemr)
