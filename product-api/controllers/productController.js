const products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

// GET /products
const getAllProducts = (req, res) => {
  res.status(200).json(products);
};

// GET /products/:id
const getProductById = (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
  res.status(200).json(product);
};

// POST /products
const createProduct = (req, res) => {
  const { name, price } = req.body;

  if (typeof name !== 'string' || name.trim() === '' || typeof price !== 'number') {
    return res
      .status(400)
      .json({ message: 'name (string) dan price (number) wajib diisi' });
  }

  const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = { id: newId, name: name.trim(), price };
  products.push(newProduct);

  res.status(201).json(newProduct);
};

module.exports = { getAllProducts, getProductById, createProduct };
