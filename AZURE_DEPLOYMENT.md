# Azure Deployment Guide

Complete step-by-step guide to deploy the CleanSupply e-commerce platform on Azure.

## Prerequisites

- Azure account (free trial or paid)
- Azure CLI installed (`az` command)
- GitHub repository connected
- Node.js 22+ installed locally
- PostgreSQL client tools (optional)

## Phase 1: Create Azure Resources

### Step 1: Create Resource Group

```bash
az group create \
  --name cleaning-supplies-rg \
  --location southafricanorth
```

**Alternative locations:**
- `westeurope` - Europe (West)
- `eastus` - United States (East)
- `southeastasia` - Southeast Asia

### Step 2: Create Azure SQL Database

#### Create SQL Server
```bash
az sql server create \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-srv \
  --admin-user dbadmin \
  --admin-password "YourSecurePassword123!@" \
  --location southafricanorth
```

**⚠️ Important:** Save the password securely!

#### Create Database
```bash
az sql db create \
  --resource-group cleaning-supplies-rg \
  --server cleaning-supplies-srv \
  --name cleaningsupplies_db \
  --service-objective Basic
```

#### Allow Azure Services to Access Database
```bash
az sql server firewall-rule create \
  --resource-group cleaning-supplies-rg \
  --server cleaning-supplies-srv \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### Allow Your IP (for local development)
```bash
# Get your public IP
curl https://api.ipify.org

# Add firewall rule
az sql server firewall-rule create \
  --resource-group cleaning-supplies-rg \
  --server cleaning-supplies-srv \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### Step 3: Create App Service Plan

```bash
az appservice plan create \
  --name cleaning-supplies-plan \
  --resource-group cleaning-supplies-rg \
  --sku B1 \
  --is-linux
```

**Pricing tiers:**
- `B1` - Basic (R200-400/month) - Good for testing
- `B2` - Standard (R400-800/month) - Good for production
- `B3` - Premium (R800+/month) - High traffic

### Step 4: Create Web App

```bash
az webapp create \
  --resource-group cleaning-supplies-rg \
  --plan cleaning-supplies-plan \
  --name cleaning-supplies-api \
  --runtime "node|22"
```

**Note:** App name must be globally unique. If `cleaning-supplies-api` is taken, use a different name.

### Step 5: Create Storage Account (for images)

```bash
az storage account create \
  --resource-group cleaning-supplies-rg \
  --name cleaningsuppliesstore \
  --location southafricanorth \
  --sku Standard_LRS
```

**Note:** Storage account name must be lowercase and globally unique.

### Step 6: Get Connection Strings

#### SQL Database Connection String
```bash
az sql db show-connection-string \
  --server cleaning-supplies-srv \
  --name cleaningsupplies_db \
  --client sqlcmd
```

**Format for Node.js:**
```
Server=tcp:cleaning-supplies-srv.database.windows.net,1433;
Initial Catalog=cleaningsupplies_db;
Persist Security Info=False;
User ID=dbadmin;
Password=YourPassword123!@;
Encrypt=True;
Connection Timeout=30;
```

#### Storage Connection String
```bash
az storage account show-connection-string \
  --resource-group cleaning-supplies-rg \
  --name cleaningsuppliesstore
```

---

## Phase 2: Configure Application Settings

### Set Environment Variables in Azure

```bash
az webapp config appsettings set \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-api \
  --settings \
    DATABASE_URL="Server=tcp:cleaning-supplies-srv.database.windows.net,1433;Initial Catalog=cleaningsupplies_db;Persist Security Info=False;User ID=dbadmin;Password=YourPassword123!@;Encrypt=True;Connection Timeout=30;" \
    STRIPE_SECRET_KEY="sk_live_YOUR_KEY" \
    STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY" \
    SENDGRID_API_KEY="SG.YOUR_KEY" \
    SENDGRID_FROM_EMAIL="noreply@cleansupply.com" \
    JWT_SECRET="generate-a-random-secret-key" \
    NODE_ENV="production" \
    PORT="8080"
```

### Get Stripe Keys

1. Go to https://dashboard.stripe.com
2. Navigate to API Keys
3. Copy your Secret Key (starts with `sk_live_`)
4. Copy your Publishable Key (starts with `pk_live_`)

### Get SendGrid API Key

1. Go to https://sendgrid.com
2. Navigate to Settings → API Keys
3. Create new API Key
4. Copy the key

---

## Phase 3: Initialize Database

### Option A: Using Azure Portal

1. Go to Azure Portal → SQL Databases → cleaningsupplies_db
2. Click "Query editor"
3. Login with `dbadmin` and password
4. Copy-paste contents of `database/schema.sql`
5. Click "Run"

### Option B: Using Azure CLI

