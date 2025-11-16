# 🚀 QUICK START - DIGITALOCEAN (VPS - Full Control)

## ⏱️ Total Setup Time: 20 Menit

### Kelebihan:
- ✅ Murah: $4-6/bulan
- ✅ Full control
- ✅ Better performance
- ✅ Cocok untuk production

### Prerequisites:
- ✅ DigitalOcean account (dengan kartu kredit)
- ✅ GitHub repository
- ✅ Terminal/PowerShell

---

## STEP 1: Create Droplet di DigitalOcean (2 menit)

1. Buka: https://digitalocean.com
2. Klik "Create" → "Droplets"

### Configure:
- **OS**: Ubuntu 22.04 x64
- **Plan**: Basic ($4/bulan - cukup untuk dev/small prod)
- **Data Center**: Singapore (fastest untuk Indonesia)
- **Authentication**: SSH key (recommended) atau password
- **Hostname**: mari-aktif-server

3. Klik "Create Droplet"
4. Wait ~30 detik sampai ready

### Dapatkan IP Address:
- Copy IP address droplet (e.g., 123.45.67.89)

---

## STEP 2: SSH ke Server (1 menit)

### Via Terminal/PowerShell:
```bash
ssh root@123.45.67.89

# First time: accept fingerprint
# Password: (yang di set saat create)

# Done! Sekarang di server
```

---

## STEP 3: Update System (2 menit)

```bash
apt update && apt upgrade -y
```

---

## STEP 4: Install Node.js (2 menit)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
apt install -y nodejs

# Verify
node -v    # v20.x.x
npm -v     # 10.x.x
```

---

## STEP 5: Install Git & Clone Project (2 menit)

```bash
apt install -y git

# Clone repository
cd /opt
git clone https://github.com/YOUR_USERNAME/web-mari-aktif.git
cd web-mari-aktif

# Install dependencies
npm install
```

---

## STEP 6: Setup MongoDB Atlas (1 menit)

### Same seperti Railway Step 2:
1. Buka: https://mongodb.com/cloud/atlas
2. Create cluster & user
3. Copy connection string

---

## STEP 7: Setup Environment Variables (1 menit)

```bash
# Create .env file
nano .env

# Paste:
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://admin:PASSWORD@mari-aktif.xxxxx.mongodb.net/mari_aktif?retryWrites=true&w=majority
SESSION_SECRET=generate_dari_command_below
JWT_SECRET=generate_dari_command_below
CORS_ORIGIN=https://your-domain.com
```

### Generate secrets (di local terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Save file:
```
Ctrl+X → Y → Enter
```

---

## STEP 8: Install PM2 (Process Manager) (1 menit)

```bash
npm install -g pm2

# Start application
pm2 start index.js --name "mari-aktif"

# Setup startup script
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs
```

---

## STEP 9: Install & Setup Nginx (2 menit)

```bash
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

---

## STEP 10: Setup SSL dengan Let's Encrypt (2 menit)

```bash
apt install -y certbot python3-certbot-nginx

# Generate certificate (ganti your-domain.com)
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Konfirmasi email, agree terms

# Certificate saved di:
# /etc/letsencrypt/live/your-domain.com/
```

---

## STEP 11: Configure Nginx untuk Reverse Proxy (2 menit)

```bash
# Backup config original
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Edit Nginx config
nano /etc/nginx/sites-available/default

# DELETE semua content, paste ini:
```

```nginx
# Redirect HTTP ke HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Save:
```
Ctrl+X → Y → Enter
```

### Test config:
```bash
nginx -t

# Output: ok
```

### Restart Nginx:
```bash
systemctl restart nginx
```

---

## STEP 12: Setup Auto-SSL Renewal (1 menit)

```bash
systemctl enable certbot.timer
systemctl start certbot.timer

# Verify
systemctl status certbot.timer
```

---

## ✅ DONE!

Application live di:
```
🌐 https://your-domain.com
🔒 SSL/HTTPS: Active (Let's Encrypt)
🚀 Process Manager: PM2
🔄 Auto-startup: Enabled
```

---

## 🔄 DEPLOYMENT WORKFLOW

Setiap kali ada update:

### Local:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Di Server:
```bash
# SSH ke server
ssh root@123.45.67.89

# Go to project
cd /opt/web-mari-aktif

# Pull latest code
git pull origin main

# Install (jika ada new dependencies)
npm install

# Restart aplikasi
pm2 restart mari-aktif

# Check status
pm2 status
```

---

## 🧪 TESTING

### Test HTTPS:
```bash
curl https://your-domain.com/login
```

### Check SSL:
```
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
# Expected: A+ Grade
```

### Monitor Logs:
```bash
ssh root@123.45.67.89
pm2 logs mari-aktif

# Real-time monitoring
```

---

## 🎯 DOMAIN SETUP

### Di Registrar (Namecheap, Niagahoster, etc):
1. Beli domain: `your-domain.com`
2. Go to DNS settings
3. Add A record:
   - Name: `@`
   - Value: `123.45.67.89` (DigitalOcean IP)
4. Add CNAME:
   - Name: `www`
   - Value: `your-domain.com`
5. Wait 24 jam untuk DNS propagation

---

## 📊 MONTHLY COST

| Item | Cost |
|------|------|
| DigitalOcean Droplet | $4-6 |
| MongoDB Atlas | Free |
| Domain | ~$2-3 |
| **TOTAL** | **~$6-9/bulan** |

---

## 🆘 TROUBLESHOOTING

### Can't SSH?
```
1. Check IP address correct
2. Check firewall (DigitalOcean: allow SSH port 22)
3. Generate new SSH key
```

### App not running?
```bash
pm2 status
pm2 logs
```

### Database connection error?
```
1. Check MONGODB_URI
2. MongoDB whitelist IP: 0.0.0.0/0
3. Verify user credentials
```

### HTTPS not working?
```
1. Check certificate exists: ls /etc/letsencrypt/live/
2. DNS propagated? (wait 24h)
3. Nginx config correct? (nginx -t)
```

### Nginx error?
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

---

## 💡 TIPS

1. **Backup**
   ```bash
   # Backup database
   mongodump --uri="mongodb+srv://..." --out=./backup
   ```

2. **Monitor**
   ```bash
   pm2 monit
   ```

3. **Update App**
   ```bash
   git pull && npm install && pm2 restart mari-aktif
   ```

4. **Firewall**
   - DigitalOcean firewall: Allow 80, 443, 22
   - Keep secure!

5. **Backups**
   - Enable snapshots di DigitalOcean
   - Weekly = $1-2 extra

---

**Ready? Let's deploy! 🚀**

Next: Setup domain pointing ke DigitalOcean IP
