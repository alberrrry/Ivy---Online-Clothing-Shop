const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.db");
const db = new sqlite3.Database(dbPath);

const initThriftDatabase = async () => {
  console.log("🔧 Initializing thrift marketplace database...");

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          role TEXT NOT NULL DEFAULT 'customer',
          is_active INTEGER DEFAULT 1,
          is_verified INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) console.error("Error creating users:", err);
          else console.log("✅ Users table created");
        }
      );

      // Categories table
      db.run(
        `
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
      `,
        (err) => {
          if (err) console.error("Error creating categories:", err);
          else console.log("✅ Categories table created");
        }
      );

      // Products table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          seller_id INTEGER NOT NULL,
          category_id INTEGER,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          compare_at_price REAL,
          condition TEXT DEFAULT 'good',
          size TEXT,
          brand TEXT,
          stock_quantity INTEGER DEFAULT 1,
          is_active INTEGER DEFAULT 1,
          is_sold INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        )
      `,
        (err) => {
          if (err) console.error("Error creating products:", err);
          else console.log("✅ Products table created");
        }
      );

      // Product images
      db.run(
        `
        CREATE TABLE IF NOT EXISTS product_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          image_url TEXT NOT NULL,
          is_primary INTEGER DEFAULT 0,
          display_order INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `,
        (err) => {
          if (err) console.error("Error creating product_images:", err);
          else console.log("✅ Product images table created");
        }
      );

      // Seed categories
      const categories = [
        ["Tops", "tops", "Shirts, blouses, and tops"],
        ["Bottoms", "bottoms", "Pants, jeans, and shorts"],
        ["Dresses", "dresses", "Casual and formal dresses"],
        ["Outerwear", "outerwear", "Jackets, coats, and blazers"],
        ["Accessories", "accessories", "Bags, jewelry, shoes, and more"],
      ];

      categories.forEach(([name, slug, desc]) => {
        db.run(
          "INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)",
          [name, slug, desc]
        );
      });

      console.log("✅ Categories seeded");
      console.log("🎉 Database ready!");

      resolve();
    });
  });
};

initThriftDatabase()
  .then(() => {
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
