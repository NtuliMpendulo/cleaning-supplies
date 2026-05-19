-- CleanSupply Database Schema
-- Compatible with PostgreSQL and Azure SQL Database

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',
  is_admin BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  category_id INT REFERENCES categories(id),
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  image_url VARCHAR(500),
  images TEXT[], -- Array of image URLs
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_method VARCHAR(50), -- stripe, paypal, bank_transfer
  stripe_payment_id VARCHAR(255),
  shipping_address TEXT,
  billing_address TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order Items Table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Cart Table (for persistent shopping carts)
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- Cart Items Table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- Reviews Table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  order_id INT REFERENCES orders(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Wishlist Table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlists(user_id);

-- Coupons/Discounts Table
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20), -- percentage, fixed
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase_amount DECIMAL(10, 2),
  max_uses INT,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- Payments Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  status VARCHAR(50), -- pending, succeeded, failed, refunded
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_id);

-- Emails Log Table (for tracking sent emails)
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  email_type VARCHAR(50), -- order_confirmation, shipment, etc
  order_id INT REFERENCES orders(id),
  user_id INT REFERENCES users(id),
  status VARCHAR(50), -- sent, failed, bounced
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_order ON email_logs(order_id);

-- Analytics Table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50), -- page_view, product_view, add_to_cart, purchase
  user_id INT REFERENCES users(id),
  product_id INT REFERENCES products(id),
  order_id INT REFERENCES orders(id),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_event ON analytics(event_type);
CREATE INDEX idx_analytics_created ON analytics(created_at);

-- Audit Log Table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INT,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Sample Data
INSERT INTO categories (name, slug, description) VALUES
  ('General Cleaning', 'general-cleaning', 'All-purpose cleaning products'),
  ('Disinfectants', 'disinfectants', 'Disinfectant sprays and solutions'),
  ('Floor Care', 'floor-care', 'Floor cleaning and maintenance'),
  ('Glass Cleaner', 'glass-cleaner', 'Window and glass cleaning products'),
  ('Bathroom', 'bathroom', 'Bathroom cleaning supplies'),
  ('Laundry', 'laundry', 'Laundry detergents and softeners');

INSERT INTO products (name, slug, description, price, cost_price, category_id, stock_quantity, sku, is_active, is_featured) VALUES
  ('All-Purpose Cleaner', 'all-purpose-cleaner', 'Powerful multi-surface cleaner', 89.99, 40.00, 1, 100, 'APC-001', TRUE, TRUE),
  ('Disinfectant Spray', 'disinfectant-spray', 'Hospital-grade disinfectant', 129.99, 60.00, 2, 80, 'DIS-001', TRUE, TRUE),
  ('Floor Cleaner', 'floor-cleaner', 'Specialized floor cleaning formula', 99.99, 45.00, 3, 60, 'FLC-001', TRUE, FALSE),
  ('Glass Cleaner', 'glass-cleaner', 'Streak-free window cleaner', 79.99, 35.00, 4, 120, 'GLC-001', TRUE, FALSE),
  ('Bathroom Cleaner', 'bathroom-cleaner', 'Removes soap scum and mildew', 109.99, 50.00, 5, 70, 'BAC-001', TRUE, FALSE),
  ('Laundry Detergent', 'laundry-detergent', 'Heavy-duty stain removal', 149.99, 70.00, 6, 90, 'LAU-001', TRUE, TRUE);
