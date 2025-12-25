# Deployment Guide - Spotify Mini Wrapped

## Frontend → Vercel

1. **GitHub'a push et:**
   ```bash
   cd spotify-mini-wrapped
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/spotify-mini-wrapped.git
   git push -u origin main
   ```

2. **Vercel'de:**
   - https://vercel.com/new
   - GitHub repo'yu import et
   - Framework: **Next.js**
   - Root Directory: `apps/frontend`
   - Environment Variables ekle:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```
   - Deploy!

---

## Backend → Railway

1. **Railway'de:**
   - https://railway.app/new
   - GitHub repo'yu bağla
   - **PostgreSQL** servisi ekle
   - **Redis** servisi ekle
   - Root Directory: `apps/backend`

2. **Environment Variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_HOST=${{Redis.REDISHOST}}
   REDIS_PORT=${{Redis.REDISPORT}}
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_CALLBACK_URL=https://your-backend.railway.app/auth/spotify/callback
   JWT_SECRET=generate_a_secure_random_string
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=4000
   ```

3. **Build Command:** `npm install && npx prisma migrate deploy && npm run build`

4. **Start Command:** `npm run start:prod`

---

## Spotify Dashboard Güncellemesi

Production'da Redirect URI'yi güncelle:
```
https://your-backend.railway.app/auth/spotify/callback
```

---

## Checklist

- [ ] GitHub'a push
- [ ] Railway'de backend deploy
- [ ] Vercel'de frontend deploy  
- [ ] Environment variables ayarla
- [ ] Spotify Dashboard'da production redirect URI ekle
- [ ] Test et!
