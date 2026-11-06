# Laporan Tugas: REST API Produk dengan Express, Prisma, dan PostgreSQL

**Nama:** Annabel Clarissa
**NRP:** 5027251016
**Mata Kuliah:** Pemrograman Web (ET234305)

## 1. Deskripsi

Project ini adalah lanjutan dari API Daftar Produk pada tugas sebelumnya. Penyimpanan data yang semula berupa array di memori diganti dengan database **PostgreSQL** yang diakses lewat **Prisma ORM**, sehingga data tetap tersimpan walaupun server di-restart.

Fitur yang tersedia:

| Method | Endpoint | Keterangan | Status |
|---|---|---|---|
| GET | `/products` | Menampilkan seluruh data | 200 |
| GET | `/products/:id` | Menampilkan satu produk berdasarkan id | 200 / 400 / 404 |
| POST | `/products` | Membuat data baru (body: `name`, `price`) | 201 / 400 |
| PUT | `/products` | Mengubah data yang sudah ada (body: `id`, `name`, `price`) | 200 / 400 / 404 |
| DELETE | `/products/:id` | Menghapus data berdasarkan id | 200 / 400 / 404 |

## 2. Teknologi

- Node.js dan Express
- Prisma ORM (`prisma` dan `@prisma/client`)
- PostgreSQL
- Postman (pengujian) dan Prisma Studio (melihat isi database)

## 3. Struktur Project

```
product-api/
├── app.js                          # entry point Express
├── routes/productRoutes.js         # definisi route
├── controllers/productController.js# logika endpoint (memakai Prisma)
├── lib/prisma.js                   # instance PrismaClient
├── prisma/
│   ├── schema.prisma               # model Product
│   └── migrations/                 # riwayat migration
├── bukti-pengujian/                # screenshot bukti
└── .env.example                    # contoh konfigurasi database
```

## 4. Schema Database

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

## 5. Cara Menjalankan

```bash
cd product-api
npm install
cp .env.example .env     # isi DATABASE_URL sesuai PostgreSQL lokal
npx prisma migrate dev --name init
node app.js
```

Server berjalan di `http://localhost:3000`.

Contoh isi `.env`:

```
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/product_db?schema=public"
```

## 6. Bukti Pengujian

Semua pengujian dilakukan dengan Postman. Perubahan database dilihat lewat Prisma Studio (`npx prisma studio`).

### 6.1 POST: membuat data baru

| Scenario | Body | Hasil |
|---|---|---|
| Validasi gagal | `{"name":"","price":"abc"}` | 400 Bad Request |
| Sukses | `{"name":"Buku","price":15000}` | 201 Created |

**POST validasi gagal.** `name` kosong dan `price` bukan angka, sehingga ditolak dengan status 400.

![POST validasi gagal](product-api/bukti-pengujian/post-validasi-gagal.png)

**POST sukses.** Body valid, data dibuat dan dikembalikan dengan status 201.

![POST sukses](product-api/bukti-pengujian/post-sukses.png)

**Perubahan database pada POST.**

| Before | After |
|---|---|
| ![DB before POST](product-api/bukti-pengujian/db-before-post.png) | ![DB after POST](product-api/bukti-pengujian/db-after-post.png) |
| Tabel `Product` masih kosong | Muncul baris baru: id 1, Buku, 15000 |

### 6.2 GET: menampilkan data

| Scenario | Request | Hasil |
|---|---|---|
| Seluruh data | `GET /products` | 200 OK |
| Satu data, ada | `GET /products/1` | 200 OK |
| Satu data, tidak ada | `GET /products/999` | 404 Not Found |

**GET seluruh data.**

![GET all](product-api/bukti-pengujian/get-all.png)

**GET berdasarkan id (sukses).**

![GET id sukses](product-api/bukti-pengujian/get-id-sukses.png)

**GET berdasarkan id (tidak ditemukan).** Id 999 tidak ada, sehingga mengembalikan 404 dengan pesan `Produk tidak ditemukan`.

![GET id 404](product-api/bukti-pengujian/get-id-404.png)

### 6.3 PUT: mengubah data

Body sama dengan POST ditambah `id`.

| Scenario | Body | Hasil |
|---|---|---|
| Tanpa id | `{"name":"X","price":1000}` | 400 Bad Request |
| Id tidak ada | `{"id":999,"name":"X","price":1000}` | 404 Not Found |
| Sukses | `{"id":1,"name":"Buku Tulis","price":20000}` | 200 OK |

**PUT tanpa id.**

![PUT tanpa id](product-api/bukti-pengujian/put-tanpa-id-400.png)

**PUT dengan id yang tidak ada.**

![PUT 404](product-api/bukti-pengujian/put-404.png)

**PUT sukses.**

![PUT sukses](product-api/bukti-pengujian/put-sukses.png)

**Perubahan database pada PUT.**

| Before | After |
|---|---|
| ![DB before PUT](product-api/bukti-pengujian/db-before-put.png) | ![DB after PUT](product-api/bukti-pengujian/db-after-put.png) |
| Data id 1 masih memakai nama dan harga lama | Data id 1 berubah menjadi Buku Tulis, 20000 |

### 6.4 DELETE: menghapus data

| Scenario | Request | Hasil |
|---|---|---|
| Sukses | `DELETE /products/1` | 200 OK |
| Id sudah terhapus | `DELETE /products/1` (kedua kali) | 404 Not Found |

**DELETE sukses.**

![DELETE sukses](product-api/bukti-pengujian/delete-sukses.png)

**DELETE pada id yang sudah terhapus.** Data tidak lagi ditemukan, sehingga mengembalikan 404.

![DELETE 404](product-api/bukti-pengujian/delete-404.png)

**Perubahan database pada DELETE.**

| Before | After |
|---|---|
| ![DB before DELETE](product-api/bukti-pengujian/db-before-delete.png) | ![DB after DELETE](product-api/bukti-pengujian/db-after-delete.png) |
| Tabel `Product` berisi 1 data | Tabel `Product` kosong (0 rows) |

## 7. Ringkasan

Seluruh endpoint CRUD berjalan dengan Prisma dan PostgreSQL. Validasi input mengembalikan 400, data yang tidak ditemukan mengembalikan 404, dan setiap perubahan (POST, PUT, DELETE) terlihat langsung pada isi tabel database.
