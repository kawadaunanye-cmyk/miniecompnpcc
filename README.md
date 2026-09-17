# Mini E-Commerce

Aplikasi contoh sederhana **mini e-commerce** dengan:
- **Backend**: Node.js + Express + MySQL (REST API)
- **Frontend**: React (Vite)
- **Database**: MySQL

Fitur: daftar produk per kategori, keranjang belanja, dan checkout yang membuat pesanan + mengurangi stok secara transaksional.

## Struktur Folder

```
mini-ecommerce/
├── backend/          # REST API (Express + MySQL)
│   ├── config/db.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── orders.js
│   ├── schema.sql    # skema + data contoh
│   ├── server.js
│   └── .env.example
└── frontend/          # React (Vite)
    ├── src/
    │   ├── components/
    │   ├── context/CartContext.jsx
    │   ├── api.js
    │   └── App.jsx
    └── .env.example
```

## Persiapan Database (MySQL)

1. Pastikan MySQL server sudah terinstall & berjalan di komputer Anda.
2. Buat database & user (atau sesuaikan dengan kredensial Anda sendiri):

```sql
CREATE DATABASE mini_ecommerce CHARACTER SET utf8mb4;
CREATE USER 'ecom_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ecom_pass123';
GRANT ALL PRIVILEGES ON mini_ecommerce.* TO 'ecom_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Import skema dan data contoh:

```bash
mysql -u ecom_user -p mini_ecommerce < backend/schema.sql
```

## Menjalankan Backend

```bash
cd backend
cp .env.example .env   # sesuaikan DB_USER / DB_PASSWORD jika perlu
npm install
npm start               # atau: npm run dev (auto-reload)
```

Backend berjalan di `http://localhost:5000`. Cek: `GET http://localhost:5000/api/health`.

### Endpoint API

| Method | Endpoint              | Keterangan                          |
|--------|-----------------------|--------------------------------------|
| GET    | /api/health           | Cek status server                    |
| GET    | /api/products         | Daftar produk (`?category_id=` opsional) |
| GET    | /api/products/:id     | Detail produk                        |
| POST   | /api/products         | Tambah produk                        |
| PUT    | /api/products/:id     | Update produk                        |
| DELETE | /api/products/:id     | Hapus produk                         |
| GET    | /api/categories       | Daftar kategori                      |
| POST   | /api/categories       | Tambah kategori                      |
| GET    | /api/orders           | Daftar order                         |
| GET    | /api/orders/:id       | Detail order + item                  |
| POST   | /api/orders           | Checkout (buat order baru)           |

## Menjalankan Frontend

```bash
cd frontend
cp .env.example .env   # sesuaikan VITE_API_URL jika backend beda alamat/port
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173` (default Vite).

## Alur Testing Lokal

1. Jalankan MySQL, lalu backend (`npm start` di folder `backend`).
2. Cek health check: `curl http://localhost:5000/api/health`.
3. Jalankan frontend (`npm run dev` di folder `frontend`).
4. Buka `http://localhost:5173` di browser, coba tambah produk ke keranjang, lalu checkout.

## Build Production Frontend

```bash
cd frontend
npm run build
```

Hasil build ada di folder `frontend/dist/`, bisa di-deploy ke static hosting apa pun (Netlify, Vercel, Nginx, dll). Untuk backend, deploy sebagai Node.js service biasa (Railway, Render, VPS, dll) dan pastikan environment variable database diatur di server tersebut.

## Catatan Keamanan

File `.env` **tidak** di-commit ke git (lihat `.gitignore`). Gunakan `.env.example` sebagai contoh, lalu buat `.env` Anda sendiri dengan kredensial database yang sesuai — jangan pernah push kredensial asli ke repository publik.
