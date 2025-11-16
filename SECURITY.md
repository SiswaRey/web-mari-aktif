# 🔒 Panduan Keamanan - Mari Aktif Lomba

## Akun Developer

### Informasi Default
- **Username:** `developer`
- **NISN:** `0000000001`
- **Password:** Didefinisikan di environment variable `DEVELOPER_PASSWORD`
- **Default Password:** `Dev@2024!SecurePass` (untuk development saja)

### ⚠️ PENTING untuk Production

1. **Ubah Password Developer**
   - Jangan gunakan password default di production
   - Edit file `.env` dan ubah nilai `DEVELOPER_PASSWORD` dengan password yang kuat
   - Password harus mengandung kombinasi:
     - Minimal 8 karakter
     - Huruf besar (A-Z)
     - Huruf kecil (a-z)
     - Angka (0-9)
     - Simbol (!@#$%^&*)

   Contoh password yang kuat:
   ```
   DEVELOPER_PASSWORD=MySecure@DevPass2024#X
   ```

2. **Ubah JWT Secret**
   - Edit `JWT_SECRET` di `.env` dengan string random yang panjang
   - Jangan gunakan default key untuk production

3. **Ubah Session Secret**
   - Edit `SESSION_SECRET` di `.env`
   - Gunakan string random yang panjang dan kompleks

### Cara Mengubah Password Developer

1. Edit file `.env`
2. Ubah nilai `DEVELOPER_PASSWORD` dengan password baru yang kuat
3. Restart server Node.js
4. Password akan otomatis ter-update di database (di-hash dengan bcrypt)

### Keamanan Akun Developer

✅ **Yang sudah diimplementasikan:**
- Password di-hash menggunakan bcrypt
- Proteksi JWT token untuk autentikasi
- Role-based access control (hanya developer yang bisa akses developer panel)
- Password tidak pernah ditampilkan di console dalam plain text

### Tips Keamanan Tambahan

1. **Ganti Akun Default Secara Berkala**
   - Ubah password developer setiap 3 bulan

2. **Gunakan HTTPS di Production**
   - Pastikan semua komunikasi terenkripsi

3. **Monitor Akses Developer Panel**
   - Catat log semua akses ke developer panel
   - Audit aktivitas developer secara berkala

4. **Batasi IP Address (Optional)**
   - Jika possible, batasi developer panel hanya dari IP tertentu

5. **Aktifkan Two-Factor Authentication (Future Enhancement)**
   - Tambahkan 2FA untuk layer keamanan tambahan

### Environment Variables yang Harus Dikonfigurasi

```bash
# Production Configuration
MONGODB_URI=<production-mongodb-uri>
SESSION_SECRET=<random-secret-string-min-32-char>
JWT_SECRET=<random-secret-string-min-32-char>
DEVELOPER_PASSWORD=<strong-password-min-8-char>
```

### Checklist Pre-Production

- [ ] Ubah MONGODB_URI ke production database
- [ ] Ubah SESSION_SECRET ke random string panjang
- [ ] Ubah JWT_SECRET ke random string panjang
- [ ] Ubah DEVELOPER_PASSWORD ke password yang kuat
- [ ] Test login dengan akun developer
- [ ] Verifikasi akses control bekerja dengan baik
- [ ] Setup monitoring dan logging
- [ ] Backup database secara berkala

---

**Last Updated:** November 16, 2025
**Version:** 1.0
