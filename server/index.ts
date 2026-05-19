import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || '',
  },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ==================== PRODUCTS ROUTES ====================

// Get all products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];

    if (category) {
      query += ' AND category_id = (SELECT id FROM categories WHERE slug = $1)';
      params.push(category);
    }

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin)
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, category_id, stock_quantity, sku } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, slug, description, price, category_id, stock_quantity, sku, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [name, slug, description, price, category_id, stock_quantity, sku]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ==================== ORDERS ROUTES ====================

// Create order
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { user_id, items, total_amount, shipping_address, billing_address } = req.body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_number, total_amount, subtotal, status, payment_status, shipping_address, billing_address)
       VALUES ($1, $2, $3, $4, 'pending', 'unpaid', $5, $6)
       RETURNING *`,
      [user_id, orderNumber, total_amount, total_amount, JSON.stringify(shipping_address), JSON.stringify(billing_address)]
    );

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.quantity * item.price]
      );
    }

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;

    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ==================== PAYMENT ROUTES ====================

// Create payment intent
app.post('/api/payments/create-intent', async (req: Request, res: Response) => {
  try {
    const { amount, order_id } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'zar',
      metadata: {
        order_id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Stripe webhook
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.order_id;

      // Update order payment status
      await pool.query(
        `UPDATE orders SET payment_status = 'paid', status = 'confirmed', stripe_payment_id = $1 WHERE id = $2`,
        [paymentIntent.id, orderId]
      );

      // Get order details for email
      const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
      const order = orderResult.rows[0];

      // Send confirmation email
      await emailTransporter.sendMail({
        from: process.env.SENDGRID_FROM_EMAIL,
        to: order.email,
        subject: `Order Confirmation - ${order.order_number}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Order Number: ${order.order_number}</p>
          <p>Total Amount: R${order.total_amount.toFixed(2)}</p>
          <p>We'll send you a shipping update soon.</p>
        `,
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ==================== CATEGORIES ROUTES ====================

// Get all categories
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== SERVER STARTUP ====================

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Database connected');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║      CleanSupply API Server           ║
╠═══════════════════════════════════════╣
║ Server running on port ${PORT}          ║
║ Environment: ${process.env.NODE_ENV}         ║
║ Database: ${process.env.DATABASE_URL ? '✓ Connected' : '✗ Not configured'}  ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