```bash
# Download the schema
curl -o schema.sql https://raw.githubusercontent.com/YOUR_REPO/cleaning_supplies/main/database/schema.sql

# Run migrations
sqlcmd -S cleaning-supplies-srv.database.windows.net -U dbadmin -P "YourPassword123!@" -d cleaningsupplies_db -i schema.sql
```

### Option C: Using Node.js Script

```bash
# Create migration script
cat > scripts/migrate.js << 'EOF'
import { Pool } from 'pg';
import fs from 'fs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const schema = fs.readFileSync('database/schema.sql', 'utf8');

pool.query(schema)
  .then(() => {
    console.log('✓ Database migrated successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
EOF

# Run migration
npm run migrate
```

---

## Phase 4: Deploy from GitHub

### Option A: Continuous Deployment (Recommended)

1. Go to Azure Portal → App Service → Deployment Center
2. Select "GitHub" as source
3. Click "Authorize" and login to GitHub
4. Select your repository
5. Select branch: `main`
6. Click "Save"

Azure will automatically deploy on every push to main branch.

### Option B: Manual Deployment

```bash
# Build locally
npm run build

# Deploy using Azure CLI
az webapp up \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-api \
  --runtime "node|22"
```

---

## Phase 5: Verify Deployment

### Check App Status
```bash
az webapp show \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-api \
  --query "state"
```

### View Logs
```bash
az webapp log tail \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-api
```

### Test API
```bash
curl https://cleaning-supplies-api.azurewebsites.net/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-05-19T10:30:00.000Z",
  "environment": "production"
}
```

---

## Phase 6: Configure Custom Domain (Optional)

### Add Custom Domain
```bash
az webapp config hostname add \
  --resource-group cleaning-supplies-rg \
  --webapp-name cleaning-supplies-api \
  --hostname cleansupply.com
```

### Create SSL Certificate
```bash
az appservice web config ssl upload \
  --resource-group cleaning-supplies-rg \
  --name cleaning-supplies-api \
  --certificate-file certificate.pfx \
  --certificate-password password
```

---

## Phase 7: Monitoring & Maintenance

### Enable Application Insights
```bash
az monitor app-insights component create \
  --app cleaning-supplies-insights \
  --location southafricanorth \
  --resource-group cleaning-supplies-rg
```

### View Metrics
```bash
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/cleaning-supplies-rg/providers/Microsoft.Web/sites/cleaning-supplies-api \
  --metric "Http5xx"
```

### Set Up Alerts
```bash
az monitor metrics alert create \
  --name HighErrorRate \
  --resource-group cleaning-supplies-rg \
  --scopes /subscriptions/{subscription-id}/resourceGroups/cleaning-supplies-rg/providers/Microsoft.Web/sites/cleaning-supplies-api \
  --condition "avg Http5xx > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action email-action
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
sqlcmd -S cleaning-supplies-srv.database.windows.net -U dbadmin -P "YourPassword123!@" -d cleaningsupplies_db -Q "SELECT 1"
```

### App Not Starting

```bash
# Check logs
az webapp log tail --resource-group cleaning-supplies-rg --name cleaning-supplies-api

# Restart app
az webapp restart --resource-group cleaning-supplies-rg --name cleaning-supplies-api
```

### High Memory Usage

```bash
# Scale up
az appservice plan update \
  --name cleaning-supplies-plan \
  --resource-group cleaning-supplies-rg \
  --sku B2
```

---

## Cost Optimization

### Reduce Costs

1. **Use Basic tier** during development (R200-400/month)
2. **Enable auto-scale** for production
3. **Use reserved instances** for long-term commitments
4. **Clean up unused resources**

```bash
# Delete resource group (deletes all resources)
az group delete --name cleaning-supplies-rg
```

---

## Backup & Recovery

### Create Database Backup
```bash
az sql db copy \
  --resource-group cleaning-supplies-rg \
  --server cleaning-supplies-srv \
  --name cleaningsupplies_db \
  --dest-name cleaningsupplies_db_backup
```

### Restore from Backup
```bash
az sql db restore \
  --resource-group cleaning-supplies-rg \
  --name cleaningsupplies_db \
  --server cleaning-supplies-srv \
  --time "2024-05-19T10:30:00Z"
```

---

## Security Best Practices

- ✅ Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- ✅ Enable Azure Defender for SQL
- ✅ Use managed identities instead of connection strings
- ✅ Enable HTTPS only
- ✅ Regularly update dependencies
- ✅ Use Azure Key Vault for secrets
- ✅ Enable audit logging
- ✅ Restrict firewall rules

---

## Support & Resources

- [Azure Documentation](https://docs.microsoft.com/azure)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure)
- [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database)
- [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service)

---

**Deployed successfully? Great! Your CleanSupply platform is now live on Azure! 🚀**
