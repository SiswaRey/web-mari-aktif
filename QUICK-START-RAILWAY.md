# 🚀 QUICK START - RAILWAY (Paling Recommended)

## ⏱️ Total Setup Time: 5 Menit

### Prerequisites:
- ✅ GitHub account (free)
- ✅ Railway account (free)
- ✅ MongoDB Atlas account (free)

---

## STEP 1: Setup GitHub Repository (2 menit)

### Option A: Jika belum ada di GitHub
```bash
cd d:\lomba-app ori\web-mari-aktif

# Initialize Git
git init
git add .
git commit -m "Initial commit - Mari Aktif Web App"

# Create repo di https://github.com/new
# Nama: web-mari-aktif

# Push ke GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/web-mari-aktif.git
git push -u origin main
```

### Option B: Jika sudah ada
```bash
git add .
git commit -m "Setup SSL & deployment configs"
git push origin main
```

---

## STEP 2: Setup MongoDB Atlas (1 menit)

1. Buka: https://mongodb.com/cloud/atlas
2. Sign up (gratis)
3. Create Organization → Create Project
4. Click "Build Database"
5. Pilih "Shared" (Free)
6. Provider: AWS, Region: ap-southeast-1 (Singapore)
7. Cluster name: `mari-aktif`
8. Click "Create"

### Setup Security:
1. Click "Security" → "Database Access"
2. Add Database User:
   - Username: `admin`
   - Password: `generate_secure_password` (copy ini!)
   - Built-in Role: `Atlas Admin`

3. Click "Network Access"
4. Add IP Address: `0.0.0.0/0` (allow all - untuk development)

### Get Connection String:
1. Click "Databases" → Cluster "mari-aktif"
2. Click "Connect" → "Drivers"
3. Copy connection string:
   ```
   mongodb+srv://admin:PASSWORD@mari-aktif.xxxxx.mongodb.net/mari_aktif?retryWrites=true&w=majority
   ```
4. Ganti PASSWORD dengan password yang tadi
5. Save ini untuk Step 3

---

## STEP 3: Deploy ke Railway (2 menit)

### 3.1 Buka Railway
1. Buka: https://railway.app
2. Login dengan GitHub (biar mudah)
3. Klik "Create New Project"

### 3.2 Connect Repository
1. Klik "Deploy from GitHub repo"
2. Authorize Railway
3. Pilih repository: `web-mari-aktif`
4. Klik "Deploy"

Railway akan:
- ✅ Detect Node.js
- ✅ Install dependencies (npm install)
- ✅ Build & start server
- ✅ Generate HTTPS URL

Tunggu ~2-3 menit... 

### 3.3 Setup Environment Variables
1. Di Railway Dashboard
2. Klik project → "Variables"
3. Tambah variables:

```
NODE_ENV=production

PORT=3000

MONGODB_URI=mongodb+srv://admin:PASSWORD@mari-aktif.xxxxx.mongodb.net/mari_aktif?retryWrites=true&w=majority

SESSION_SECRET=
```

### Generate SESSION_SECRET & JWT_SECRET:
```bash
# Jalankan di terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: xxxxx... (copy ini ke SESSION_SECRET di Railway)
# Jalankan lagi untuk JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Lanjut add variables:
```
JWT_SECRET=xxxxx (hasil dari command di atas)

CORS_ORIGIN=https://your-railway-url.up.railway.app
```

### Railway URL:
- Di Railway Dashboard, bisa dilihat URL: `https://web-mari-aktif-production-xxxxx.up.railway.app`
- Copy full URL ke CORS_ORIGIN

---

## ✅ DONE! 

Aplikasi sudah live di:
```
🌐 https://web-mari-aktif-production-xxxxx.up.railway.app
🔒 SSL/HTTPS: Active
🚀 Auto-deploy: Enabled (push ke main = auto deploy)
```

---

## 🧪 TEST

### Test dari browser:
```
https://your-railway-url.up.railway.app/login
https://your-railway-url.up.railway.app/daftar
```

### Test API:
```bash
curl https://your-railway-url.up.railway.app/api/health
```

### Check SSL:
```bash
# Buka di browser
https://www.ssllabs.com/ssltest/analyze.html?d=your-railway-url.up.railway.app

# Expected: A+ Grade ✅
```

---

## 🔄 AUTO-DEPLOY SETUP

Railway sudah auto-deploy saat push ke main:

```bash
# Setiap kali kamu push
git add .
git commit -m "Your changes"
git push origin main

# Railway otomatis akan:
# 1. Build aplikasi
# 2. Deploy ke production
# 3. Zero downtime
```

---

## 🎯 NEXT STEPS

### Custom Domain (Optional):
1. Beli domain di Niagahoster, Namecheap, etc
2. Di Railway:
   - Settings → Custom Domain
   - Add Domain: `your-domain.com`
   - Add CNAME: `railway.app`
3. Wait 24 jam untuk DNS propagation
4. SSL auto-update ✅

### Email Setup (Optional):
1. Railway Dashboard → Settings
2. Add email untuk notifications

### Monitoring (Optional):
1. Di Railway Dashboard
2. Monitor logs, metrics, deployments

---

## 🆘 TROUBLESHOOTING

### App tidak jalan?
```
1. Check logs di Railway
2. Verify MONGODB_URI benar
3. Verify SESSION_SECRET ada
4. npm run prod (test lokal)
```

### Database connection error?
```
1. Check MONGODB_URI di MongoDB Atlas
2. Database user credentials correct?
3. Network access: 0.0.0.0/0 added?
4. Cluster ready? (bukan "Creating")
```

### HTTPS tidak bisa?
```
1. Wait 5-10 menit setelah deploy
2. Check custom domain DNS
3. Railway auto-generate SSL
```

### Deploy gagal?
```
1. npm install (local)
2. npm run prod (test)
3. git push origin main
4. Check railway logs
```

---

## 📊 MONTHLY COST

| Item | Cost |
|------|------|
| Railway (Node.js) | Free-$5 |
| MongoDB Atlas (512MB) | Free |
| Domain (.com) | ~$2-3 |
| **TOTAL** | **Free-$8/bulan** |

---

## 💡 TIPS

1. **Backup Database**
   - MongoDB Atlas auto-backup (included)
   - Manual: `mongodump` setiap minggu

2. **Logs**
   - Railway: Real-time logs di dashboard
   - Check sebelum update

3. **Environment**
   - Dev .env: `NODE_ENV=development`
   - Production: `NODE_ENV=production`

4. **Auto-updates**
   - npm update (local)
   - Test
   - git push

---

**Ready? Let's go! 🚀**

Kalau ada error, chat aja!
