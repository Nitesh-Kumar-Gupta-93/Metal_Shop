import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'metal_db',
  password: 'Roshan123',
  port: 5432,
});

const sampleProducts = [
  {
    productname: 'Metal Gate',
    category: 'Gates',
    price: 299.99,
    image: 'metal-gate.jpg'
  },
  {
    productname: 'Steel Railing',
    category: 'Railings',
    price: 149.99,
    image: 'steel-railing.jpg'
  },
  {
    productname: 'Decorative Metal Panel',
    category: 'Panels',
    price: 199.99,
    image: 'decorative-panel.jpg'
  },
  {
    productname: 'Iron Security Door',
    category: 'Doors',
    price: 399.99,
    image: 'security-door.jpg'
  }
];

const createTablesAndSeedData = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting database setup...');

    // Test database connection
    await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Create users table
    console.log('🔄 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create products table
    console.log('🔄 Creating products table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        productid SERIAL PRIMARY KEY,
        productname VARCHAR(200) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100),
        price DECIMAL(10,2) NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Products table created');

    // Create cart_items table
    console.log('🔄 Creating cart_items table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        cartid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Cart items table created');

    // Create orders table
    console.log('🔄 Creating orders table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        orderid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE SET NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        shipping_address TEXT NOT NULL,
        order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table created');

    // Create order_items table
    console.log('🔄 Creating order_items table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        orderitemid SERIAL PRIMARY KEY,
        orderid INTEGER REFERENCES orders(orderid) ON DELETE CASCADE,
        productid INTEGER REFERENCES products(productid) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        price_at_time DECIMAL(10,2) NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Order items table created');

    // Insert sample products if products table is empty
    const existingProducts = await client.query('SELECT COUNT(*) FROM products');
    if (existingProducts.rows[0].count === '0') {
      console.log('🔄 Adding sample products...');
      for (const product of sampleProducts) {
        await client.query(
          `INSERT INTO products (productname, category, price, image)
           VALUES ($1, $2, $3, $4)`,
          [product.productname, product.category, product.price, product.image]
        );
      }
      console.log('✅ Sample products added successfully');
    } else {
      console.log('ℹ️ Products already exist in the database');
    }

    // Create a test user if users table is empty
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (existingUsers.rows[0].count === '0') {
      console.log('🔄 Creating test user...');
      await client.query(
        `INSERT INTO users (username, email, password)
         VALUES ($1, $2, $3)`,
        ['testuser', 'test@example.com', 'password123']
      );
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️ Users already exist in the database');
    }

    // Verify all tables and data
    const tables = ['users', 'products', 'cart_items', 'orders', 'order_items'];
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`📊 Table ${table} has ${result.rows[0].count} records`);
    }

    console.log('✨ Database setup completed successfully!');
  } catch (err) {
    console.error('❌ Error during database setup:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      table: err.table,
      constraint: err.constraint
    });
    throw err;
  } finally {
    console.log('🔄 Closing database connection...');
    client.release();
    await pool.end();
    console.log('✅ Database connection closed');
  }
};

// Run the setup
console.log('🚀 Starting database initialization...');
createTablesAndSeedData()
  .then(() => {
    console.log('✅ Database initialization completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });