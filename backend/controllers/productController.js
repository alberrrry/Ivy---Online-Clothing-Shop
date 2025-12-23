const { query, run, get } = require('../config/database');

const getProducts = async (req, res) => {
  try {
    const {
      categoryId,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*,
             b.business_name,
             c.name as category_name,
             (SELECT json_group_array(json_object('id', pi.id, 'url', pi.image_url, 'isPrimary', pi.is_primary))
              FROM product_images pi WHERE pi.product_id = p.id) as images
      FROM products p
      LEFT JOIN businesses b ON p.business_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;

    const params = [];

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const products = await query(sql, params);

    // Parse JSON strings for images
    products.forEach(product => {
      try {
        product.images = JSON.parse(product.images || '[]');
      } catch (e) {
        product.images = [];
      }
    });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await get(
      `SELECT p.*,
              b.business_name,
              c.name as category_name
       FROM products p
       LEFT JOIN businesses b ON p.business_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [productId]
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const images = await query(
      'SELECT id, image_url as url, is_primary as isPrimary, display_order FROM product_images WHERE product_id = ? ORDER BY display_order',
      [productId]
    );

    const variants = await query(
      'SELECT id, variant_name as name, variant_value as value, price_adjustment as priceAdjustment, stock_quantity as stock FROM product_variants WHERE product_id = ?',
      [productId]
    );

    product.images = images;
    product.variants = variants;

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

module.exports = { getProducts, getProduct };