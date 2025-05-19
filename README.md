## Instalasi

1. **Clone repository**
   ```sh
   git clone [https://github.com/mbagusdiass/Daya-Rekadigital.git]
   cd backend-DayaRekaDigital
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Buat file konfigurasi environment**
   - Salin `.env.example` menjadi `.env` dan sesuaikan jika perlu.

4. **Setup database**
   - Pastikan MySQL sudah berjalan dan database sudah dibuat sesuai `.env`.
   - Jalankan migrasi:
     ```sh
     npm run migrate
     ```
   - Jalankan seeder:
     ```sh
     npm run seed
     ```

5. **Jalankan server**
   ```sh
   npm run dev
   ```
   atau
   ```sh
   npm start
   ```

## Endpoint API

Semua endpoint diawali dengan `/api`.

### Pelanggan

- `GET    /api/customers` — List semua pelanggan
- `GET    /api/customers/:id` — Detail pelanggan + riwayat transaksi
- `POST   /api/customers` — Tambah pelanggan
- `PUT    /api/customers/:id` — Update pelanggan
- `DELETE /api/customers/:id` — Soft delete pelanggan

### Produk

- `GET    /api/products` — List semua produk
- `POST   /api/products` — Tambah produk

### Transaksi

- `POST   /api/transactions` — Buat transaksi baru
