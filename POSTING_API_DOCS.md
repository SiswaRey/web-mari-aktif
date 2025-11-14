# Dokumentasi API Posting - Mari Aktif

## Ringkasan Fitur
Backend untuk fitur posting yang memungkinkan user untuk:
- Membuat postingan
- Like/Dislike postingan
- Menambah komentar
- Melihat semua postingan
- Menghapus/Update postingan milik sendiri

## Endpoint API

### 1. Buat Postingan
**POST** `/api/post/create`

**Header:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "Teks postingan Anda"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Postingan berhasil dibuat",
    "post": {
        "_id": "...",
        "author": {...},
        "authorUsername": "username",
        "content": "teks postingan",
        "likes": [],
        "dislikes": [],
        "comments": [],
        "createdAt": "2024-..."
    }
}
```

---

### 2. Ambil Semua Postingan
**GET** `/api/post/all`

**Response:**
```json
{
    "success": true,
    "posts": [...],
    "total": 5
}
```

---

### 3. Ambil Detail Postingan
**GET** `/api/post/{postId}`

**Response:**
```json
{
    "success": true,
    "post": {
        "_id": "...",
        "author": {...},
        "content": "...",
        "likes": [...],
        "dislikes": [...],
        "comments": [...]
    }
}
```

---

### 4. Like Postingan
**POST** `/api/post/{postId}/like`

**Header:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Like berhasil",
    "post": {
        "_id": "...",
        "likes": [...],
        "dislikes": [...]
    }
}
```

*Note: Jika user sudah like, akan di-unlike. Jika user sudah dislike, dislike akan dihapus.*

---

### 5. Dislike Postingan
**POST** `/api/post/{postId}/dislike`

**Header:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Dislike berhasil",
    "post": {
        "_id": "...",
        "likes": [...],
        "dislikes": [...]
    }
}
```

*Note: Jika user sudah dislike, akan di-buka dislike. Jika user sudah like, like akan dihapus.*

---

### 6. Tambah Komentar
**POST** `/api/post/{postId}/comment`

**Header:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "Teks komentar Anda"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Komentar berhasil ditambahkan",
    "comments": [...]
}
```

---

### 7. Hapus Komentar
**DELETE** `/api/post/{postId}/comment/{commentId}`

**Header:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Komentar berhasil dihapus"
}
```

*Note: Hanya pembuat komentar yang bisa menghapusnya.*

---

### 8. Hapus Postingan
**DELETE** `/api/post/{postId}`

**Header:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Postingan berhasil dihapus"
}
```

*Note: Hanya pembuat postingan yang bisa menghapusnya.*

---

### 9. Update Postingan
**PUT** `/api/post/{postId}`

**Header:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "Teks postingan yang diubah"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Postingan berhasil diupdate",
    "post": {...}
}
```

*Note: Hanya pembuat postingan yang bisa mengubahnya.*

---

## Database Schema (MongoDB)

### Post Collection

```javascript
{
    _id: ObjectId,
    author: ObjectId (referensi ke User),
    authorUsername: String,
    content: String (required),
    likes: [ObjectId] (array referensi ke User),
    dislikes: [ObjectId] (array referensi ke User),
    comments: [
        {
            author: ObjectId,
            authorUsername: String,
            content: String,
            createdAt: Date
        }
    ],
    createdAt: Date,
    updatedAt: Date
}
```

---

## Frontend (JavaScript)

File: `public/postingSystem.js`

### Functions:

1. **loadPosts()** - Muat semua postingan dari server
2. **createPost()** - Buat postingan baru
3. **likePost(postId)** - Like/Unlike postingan
4. **dislikePost(postId)** - Dislike/Buka dislike postingan
5. **addComment(postId)** - Tambah komentar
6. **deleteComment(postId, commentId)** - Hapus komentar
7. **toggleCommentSection(postId)** - Tampilkan/Sembunyikan section komentar
8. **openPostModal()** - Buka modal untuk membuat postingan
9. **closePostModal()** - Tutup modal postingan

---

## Cara Menggunakan

### 1. Pastikan Token Tersimpan
Token JWT disimpan di `localStorage` dengan key `token` setelah login.

### 2. Buat Postingan
- Klik input "Mulai buat posting"
- Modal akan terbuka
- Ketik konten postingan
- Klik tombol "Posting"
- Postingan akan muncul di feed

### 3. Like/Dislike
- Klik tombol "Suka" atau "Tidak Suka" pada postingan
- Status akan berubah otomatis

### 4. Komentar
- Klik tombol "Komentar" pada postingan
- Section komentar akan terbuka
- Ketik komentar Anda
- Klik "Posting" untuk submit

---

## Validasi & Error Handling

### Error Code 400 (Bad Request)
- Konten postingan kosong
- Komentar kosong
- Field tidak lengkap

### Error Code 401 (Unauthorized)
- Token tidak ditemukan
- Token tidak valid
- User belum login

### Error Code 403 (Forbidden)
- User tidak bisa menghapus postingan orang lain
- User tidak bisa menghapus komentar orang lain
- User tidak bisa update postingan orang lain

### Error Code 404 (Not Found)
- Postingan tidak ditemukan
- Komentar tidak ditemukan

### Error Code 500 (Server Error)
- Terjadi kesalahan di server

---

## Testing dengan Postman/Thunder Client

### 1. Register User
```
POST http://localhost:3000/api/register
Body (JSON):
{
    "username": "testuser",
    "nisn": "1234567890",
    "password": "password123"
}
```

### 2. Login
```
POST http://localhost:3000/api/login
Body (JSON):
{
    "username": "testuser",
    "password": "password123"
}
```
Copy token dari response.

### 3. Buat Postingan
```
POST http://localhost:3000/api/post/create
Header:
Authorization: Bearer {token}
Body (JSON):
{
    "content": "Ini adalah postingan test"
}
```

### 4. Ambil Semua Postingan
```
GET http://localhost:3000/api/post/all
```

### 5. Like Postingan
```
POST http://localhost:3000/api/post/{postId}/like
Header:
Authorization: Bearer {token}
```

---

## File-file yang Ditambahkan

1. **skema/post.js** - Schema MongoDB untuk Post
2. **postApi.js** - Routes untuk API posting
3. **public/postingSystem.js** - Frontend JavaScript untuk posting
4. **index.js** - Updated dengan route `/api/post`
5. **pages/utama.html** - Updated dengan script posting

---

## Tips & Tricks

1. **Loading Indicator**: Tambahkan loading spinner saat memuat postingan
2. **Infinite Scroll**: Implementasikan pagination untuk performa lebih baik
3. **Real-time Updates**: Gunakan Socket.io untuk real-time posting
4. **Image Upload**: Tambahkan fitur upload gambar ke postingan
5. **Mentions**: Implementasikan @mentions untuk komentar

---

Selesai! Backend posting system sudah siap digunakan. 🎉
