# API Daftar Produk (ExpressJS)

Annabel Clarissa - 5027251016

API sederhana untuk daftar produk. Data disimpan di array (tanpa database),
sehingga data hasil POST hilang saat server di-restart.

## Cara Menjalankan

```bash
npm install   # jika folder node_modules tidak ada
node app.js
```

Server berjalan di http://localhost:3000

## Struktur Proyek

- `app.js` : entry point, konfigurasi Express
- `routes/productRoutes.js` : definisi route
- `controllers/productController.js` : logika endpoint dan data produk
- `bukti-pengujian/` : screenshot hasil pengujian

## Daftar Endpoint

| Method | Endpoint | Keterangan | Status |
|---|---|---|---|
| GET | /products | Mengambil seluruh produk | 200 |
| GET | /products/:id | Mengambil satu produk berdasarkan id | 200 / 404 |
| POST | /products | Menambah produk baru (body: name, price) | 201 / 400 |

## Contoh Pengujian

```bash
curl -i http://localhost:3000/products
curl -i http://localhost:3000/products/1
curl -i http://localhost:3000/products/999
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Penggaris","price":3000}'
```

Respons 404: `{"message":"Produk tidak ditemukan"}`
Respons 400 (jika name/price tidak valid): `{"message":"name (string) dan price (number) wajib diisi"}`
