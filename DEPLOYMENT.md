
# FleetOps AI - Enterprise Deployment Guide

Follow these steps to deploy the Fleet Management System to a production environment using Vercel and Supabase.

## 1. Supabase Setup (PostgreSQL & Auth)

### Database Schema
Navigate to the **SQL Editor** in your Supabase dashboard and execute the following schema initialization:

```sql
-- Core Tables
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT UNIQUE NOT NULL,
  registration_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  status TEXT DEFAULT 'ACTIVE',
  mileage INTEGER DEFAULT 0,
  fuel_level INTEGER DEFAULT 100,
  location JSONB,
  driver_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  rating NUMERIC(3,2) DEFAULT 5.0,
  status TEXT DEFAULT 'OFF_DUTY',
  vehicle_id UUID REFERENCES vehicles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  expiry_date DATE,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  category TEXT DEFAULT 'SYSTEM',
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### Storage Configuration
1. Go to **Storage** > **New Bucket**.
2. Name it `fleet-docs`.
3. Keep it **Private** (Not Public).
4. Add **RLS Policies**:
   - `SELECT`: `auth.role() = 'authenticated'`
   - `INSERT`: `auth.role() = 'authenticated'`

### Security (RLS)
Enable Row Level Security on all tables:
```sql
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON vehicles FOR SELECT TO authenticated USING (true);
```

## 2. Vercel Deployment

### Environment Variables
Add these variables in your Vercel Project Settings:

| Variable | Source | Visibility |
|----------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings | Public |
| `API_KEY` | Google AI Studio (Gemini) | Secret |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings | Secret (Server-only) |

### Build Settings
- **Framework Preset**: Other (Standard SPA) or Next.js if using App Router.
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (or `.next`)

## 3. Post-Deployment Validation Checklist

- [ ] **Auth Flow**: Register a test user and verify they appear in Supabase Auth.
- [ ] **AI Advisor**: Ask "How is my fleet doing?" to verify the Gemini API connection.
- [ ] **Document Upload**: Upload a PDF and check the `fleet-docs` bucket.
- [ ] **Real-time Alerts**: Manually insert a row into `notifications` and verify the UI updates instantly.
- [ ] **Analytics**: Ensure charts render without data fetch errors.

## 4. Security Hardening
- Rotate the `API_KEY` every 90 days.
- Use Supabase **Vault** for storing sensitive connection strings if utilizing Edge Functions.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is **never** used in client-side code (`lib/supabase.ts`).
