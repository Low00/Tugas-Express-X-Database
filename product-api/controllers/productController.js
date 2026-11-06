const prisma = require('../lib/prisma');

const isValidBody = ({ name, price }) =>
  typeof name === 'string' &&
  name.trim() !== '' &&
  Number.isInteger(price) &&
  price >= 0;

const isValidId = (id) => Number.isInteger(id) && id > 0;

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'id harus berupa angka bulat positif' });
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const createProduct = async (req, res) => {
  try {
    const body = req.body || {};
    if (!isValidBody(body)) {
      return res
        .status(400)
        .json({ message: 'name (string) dan price (angka bulat >= 0) wajib diisi' });
    }
    const newProduct = await prisma.product.create({
      data: { name: body.name.trim(), price: body.price },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { getAllProducts, getProductById, createProduct };
