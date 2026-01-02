const { query, run, get } = require("../config/database");

// Create product (any authenticated user)
const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
      price,
      compareAtPrice,
      condition,
      images,
    } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create product with seller_id from authenticated user
    const result = await run(
      `INSERT INTO products (seller_id, category_id, name, description, price, compare_at_price, condition, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        categoryId,
        name,
        description,
        price,
        compareAtPrice || null,
        condition || "good",
        1,
      ]
    );

    const productId = result.id;

    // Add images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await run(
          `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
           VALUES (?, ?, ?, ?)`,
          [productId, images[i], i === 0 ? 1 : 0, i]
        );
      }
    }

    res.status(201).json({
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get all products (with filters)
const getProducts = async (req, res) => {
  try {
    const { categoryId, search, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*,
             u.first_name || ' ' || u.last_name as seller_name,
             u.email as seller_email,
             c.name as category_name,
             (SELECT json_group_array(json_object('id', pi.id, 'url', pi.image_url, 'isPrimary', pi.is_primary))
              FROM product_images pi WHERE pi.product_id = p.id) as images
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 AND p.is_sold = 0
    `;

    const params = [];

    if (categoryId) {
      sql += " AND p.category_id = ?";
      params.push(categoryId);
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const products = await query(sql, params);

    // Parse JSON strings for images
    products.forEach((product) => {
      try {
        product.images = JSON.parse(product.images || "[]");
      } catch (e) {
        product.images = [];
      }
    });

    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await get(
      `SELECT p.*,
              u.first_name || ' ' || u.last_name as seller_name,
              u.email as seller_email,
              c.name as category_name
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [productId]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const images = await query(
      "SELECT id, image_url as url, is_primary as isPrimary, display_order FROM product_images WHERE product_id = ? ORDER BY display_order",
      [productId]
    );

    product.images = images;

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// Update product (own products only)
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      categoryId,
      name,
      description,
      price,
      compareAtPrice,
      condition,
      isActive,
    } = req.body;

    const result = await run(
      `UPDATE products
       SET category_id = COALESCE(?, category_id),
           name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           compare_at_price = COALESCE(?, compare_at_price),
           condition = COALESCE(?, condition),
           is_active = COALESCE(?, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND seller_id = ?`,
      [
        categoryId,
        name,
        description,
        price,
        compareAtPrice,
        condition,
        isActive,
        productId,
        req.user.id,
      ]
    );

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete product (own products only)
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await run(
      "DELETE FROM products WHERE id = ? AND seller_id = ?",
      [productId, req.user.id]
    );

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
