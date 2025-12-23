const { run, db } = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDemoData = async () => {
  console.log('🌱 Seeding demo data...');

  try {
    // Create demo seller account
    const hashedPassword = await bcrypt.hash('seller123', 10);
    
    await run(
      `INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      ['demo.seller@ivy.com', hashedPassword, 'Demo', 'Seller', 'seller']
    );

    // Get seller user ID
    const seller = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', ['demo.seller@ivy.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Create demo business
    await run(
      `INSERT OR IGNORE INTO businesses (user_id, business_name, business_description, status) 
       VALUES (?, ?, ?, ?)`,
      [seller.id, 'Ivy Boutique', 'Curated minimalist fashion for the modern wardrobe', 'approved']
    );

    // Get business ID
    const business = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM businesses WHERE user_id = ?', [seller.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log('✅ Demo seller and business created');

    // Demo products with Unsplash images
    const products = [
      // TOPS
      {
        name: 'Classic White Linen Shirt',
        description: 'Timeless white linen shirt perfect for any occasion. Breathable fabric with a relaxed fit.',
        price: 89.00,
        compare_at_price: 120.00,
        category_id: 1,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'
        ]
      },
      {
        name: 'Oversized Cotton Tee',
        description: 'Comfortable oversized cotton t-shirt in premium quality fabric. Perfect for everyday wear.',
        price: 45.00,
        compare_at_price: null,
        category_id: 1,
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
        ]
      },
      {
        name: 'Silk Button-Down Blouse',
        description: 'Elegant silk blouse with mother-of-pearl buttons. Sophisticated and versatile.',
        price: 135.00,
        compare_at_price: 180.00,
        category_id: 1,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800'
        ]
      },
      {
        name: 'Ribbed Knit Tank Top',
        description: 'Minimalist ribbed tank top in soft stretch cotton. Layering essential.',
        price: 38.00,
        compare_at_price: null,
        category_id: 1,
        stock: 85,
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'
        ]
      },
      {
        name: 'Striped Long Sleeve Tee',
        description: 'Classic Breton stripe long sleeve tee. Timeless style in premium cotton.',
        price: 62.00,
        compare_at_price: null,
        category_id: 1,
        stock: 55,
        images: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'
        ]
      },

      // BOTTOMS
      {
        name: 'High-Waisted Wide Leg Pants',
        description: 'Elegant wide-leg trousers with a flattering high waist. Perfect for office or evening.',
        price: 125.00,
        compare_at_price: 165.00,
        category_id: 2,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
          'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800'
        ]
      },
      {
        name: 'Relaxed Fit Denim',
        description: 'Classic straight-leg jeans in premium Japanese denim. Effortlessly cool.',
        price: 145.00,
        compare_at_price: null,
        category_id: 2,
        stock: 65,
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'
        ]
      },
      {
        name: 'Pleated Midi Skirt',
        description: 'Flowing pleated skirt in luxe fabric. Feminine and sophisticated.',
        price: 98.00,
        compare_at_price: 135.00,
        category_id: 2,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'
        ]
      },
      {
        name: 'Tailored Shorts',
        description: 'Crisp tailored shorts with a modern cut. Smart casual perfection.',
        price: 78.00,
        compare_at_price: null,
        category_id: 2,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'
        ]
      },

      // DRESSES
      {
        name: 'Linen Wrap Dress',
        description: 'Breezy linen wrap dress with tie waist. Effortless summer elegance.',
        price: 155.00,
        compare_at_price: 210.00,
        category_id: 3,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800'
        ]
      },
      {
        name: 'Slip Dress',
        description: 'Minimalist silk slip dress. Perfect for day-to-night styling.',
        price: 185.00,
        compare_at_price: null,
        category_id: 3,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
        ]
      },
      {
        name: 'Shirt Dress',
        description: 'Crisp cotton shirt dress with belt detail. Polished and practical.',
        price: 135.00,
        compare_at_price: 175.00,
        category_id: 3,
        stock: 38,
        images: [
          'https://images.unsplash.com/photo-1585487000143-66b1459d1e18?w=800'
        ]
      },
      {
        name: 'Midi Knit Dress',
        description: 'Soft ribbed knit dress with subtle texture. Comfortable luxury.',
        price: 145.00,
        compare_at_price: null,
        category_id: 3,
        stock: 42,
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'
        ]
      },

      // OUTERWEAR
      {
        name: 'Classic Trench Coat',
        description: 'Timeless double-breasted trench in water-resistant cotton. Investment piece.',
        price: 385.00,
        compare_at_price: 495.00,
        category_id: 4,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'
        ]
      },
      {
        name: 'Wool Blazer',
        description: 'Tailored wool blazer with modern proportions. Versatile wardrobe staple.',
        price: 295.00,
        compare_at_price: null,
        category_id: 4,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800'
        ]
      },
      {
        name: 'Oversized Cardigan',
        description: 'Chunky knit cardigan in soft merino wool. Cozy sophistication.',
        price: 165.00,
        compare_at_price: 220.00,
        category_id: 4,
        stock: 32,
        images: [
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'
        ]
      },
      {
        name: 'Leather Jacket',
        description: 'Butter-soft leather moto jacket. Edgy meets elegant.',
        price: 485.00,
        compare_at_price: null,
        category_id: 4,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
        ]
      },

      // ACCESSORIES
      {
        name: 'Leather Tote Bag',
        description: 'Structured leather tote with interior pockets. Timeless everyday bag.',
        price: 245.00,
        compare_at_price: 320.00,
        category_id: 5,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'
        ]
      },
      {
        name: 'Silk Scarf',
        description: 'Hand-rolled silk scarf with abstract print. Versatile accent piece.',
        price: 95.00,
        compare_at_price: null,
        category_id: 5,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800'
        ]
      },
      {
        name: 'Wide Brim Hat',
        description: 'Wool felt wide brim hat. Sophisticated sun protection.',
        price: 85.00,
        compare_at_price: 110.00,
        category_id: 5,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800'
        ]
      },
      {
        name: 'Gold Hoop Earrings',
        description: 'Classic 14k gold-plated hoops. Everyday luxury.',
        price: 68.00,
        compare_at_price: null,
        category_id: 5,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
        ]
      },
      {
        name: 'Leather Belt',
        description: 'Italian leather belt with brushed gold buckle. Refined detail.',
        price: 125.00,
        compare_at_price: null,
        category_id: 5,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800'
        ]
      },
    ];

    // Insert products
    for (const product of products) {
      const result = await run(
        `INSERT INTO products (business_id, category_id, name, description, price, compare_at_price, stock_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [business.id, product.category_id, product.name, product.description, product.price, product.compare_at_price, product.stock]
      );

      const productId = result.id;

      // Insert images
      for (let i = 0; i < product.images.length; i++) {
        await run(
          `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
           VALUES (?, ?, ?, ?)`,
          [productId, product.images[i], i === 0 ? 1 : 0, i]
        );
      }

      console.log(`✅ Added: ${product.name}`);
    }

    console.log('\n🎉 Demo data seeding complete!');
    console.log('\n📝 Demo Account:');
    console.log('   Email: demo.seller@ivy.com');
    console.log('   Password: seller123');
    console.log('\n🚀 Start your backend and test the app!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDemoData();