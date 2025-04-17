import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const { Pool } = pkg;

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
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static image files from "uploads" folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// 📝 Create a new user
app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Server error while creating user' });
  }
});

// 🟢 Login API route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       if (user.password === password) {
//         res.status(200).json({ message: 'Login successful', user });
//       } else {
//         res.status(401).json({ error: 'Invalid email or password' });
//       }
//     } else {
//       res.status(401).json({ error: 'Invalid email or password' });
//     }
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.password === password) {
        res.status(200).json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// ❌ Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    if (result.rowCount > 0) {
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 📁 Multer setup for file uploads
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

// ➕ Add Product
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
    console.error("Database insert error:", err.message);
    res.status(500).json({ error: "Failed to insert product" });
  }
});

// 🟢 Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY productid ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 🧊 Get Product by ID
app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM products WHERE productid = $1', [productId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ✏️ Update Product
app.put('/api/products/:id', upload.single('productImage'), async (req, res) => {
  const productId = req.params.id;
  const { productName, category, price, imageUrl } = req.body;
  const imageFile = req.file?.filename;

  try {
    const query = `
      UPDATE products
      SET productname = $1, category = $2, price = $3, image = $4
      WHERE productid = $5
      RETURNING *`;
    const result = await pool.query(query, [productName, category, price, imageFile || imageUrl, productId]);
    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ❌ Delete Product
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const productResult = await pool.query('SELECT image FROM products WHERE productid = $1', [productId]);
    const product = productResult.rows[0];
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const imagePath = path.join('uploads', product.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await pool.query('DELETE FROM products WHERE productid = $1', [productId]);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


// // ✏️ Update user profile
// app.put('/api/users/:id', async (req, res) => {
//   const userId = req.params.id;
//   const { username, email, password } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
//       [username, email, password, userId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
//   } catch (err) {
//     console.error('Error updating user profile:', err.message);
//     res.status(500).json({ error: 'Failed to update user profile' });
//   }
// });

app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  console.log('Updating user:', { userId, name, email, password });

  // Validate
  if (!userId || !name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Database error while updating user' });
  }
});


// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
