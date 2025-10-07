-- ============================================
-- ADMIN ACCOUNT SETUP
-- Run this AFTER creating the admin account via signup
-- ============================================

-- Step 1: First, sign up at /auth with:
-- Email: admin@app.com
-- Password: kptjms991

-- Step 2: After signup, find the user_id by running:
SELECT id, email FROM auth.users WHERE email = 'admin@app.com';

-- Step 3: Copy the user ID from above and replace 'YOUR_USER_ID_HERE' below:
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Verify admin role was assigned:
SELECT 
  u.email, 
  ur.role 
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@app.com';

-- ============================================
-- ALTERNATIVE: If you already know the user_id
-- Replace the UUID below with the actual user_id
-- ============================================

-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('12345678-1234-1234-1234-123456789abc', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
