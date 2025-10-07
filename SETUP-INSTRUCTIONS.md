# WearMatch AI - Setup Instructions

## Step 1: Enable Cloud Backend

Your app requires **Lovable Cloud** for authentication, database, and cart functionality.

1. Open the **Cloud** tab in Lovable
2. Cloud should already be enabled
3. Wait for the build to complete

## Step 2: Set Up Database

1. Go to **Cloud → Database → SQL Editor**
2. Run the SQL script from `database-setup.sql`
3. This will create:
   - Products and variants tables
   - Sneakers and AI matching tables
   - User profiles and roles
   - Shopping cart tables
   - Sample seed data (6 sneakers, 5 products with variants)

## Step 3: Create Admin Account

### 3.1 Sign Up
1. Go to `/auth` in your app
2. Create account with:
   - Email: `admin@app.com`
   - Password: `kptjms991`
   - Full Name: `Admin User`

### 3.2 Assign Admin Role
1. Go to **Cloud → Database → SQL Editor**
2. Find your user ID:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'admin@app.com';
   ```
3. Copy the `id` value
4. Run this command (replace `YOUR_USER_ID_HERE` with the copied ID):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID_HERE', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

### 3.3 Verify Admin Access
1. Sign in with `admin@app.com` / `kptjms991`
2. Navigate to `/admin`
3. You should see the Admin Dashboard

## Step 4: Disable Email Confirmation (Optional - for testing)

To speed up testing:
1. Go to **Cloud → Authentication → Settings**
2. Find "Confirm email" option
3. Disable it
4. Now signups won't require email verification

## Features Overview

### For Customers:
- **Browse Products** (`/products`) - Filter by Unisex/Mens/Kids
- **Product Details** (`/product/:id`) - Select size, color, add to cart
- **AI Match Studio** (`/ai-match`) - Upload sneaker images (UI ready, AI integration pending)
- **Shopping Cart** (`/cart`) - Manage items, see totals
- **Authentication** (`/auth`) - Sign up, sign in

### For Admins:
- **Admin Dashboard** (`/admin`) - Requires admin role
- Product management (UI ready)
- Order management (UI ready)
- SVG design uploads (UI ready)
- Color palette management (UI ready)

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Email/Password (Google can be added)
- **Payments**: Stripe integration available (to be added)

## Next Steps

1. **Add Real Products**: Use admin panel or SQL to add your product catalog
2. **Configure Payments**: Enable Stripe for checkout functionality
3. **AI Integration**: Connect AI matching engine for sneaker recommendations
4. **Deployment**: Use the Publish button to deploy your app

## Troubleshooting

- **"Missing Supabase environment variables"**: Cloud is still provisioning, wait for build to complete
- **"Access denied: Admin only"**: Make sure you ran the admin role SQL command
- **Products not showing**: Run the `database-setup.sql` seed data
- **Can't sign in**: Check if email confirmation is disabled in Cloud settings

## Support

For help with Lovable Cloud:
- [Cloud Documentation](https://docs.lovable.dev/features/cloud)
- [Troubleshooting Guide](https://docs.lovable.dev/tips-tricks/troubleshooting)
