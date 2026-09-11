const express = require('express');
const cors = require('cors');
const db = require('./db/database');

const app = express();
app.use(cors());
app.use(express.json());

// ── Productos ──────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, is_new, search, limit } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (category) { query += ' AND c.slug = ?'; params.push(category); }
    if (featured === 'true') { query += ' AND p.is_featured = 1'; }
    if (is_new === 'true') { query += ' AND p.is_new = 1'; }
    if (search) { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }

    const rows = await db.allAsync(query, params);
    res.json(rows.map(p => ({
      ...p,
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
      images: JSON.parse(p.images || '[]')
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await db.getAsync(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    if (!p) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ...p, sizes: JSON.parse(p.sizes || '[]'), colors: JSON.parse(p.colors || '[]'), images: JSON.parse(p.images || '[]') });
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// ── Categorías ─────────────────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await db.allAsync(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
    `);
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// ── Órdenes (Checkout) ─────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, subtotal, shipping, total, payment_method } = req.body;
    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    const result = await db.runAsync(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, items, subtotal, shipping, total, payment_method, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', CURRENT_TIMESTAMP)`,
      [customer.name, customer.email, customer.phone, customer.address,
       JSON.stringify(items), subtotal, shipping, total, payment_method || 'card']
    );
    const orderNumber = `FS-${String(result.lastID).padStart(5, '0')}`;
    res.status(201).json({ success: true, orderId: result.lastID, orderNumber, message: 'Orden creada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.getAsync('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json({ ...order, items: JSON.parse(order.items || '[]') });
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ FashionStore API corriendo en http://localhost:${PORT}`));
