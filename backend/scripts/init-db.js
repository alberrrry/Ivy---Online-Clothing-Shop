const { db } = require('../config/database');

const initDatabase = () => {
  console.log('🔧 Initializing database...');

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      role TEXT NOT NULL CHECK (role IN ('customer', 'seller', 'admin')),
      is_active INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Businesses table
  db.run(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      business_name TEXT NOT NULL,
      business_description TEXT,
      business_logo TEXT,
      business_address TEXT,
      business_phone TEXT,
      tax_id TEXT,
      status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      parent_id INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      compare_at_price REAL,
      sku TEXT,
      stock_quantity INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Product images table
  db.run(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      image_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Product variants table
  db.run(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      variant_name TEXT NOT NULL,
      variant_value TEXT NOT NULL,
      price_adjustment REAL DEFAULT 0,
      stock_quantity INTEGER DEFAULT 0,
      sku TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating tables:', err);
    } else {
      console.log('✅ Database tables created successfully!');
      seedData();
    }
  });
};

const seedData = () => {
  console.log('🌱 Seeding demo data...');

  // Insert demo categories
  const categories = [
    ['Tops', 'tops', 'Shirts, blouses, and tops'],
    ['Bottoms', 'bottoms', 'Pants, jeans, and shorts'],
    ['Dresses', 'dresses', 'Casual and formal dresses'],
    ['Outerwear', 'outerwear', 'Jackets, coats, and blazers'],
    ['Accessories', 'accessories', 'Bags, jewelry, and more']
  ];

  categories.forEach(([name, slug, desc]) => {
    db.run(
      'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, desc]
    );
  });

  console.log('✅ Demo data seeded!');
  console.log('🎉 Database ready! You can now start the server.');
  process.exit(0);
};

initDatabase();
