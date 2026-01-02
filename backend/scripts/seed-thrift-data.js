const { run, db, get } = require("../config/database");
const bcrypt = require("bcryptjs");

const seedThriftData = async () => {
  console.log("🌱 Seeding thrift marketplace data...");

  try {
    // Clear existing data
    await new Promise((resolve) => {
      db.run("DELETE FROM product_images", () => {
        db.run("DELETE FROM products", () => {
          db.run('DELETE FROM users WHERE email LIKE "%@thrift.ivy%"', resolve);
        });
      });
    });

    // Create demo users (sellers)
    const hashedPassword = await bcrypt.hash("password123", 10);

    const sellers = [
      { email: "emma@thrift.ivy", firstName: "Emma", lastName: "Chen" },
      { email: "noah@thrift.ivy", firstName: "Noah", lastName: "Martinez" },
      { email: "sophia@thrift.ivy", firstName: "Sophia", lastName: "Kim" },
      { email: "liam@thrift.ivy", firstName: "Liam", lastName: "Johnson" },
    ];

    const sellerIds = [];

    for (const seller of sellers) {
      const result = await run(
        "INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)",
        [
          seller.email,
          hashedPassword,
          seller.firstName,
          seller.lastName,
          "customer",
        ]
      );
      sellerIds.push(result.id);
      console.log(`✅ Created seller: ${seller.firstName} ${seller.lastName}`);
    }

    // Thrift products - secondhand clothing items
    const products = [
      // Emma's listings
      {
        seller_id: sellerIds[0],
        name: "Vintage Levi's 501 Jeans",
        description:
          "Classic vintage Levi's 501s in great condition. Perfect worn-in feel. Size 28 waist.",
        price: 45.0,
        compare_at_price: null,
        condition: "good",
        size: "28",
        brand: "Levi's",
        category_id: 2,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        ],
      },
      {
        seller_id: sellerIds[0],
        name: "Oversized Vintage Band Tee",
        description:
          "Soft vintage band t-shirt. Has that perfect vintage fade. Oversized fit.",
        price: 28.0,
        compare_at_price: null,
        condition: "good",
        size: "L",
        brand: "Vintage",
        category_id: 1,
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
        ],
      },
      {
        seller_id: sellerIds[0],
        name: "Wool Blend Coat",
        description:
          "Beautiful camel-colored wool coat. Barely worn, like new condition. Perfect for fall.",
        price: 85.0,
        compare_at_price: 140.0,
        condition: "like_new",
        size: "M",
        brand: "J.Crew",
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
        ],
      },

      // Noah's listings
      {
        seller_id: sellerIds[1],
        name: "Nike Windbreaker Jacket",
        description:
          "90s Nike windbreaker in excellent condition. Rare color combo. Size medium.",
        price: 55.0,
        compare_at_price: null,
        condition: "good",
        size: "M",
        brand: "Nike",
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        ],
      },
      {
        seller_id: sellerIds[1],
        name: "White Linen Button-Up",
        description:
          "Crisp white linen shirt. Perfect for summer. Barely worn.",
        price: 32.0,
        compare_at_price: null,
        condition: "like_new",
        size: "L",
        brand: "Uniqlo",
        category_id: 1,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
        ],
      },
      {
        seller_id: sellerIds[1],
        name: "Leather Chelsea Boots",
        description:
          "Quality leather Chelsea boots. Some wear on soles but tons of life left. Size 10.",
        price: 75.0,
        compare_at_price: 180.0,
        condition: "good",
        size: "10",
        brand: "Thursday Boot Co.",
        category_id: 5,
        images: [
          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800",
        ],
      },

      // Sophia's listings
      {
        seller_id: sellerIds[2],
        name: "Silk Slip Dress",
        description:
          "Gorgeous silk slip dress in champagne color. Worn once to a wedding. Almost new.",
        price: 68.0,
        compare_at_price: 150.0,
        condition: "like_new",
        size: "S",
        brand: "Reformation",
        category_id: 3,
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
        ],
      },
      {
        seller_id: sellerIds[2],
        name: "High-Waisted Wide Leg Pants",
        description:
          "Trendy wide leg pants in cream. Perfect condition. Size small.",
        price: 42.0,
        compare_at_price: null,
        condition: "like_new",
        size: "S",
        brand: "Zara",
        category_id: 2,
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        ],
      },
      {
        seller_id: sellerIds[2],
        name: "Leather Crossbody Bag",
        description:
          "Tan leather crossbody bag. Shows character with minor wear. Very functional.",
        price: 48.0,
        compare_at_price: null,
        condition: "good",
        size: "One Size",
        brand: "Madewell",
        category_id: 5,
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
        ],
      },
      {
        seller_id: sellerIds[2],
        name: "Knit Cardigan",
        description:
          "Cozy oversized knit cardigan. Neutral beige color goes with everything.",
        price: 38.0,
        compare_at_price: null,
        condition: "good",
        size: "M",
        brand: "H&M",
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
        ],
      },

      // Liam's listings
      {
        seller_id: sellerIds[3],
        name: "Vintage Carhartt Jacket",
        description:
          "Classic Carhartt work jacket with authentic wear. Size large.",
        price: 65.0,
        compare_at_price: null,
        condition: "good",
        size: "L",
        brand: "Carhartt",
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
        ],
      },
      {
        seller_id: sellerIds[3],
        name: "Cotton Chino Shorts",
        description:
          "Navy chino shorts in great condition. Perfect for summer. Size 32.",
        price: 25.0,
        compare_at_price: null,
        condition: "good",
        size: "32",
        brand: "Gap",
        category_id: 2,
        images: [
          "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800",
        ],
      },
      {
        seller_id: sellerIds[3],
        name: "Striped Rugby Shirt",
        description:
          "Classic striped rugby shirt. Thick quality fabric. Size medium.",
        price: 32.0,
        compare_at_price: null,
        condition: "good",
        size: "M",
        brand: "Ralph Lauren",
        category_id: 1,
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        ],
      },
      {
        seller_id: sellerIds[3],
        name: "Canvas Tote Bag",
        description:
          "Sturdy canvas tote with leather straps. Some patina on leather adds character.",
        price: 22.0,
        compare_at_price: null,
        condition: "good",
        size: "One Size",
        brand: "Everlane",
        category_id: 5,
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
        ],
      },

      // More diverse items
      {
        seller_id: sellerIds[0],
        name: "Floral Midi Dress",
        description:
          "Beautiful floral print midi dress. Perfect for spring/summer. Size small.",
        price: 45.0,
        compare_at_price: 98.0,
        condition: "like_new",
        size: "S",
        brand: "& Other Stories",
        category_id: 3,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        ],
      },
      {
        seller_id: sellerIds[1],
        name: "Black Turtleneck Sweater",
        description:
          "Merino wool turtleneck. Timeless piece in excellent condition.",
        price: 52.0,
        compare_at_price: null,
        condition: "like_new",
        size: "M",
        brand: "Uniqlo",
        category_id: 1,
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
        ],
      },
      {
        seller_id: sellerIds[2],
        name: "Denim Jacket",
        description:
          "Light wash denim jacket. Classic style, fits true to size.",
        price: 48.0,
        compare_at_price: null,
        condition: "good",
        size: "M",
        brand: "Madewell",
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        ],
      },
      {
        seller_id: sellerIds[3],
        name: "Gold Hoop Earrings",
        description: "Classic gold-plated hoops. Never worn, with tags.",
        price: 18.0,
        compare_at_price: 35.0,
        condition: "new",
        size: "One Size",
        brand: "Mejuri",
        category_id: 5,
        images: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
        ],
      },
      {
        seller_id: sellerIds[0],
        name: "White Sneakers",
        description:
          "Minimalist white leather sneakers. Gently worn, cleaned and ready to go.",
        price: 55.0,
        compare_at_price: 95.0,
        condition: "good",
        size: "8",
        brand: "Common Projects",
        category_id: 5,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        ],
      },
    ];

    // Insert products
    for (const product of products) {
      const result = await run(
        `INSERT INTO products (seller_id, category_id, name, description, price, compare_at_price, condition, size, brand, stock_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.seller_id,
          product.category_id,
          product.name,
          product.description,
          product.price,
          product.compare_at_price,
          product.condition,
          product.size,
          product.brand,
          1,
        ]
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

      console.log(
        `✅ Added: ${product.name} (by ${
          product.seller_id === sellerIds[0]
            ? "Emma"
            : product.seller_id === sellerIds[1]
            ? "Noah"
            : product.seller_id === sellerIds[2]
            ? "Sophia"
            : "Liam"
        })`
      );
    }

    console.log("\n🎉 Thrift marketplace data seeded!");
    console.log("\n📝 Demo Login (any user):");
    console.log("   Email: emma@thrift.ivy (or noah@, sophia@, liam@)");
    console.log("   Password: password123");
    console.log("\n🚀 Start your app and browse secondhand finds!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedThriftData();
