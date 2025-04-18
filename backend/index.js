import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

const { Pool } = pkg;
const PgSession = pgSession(session);

// 🔌 PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'metal_db',
  password: 'Roshan123',
  port: 5432,
});

// 🚀 Express app setup
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,

}));
app.use(bodyParser.json());

// ✅ Serve static image files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 🔐 Session setup
app.use(session({
  store: new PgSession({ pool }),
  secret: 'your-secret-key', // replace with a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// 📦 Multer file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Add this logging middleware
app.use((req, res, next) => {
  console.log(`🔄 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 🔐 Login route with session
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0 && result.rows[0].password === password) {
      req.session.user = { id: result.rows[0].id, username: result.rows[0].username };
      res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 🚪 Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Failed to logout' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// ✅ CRUD Routes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    result.rowCount > 0
      ? res.json({ success: true, message: 'User deleted' })
      : res.status(404).json({ success: false, message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// 📦 Products Routes
app.post('/api/products', upload.single('productImage'), async (req, res) => {
  const { productName, price, category } = req.body;
  const image = req.file?.filename;
  if (!image) return res.status(400).json({ error: "Image upload failed" });

  try {
    const query = `
      INSERT INTO products (productname, image, category, price, createdat)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *`;
    const result = await pool.query(query, [productName, image, category, price]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to insert product" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY productid ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE productid = $1', [id]);
    result.rows.length
      ? res.json(result.rows[0])
      : res.status(404).json({ error: 'Product not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

app.put('/api/products/:id', upload.single('productImage'), async (req, res) => {
  const { id } = req.params;
  const { productName, category, price, imageUrl } = req.body;
  const image = req.file?.filename || imageUrl;

  try {
    const query = `
      UPDATE products
      SET productname = $1, category = $2, price = $3, image = $4
      WHERE productid = $5
      RETURNING *`;
    const result = await pool.query(query, [productName, category, price, image, id]);
    result.rowCount > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ error: 'Product not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query('SELECT image FROM products WHERE productid = $1', [id]);
    if (!product.rows.length) return res.status(404).json({ error: 'Product not found' });

    const imagePath = path.join('uploads', product.rows[0].image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await pool.query('DELETE FROM products WHERE productid = $1', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 🛒 Cart Routes
app.post('/api/cart', async (req, res) => {
  console.log('📝 Adding item to cart:', req.body);
  const { userId, productId, quantity } = req.body;
  
  // Validate input
  if (!userId || !productId || !quantity) {
    console.log('❌ Invalid cart input:', { userId, productId, quantity });
    return res.status(400).json({ error: 'Missing required fields: userId, productId, and quantity are required' });
  }

  // Convert to integers to avoid type issues
  const userIdInt = parseInt(userId);
  const productIdInt = parseInt(productId);
  const quantityInt = parseInt(quantity);
  
  try {
    // Check if user exists
    console.log(`🔍 Checking if user exists: ${userIdInt}`);
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [userIdInt]);
    if (userExists.rows.length === 0) {
      console.log('❌ User not found:', userIdInt);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if product exists
    console.log(`🔍 Checking if product exists: ${productIdInt}`);
    const productExists = await pool.query('SELECT productid, productname FROM products WHERE productid = $1', [productIdInt]);
    if (productExists.rows.length === 0) {
      console.log('❌ Product not found:', productIdInt);
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists in cart
    console.log('🔍 Checking if item exists in cart...');
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE userid = $1 AND productid = $2',
      [userIdInt, productIdInt]
    );

    let result;
    if (existingItem.rows.length > 0) {
      console.log('✏️ Updating existing cart item');
      result = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE userid = $2 AND productid = $3 RETURNING *',
        [quantityInt, userIdInt, productIdInt]
      );
    } else {
      console.log('➕ Adding new item to cart');
      result = await pool.query(
        'INSERT INTO cart_items (userid, productid, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userIdInt, productIdInt, quantityInt]
      );
    }
    console.log('✅ Cart operation successful:', result.rows[0]);
    
    // Return more detailed response
    const productInfo = productExists.rows[0];
    res.status(200).json({
      message: 'Item added to cart successfully',
      cartItem: {
        ...result.rows[0],
        productname: productInfo.productname
      }
    });
  } catch (err) {
    console.error('❌ Error managing cart:', err);
    res.status(500).json({ error: 'Failed to manage cart', details: err.message });
  }
});

// Get user's cart items
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('🔍 Fetching cart for user:', userId);
  
  if (!userId) {
    console.log('❌ No userId provided');
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // First check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(
      `SELECT ci.*, p.productname, p.price, p.image, p.category
       FROM cart_items ci
       JOIN products p ON ci.productid = p.productid
       WHERE ci.userid = $1`,
      [userId]
    );
    console.log(`✅ Found ${result.rows.length} items in cart for user ${userId}`);
    
    // Log the first item for debugging
    if (result.rows.length > 0) {
      console.log('📋 First cart item sample:', result.rows[0]);
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
});

// Update cart item quantity
app.put('/api/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE cartid = $2 RETURNING *',
      [quantity, cartId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
app.delete('/api/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM cart_items WHERE cartid = $1', [cartId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// Clear user's cart
app.delete('/api/cart/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    await pool.query('DELETE FROM cart_items WHERE userid = $1', [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// 📦 Orders Routes
app.post('/api/orders', async (req, res) => {
  console.log('📝 Creating new order:', req.body);
  const { userId, products, totalAmount, shippingAddress, paymentMethod = 'Cash on Delivery', orderStatus = 'pending' } = req.body;
  
  // Validate required fields
  if (!userId || !products || !Array.isArray(products) || products.length === 0 || !totalAmount || !shippingAddress) {
    console.error('❌ Missing required order fields:', { 
      hasUserId: !!userId, 
      hasProducts: !!products, 
      isProductsArray: Array.isArray(products),
      productsLength: products ? products.length : 0,
      hasTotalAmount: !!totalAmount, 
      hasShippingAddress: !!shippingAddress 
    });
    return res.status(400).json({ 
      error: 'Missing required order fields',
      details: 'All of userId, products array, totalAmount, and shippingAddress are required'
    });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🔄 Started transaction');

    // Insert the order
    const orderResult = await client.query(
      `INSERT INTO orders (userid, total_amount, shipping_address, payment_method, order_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING orderid`,
      [userId, totalAmount, shippingAddress, paymentMethod, orderStatus]
    );
    
    const orderId = orderResult.rows[0].orderid;
    console.log('✅ Created order:', orderId);

    // Insert order items
    console.log('🔄 Adding order items...');
    for (const product of products) {
      if (!product.productId) {
        console.error('❌ Product missing productId:', product);
        throw new Error('Product missing productId');
      }
      
      await client.query(
        `INSERT INTO order_items (orderid, productid, quantity, price_at_time)
         VALUES ($1, $2, $3, $4)`,
        [orderId, product.productId, product.quantity, product.price]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Order completed successfully');
    res.status(201).json({
      message: 'Order created successfully',
      orderId: orderId
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating order:', err);
    res.status(500).json({ 
      error: 'Failed to create order', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    client.release();
  }
});

// Get all orders for a user
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT o.*, 
              json_agg(json_build_object(
                'productId', oi.productid,
                'quantity', oi.quantity,
                'priceAtTime', oi.price_at_time,
                'productName', p.productname,
                'productImage', p.image
              )) as items
       FROM orders o
       JOIN order_items oi ON o.orderid = oi.orderid
       JOIN products p ON oi.productid = p.productid
       WHERE o.userid = $1
       GROUP BY o.orderid
       ORDER BY o.createdat DESC`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
app.put('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE orderid = $2 RETURNING *',
      [orderStatus, orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
              u.username,
              json_agg(json_build_object(
                'productId', oi.productid,
                'quantity', oi.quantity,
                'priceAtTime', oi.price_at_time,
                'productName', p.productname
              )) as items
       FROM orders o
       JOIN users u ON o.userid = u.id
       JOIN order_items oi ON o.orderid = oi.orderid
       JOIN products p ON oi.productid = p.productid
       GROUP BY o.orderid, u.username
       ORDER BY o.createdat DESC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
