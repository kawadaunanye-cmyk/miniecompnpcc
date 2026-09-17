const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET semua produk (bisa filter ?category_id=)
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;
    let sql = `SELECT p.*, c.name AS category_name
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id`;
    const params = [];
    if (category_id) {
      sql += ' WHERE p.category_id = ?';
      params.push(category_id);
    }
    sql += ' ORDER BY p.id DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET satu produk by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah produk
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name dan price wajib diisi' });
    }
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, stock || 0, image_url || null, category_id || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Produk berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update produk
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const [result] = await pool.query(
      `UPDATE products SET name=?, description=?, price=?, stock=?, image_url=?, category_id=?
       WHERE id=?`,
      [name, description, price, stock, image_url, category_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE produk
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
