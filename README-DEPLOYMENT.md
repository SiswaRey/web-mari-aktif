# Deployment Guide untuk Mari Aktif

## 🔐 SSL/HTTPS Setup Complete!

Aplikasi sudah di-setup dengan security headers dan HTTPS ready.

---

## 📋 Langkah-Langkah Deployment

### 1. **Prepare Dependencies**
```bash
npm install
```

Ini akan install security packages:
- `helmet` - Security headers
- `cors` - CORS protection
- `hpp` - HTTP Parameter Pollution prevention

---

### 2. **Setup Environment Variables**
Copy `.env.example` ke `.env` dan isi dengan value yang benar:

```bash
# .env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
SESSION_SECRET=generate_random_string_here
JWT_SECRET=generate_another_random_string_here
CORS_ORIGIN=https://your-domain.com
```

**Generate secure random strings:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 3. **Local Testing**
```bash
# Development
npm run dev

# Production mode (local)
npm run prod
```

---

### 4. **Option A: Docker Deployment (Recommended)**

#### Prerequisites:
- Docker & Docker Compose installed

#### Deploy:
```bash
# 1. Build & Start
docker-compose up -d

# 2. Check logs
docker-compose logs -f app

# 3. Stop
docker-compose down
```

---

### 5. **Option B: VPS/Server Deployment (DigitalOcean, Linode, etc)**

#### Prerequisites:
- Ubuntu 20.04+ server
- Domain name pointing to server IP

#### Setup SSL with Let's Encrypt:

```bash
# 1. Install Nginx & Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# 2. Copy Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/default

# 3. Generate SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 4. Update nginx.conf with your domain name
# Replace: your-domain.com

# 5. Test Nginx
sudo nginx -t

# 6. Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 7. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 8. Clone & Setup App
cd /opt
sudo git clone your-repo-url mari-aktif
cd mari-aktif
npm install

# 9. Create .env file
sudo nano .env
# Isi dengan production values

# 10. Setup PM2 for process management
sudo npm install -g pm2
pm2 start index.js --name "mari-aktif"
pm2 startup
pm2 save

# 11. Auto-renew SSL certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

### 6. **Option C: Railway/Render (Easiest)**

#### Railway:
1. Push ke GitHub
2. Connect repository ke Railway
3. Add environment variables di Railway dashboard
4. Railway auto-generate HTTPS URL
5. Deploy!

#### Render:
1. Same as Railway, just on render.com
2. Free SSL included

---

## 🔒 Security Features Implemented

✅ **HTTPS/SSL Ready**
- Helmet.js security headers
- HSTS (Strict-Transport-Security)
- HTTP to HTTPS redirect

✅ **Session Security**
- `httpOnly` cookies (prevent XSS)
- `secure` flag (HTTPS only)
- `sameSite: strict` (CSRF protection)

✅ **Request Security**
- CORS with whitelist
- HPP (HTTP Parameter Pollution) protection
- Content Security Policy headers

✅ **Database Security**
- MongoDB connection pooling
- No sensitive data in logs

---

## 📊 SSL Certificate Checklist

- [ ] Domain registered
- [ ] DNS pointing to server IP
- [ ] Let's Encrypt certificate generated
- [ ] Nginx configured with SSL
- [ ] Auto-renewal setup
- [ ] Test on https://www.ssllabs.com/ssltest/

---

## 🧪 Testing SSL

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Test with curl
curl -I https://your-domain.com

# Check security headers
curl -I https://your-domain.com | grep -i "strict\|x-frame\|x-content"
```

---

## 📱 Monitoring & Logs

```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs mari-aktif
pm2 monit

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🚨 Production Checklist

- [ ] `.env` file created with strong secrets
- [ ] MongoDB connection tested
- [ ] SSL certificate installed
- [ ] CORS_ORIGIN updated to your domain
- [ ] NODE_ENV=production set
- [ ] Health checks working
- [ ] Logs configured
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Rate limiting configured (optional)

---

## 🆘 Troubleshooting

### SSL Certificate Error
```bash
# Verify certificate exists
sudo ls -la /etc/letsencrypt/live/your-domain.com/

# Renew manually
sudo certbot renew --dry-run
```

### Connection Refused
```bash
# Check if app is running
pm2 status
docker-compose ps

# Check ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :443
```

### MongoDB Connection
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
```

---

## 📞 Support

Dokumentasi Express: https://expressjs.com/
Helmet Docs: https://helmetjs.github.io/
Nginx SSL: https://nginx.org/en/docs/http/ngx_http_ssl_module.html
Let's Encrypt: https://letsencrypt.org/
