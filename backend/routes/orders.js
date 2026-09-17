const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET semua order (untuk admin/riwayat)
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET detail satu order + item-nya
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ error: 'Order tidak ditemukan' });
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id=?', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST checkout -> buat order baru dari cart
router.post('/', async (req, res) => {
  const { customer_name, customer_email, items } = req.body;

  if (!customer_name || !customer_email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customer_name, customer_email, dan items wajib diisi' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const validatedItems = [];

    // Validasi tiap item & ambil harga terbaru + cek stok dari DB
    for (const item of items) {
      const [productRows] = await conn.query('SELECT * FROM products WHERE id=?', [item.product_id]);
      if (productRows.length === 0) {
        throw new Error(`Produk dengan id ${item.product_id} tidak ditemukan`);
      }
      const product = productRows[0];
      const qty = parseInt(item.qty, 10) || 1;
      if (product.stock < qty) {
        throw new Error(`Stok produk "${product.name}" tidak cukup (tersisa ${product.stock})`);
      }
      total += Number(product.price) * qty;
      validatedItems.push({ product, qty });
    }

    // Buat order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_name, customer_email, total, status) VALUES (?, ?, ?, ?)',
      [customer_name, customer_email, total, 'pending']
    );
    const orderId = orderResult.insertId;

    // Buat order_items & kurangi stok
    for (const { product, qty } of validatedItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, qty)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, product.id, product.name, product.price, qty]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, product.id]);
    }

    await conn.commit();
    res.status(201).json({ id: orderId, total, message: 'Order berhasil dibuat' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
