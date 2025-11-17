# Deploy Mari Aktif ke Vercel

## Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Langkah 2: Login ke Vercel

```bash
vercel login
```

Pilih metode login:
- GitHub
- GitLab
- Bitbucket
- Email

## Langkah 3: Siapkan Environment Variables

Vercel memerlukan environment variables untuk koneksi ke MongoDB dan secrets.

### Di folder project, buat `.env.production.local`:

```bash
# Jangan commit file ini! (sudah di .gitignore)
NODE_ENV=production
MONGODB_URI=mongodb+srv://user1:mariaktif@mariaktif.vwve87d.mongodb.net/?appName=MariAktif
SESSION_SECRET=7f3c9e2a1d6b4f8c5e9a2b7d4f6c1a3e8b5d9c2f7a4e6b9d1c3f8a5e7c9b2d4
JWT_SECRET=a1f8c3e9d2b7f4a6c1e8d3b9f5a7c2e4b6f1d8a3c5e7f9b1d3a6c8e2f4a7b9
CORS_ORIGIN=https://your-project-name.vercel.app
```

## Langkah 4: Deploy ke Vercel

### Option A: Automatic from GitHub (Recommended)

1. Push code ke GitHub
2. Buka https://vercel.com/new
3. Import repository GitHub kamu
4. Pilih root directory: `.` (current)
5. Sebelum deploy, set environment variables di **Environment Variables** section:
   - `MONGODB_URI` = `mongodb+srv://user1:mariaktif@mariaktif.vwve87d.mongodb.net/?appName=MariAktif`
   - `SESSION_SECRET` = (dari .env file lokal)
   - `JWT_SECRET` = (dari .env file lokal)
   - `CORS_ORIGIN` = `https://your-project.vercel.app` (akan diupdate setelah dapat URL)
   - `NODE_ENV` = `production`

6. Click **Deploy**

### Option B: Manual Deploy via CLI

```bash
# Dari folder project
vercel
```

Follow prompts:
- Project name: `web-mari-aktif` (atau nama lain)
- Set production environment: `y`
- Add env variables: `y`
  - `MONGODB_URI` = `mongodb+srv://user1:mariaktif@mariaktif.vwve87d.mongodb.net/?appName=MariAktif`
  - `SESSION_SECRET` = (copied from local .env)
  - `JWT_SECRET` = (copied from local .env)
  - `CORS_ORIGIN` = (akan dikasih tahu setelah deploy pertama)

## Langkah 5: Dapatkan Production URL

Setelah deploy berhasil, Vercel akan memberikan URL:
- https://web-mari-aktif.vercel.app (atau custom domain)

## Langkah 6: Update CORS_ORIGIN

1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Pilih project "web-mari-aktif"
3. Settings → Environment Variables
4. Edit `CORS_ORIGIN` dan set ke URL yang baru:
   ```
   https://web-mari-aktif.vercel.app
   ```
5. Redeploy dengan klik tombol Deploy

## Langkah 7: Test Deployment

```bash
curl https://web-mari-aktif.vercel.app/
```

Atau buka di browser.

## Troubleshooting

### Error: "Cannot find module"
```bash
npm install
vercel --prod
```

### Error: "MongooseError: connect ETIMEDOUT"
- Pastikan MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
- Vercel IPs tidak statis, jadi harus allow semua atau setup VPC

### Logs tidak muncul
```bash
vercel logs --prod
```

### Redeploy / Update

Cukup push ke GitHub, Vercel akan auto-redeploy:
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

## Custom Domain (Optional)

1. Buka Vercel Dashboard
2. Pilih project
3. Settings → Domains
4. Add your custom domain
5. Ikuti instruksi untuk update DNS records

## Environment Variables Reference

| Variable | Value | Example |
|----------|-------|---------|
| NODE_ENV | production | production |
| MONGODB_URI | MongoDB Atlas connection string | mongodb+srv://user1:mariaktif@... |
| SESSION_SECRET | Random string (32 chars+) | 7f3c9e2a1d6b4f8c5e9a2b7d4f6c1a3e |
| JWT_SECRET | Random string (32 chars+) | a1f8c3e9d2b7f4a6c1e8d3b9f5a7c2e4 |
| CORS_ORIGIN | Your deployed domain | https://web-mari-aktif.vercel.app |

---

**Notes:**
- Free tier Vercel includes 100 GB bandwidth/month
- Uptime: 99.95% SLA
- Auto HTTPS/SSL certificate
- Unlimited deployments
- Free custom domain (if you have one)
