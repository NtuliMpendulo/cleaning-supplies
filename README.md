# CleanSupply - E-Commerce Platform

A full-stack cleaning supplies e-commerce platform built with React, Node.js, Express, and PostgreSQL. Ready for Azure deployment.

## 🎯 Features

- **Product Catalog** - Browse and filter cleaning supplies by category
- **Shopping Cart** - Add/remove items with real-time updates
- **Checkout System** - Secure payment processing with Stripe
- **Order Management** - Track orders and order history
- **Email Confirmations** - Automated order confirmation emails
- **User Authentication** - Secure user accounts and login
- **Admin Dashboard** - Manage products, orders, and inventory
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Azure Ready** - Configured for Azure SQL Database and App Service

## 📋 Tech Stack

### Frontend
- React 19
- Tailwind CSS 4
- Wouter (routing)
- Stripe.js (payments)

### Backend
- Node.js 22
- Express.js
- PostgreSQL / Azure SQL
- Stripe API
- Nodemailer (email)

### Infrastructure
- Azure App Service (hosting)
- Azure SQL Database (data)
- Azure Storage (files)
- SendGrid (email service)

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL or Azure SQL Database
- Stripe account (for payments)
- SendGrid account (for emails)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd cleaning_supplies
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cleaning_supplies

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@cleansupply.com

# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Start development server**
```bash
npm run dev
```

7. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
cleaning_supplies/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Auth, validation
│   ├── services/          # Business logic
│   └── index.ts           # Server entry
├── shared/                # Shared types
├── database/              # Migrations & seeds
├── .env.example           # Environment template
└── package.json
```

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔑 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)
- `POST /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/status/:orderId` - Check payment status

### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/users/:id` - Update user profile

## 💳 Stripe Integration

### Setup
1. Create Stripe account at https://stripe.com
2. Get API keys from dashboard
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Payment Flow
1. User adds items to cart
2. User proceeds to checkout
3. Backend creates Stripe payment intent
4. Frontend displays Stripe payment form
5. User completes payment
6. Stripe webhook confirms payment
7. Order is created and confirmation email sent

## 📧 Email Configuration

### SendGrid Setup
1. Create SendGrid account at https://sendgrid.com
2. Create API key
3. Add to `.env`:
   ```env
   SENDGRID_API_KEY=SG...
   SENDGRID_FROM_EMAIL=noreply@cleansupply.com
   ```

### Email Templates
- Order confirmation
- Order shipped
- Order delivered
- Password reset
- Newsletter

## ☁️ Azure Deployment

### Prerequisites
- Azure account
- Azure CLI installed
- GitHub repository connected

### Step 1: Create Azure Resources

#### Create Resource Group
```bash
az group create \
  --name cleaning-supplies-rg \
  --location southafricanorth
```

#### Create Azure SQL Database
```bash
az sql server create \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-srv \
  --admin-user dbadmin \
  --admin-password YourPassword123!

az sql db create \
  --resource-group cleaning-supplies-rg \
  --server cleaning-supplies-srv \
  --name cleaningsupplies_db
```

#### Create App Service
```bash
az appservice plan create \
  --name cleaning-supplies-plan \
  --resource-group cleaning-supplies-rg \
  --sku B1 --is-linux

az webapp create \
  --resource-group cleaning-supplies-rg \
  --plan cleaning-supplies-plan \
  --name cleaning-supplies-api \
  --runtime "node|22"
```

### Step 2: Configure Environment Variables

In Azure Portal:
1. Go to App Service → Settings → Configuration
2. Add Application Settings:
   - `DATABASE_URL` - Azure SQL connection string
   - `STRIPE_SECRET_KEY` - Your Stripe key
   - `SENDGRID_API_KEY` - Your SendGrid key
   - `JWT_SECRET` - Generate a random string
   - `NODE_ENV` - production

### Step 3: Deploy from GitHub

1. In App Service → Deployment Center
2. Select GitHub as source
3. Authorize and select repository
4. Select branch (main)
5. Click Save

Azure will automatically deploy on every push to main branch.

### Step 4: Database Connection

Update your connection string in Azure:
```
Server=tcp:cleaning-supplies-srv.database.windows.net,1433;
Initial Catalog=cleaningsupplies_db;
Persist Security Info=False;
User ID=dbadmin;
Password=YourPassword123!;
Encrypt=True;
Connection Timeout=30;
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist
- [ ] Browse products
- [ ] Add/remove items from cart
- [ ] Checkout with test Stripe card
- [ ] Receive order confirmation email
- [ ] View order history
- [ ] Admin can manage products

## 📊 Monitoring

### Azure Monitor
- App Service metrics
- Database performance
- Error tracking
- Application insights

### Logs
```bash
# View app logs
az webapp log tail --resource-group cleaning-supplies-rg --name cleaning-supplies-api
```

## 🔐 Security

- ✅ HTTPS/SSL enforced
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Input validation
- ✅ Stripe PCI compliance

## 💰 Pricing & Costs

### Monthly Azure Costs (Estimated)
- App Service (B1): ~R200-400
- SQL Database (Basic): ~R100-300
- Storage: ~R50-100
- **Total: ~R350-800/month**

### Revenue Target: R10,000/month
- 50 orders × R200 average = R10,000
- Profit after Azure costs: ~R9,200

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue]
- Email: support@cleansupply.com
- Documentation: [Wiki]

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Customer reviews
- [ ] Wishlist feature
- [ ] Subscription orders
- [ ] Multi-currency support
- [ ] Analytics dashboard

---

**Built with ❤️ for South African entrepreneurs**
