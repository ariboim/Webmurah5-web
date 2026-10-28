-- ============================================================================
-- PT INOVASI TEKNOLOGI DIGITAL INDONESIA (ITDI)
-- WEB REPLIKA MITRA & REFERRAL TRACKING SYSTEM
-- Database Schema: PostgreSQL 14+ / Supabase / Neon / Cloud SQL
-- File: /src/db/referral_schema.sql
-- ============================================================================

-- 1. Enable UUID Extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
CREATE TYPE mitra_status_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'BLOCKED'
);

CREATE TYPE package_tier_enum AS ENUM (
    'UMKM',       -- Rp 499.000 (Flash Sale)
    'ELITE'       -- Rp 3.000.000 (Custom Web Corporate)
);

CREATE TYPE order_status_enum AS ENUM (
    'PENDING_REVIEW',
    'IN_PROGRESS',
    'COMPLETED_REVIEW',
    'PAID',
    'CANCELLED'
);

CREATE TYPE settlement_status_enum AS ENUM (
    'PENDING',
    'PROCESSED',
    'TRANSFERRED',
    'FAILED'
);

-- ============================================================================
-- 3. Master Table: MITRA (Partners)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mitra (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. 'ITDI-MTR-2026-5652'
    nama_lengkap VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,           -- Unique username for /reff/:namamitra (e.g. 'prima-aldino')
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,           -- e.g. '085811735280'
    phone_international VARCHAR(30) NOT NULL,    -- International format e.g. '6285811735280'
    password_hash VARCHAR(255) NOT NULL,
    pin_access VARCHAR(10),
    status mitra_status_enum NOT NULL DEFAULT 'PENDING',
    
    -- Legal & Identity Data
    nik VARCHAR(20),
    tempat_tanggal_lahir VARCHAR(150),
    alamat_ktp TEXT,
    kota_domisili VARCHAR(100),
    
    -- Settlement Bank Details (Bagi Hasil Mingguan 60% : 40%)
    nama_bank VARCHAR(50) DEFAULT 'BCA',
    nomor_rekening VARCHAR(50),
    nama_pemilik_rekening VARCHAR(150),
    
    -- Media & Documents
    foto_url TEXT,
    nomor_surat_perjanjian VARCHAR(100),
    tanggal_bergabung DATE DEFAULT CURRENT_DATE,
    admin_notes TEXT,
    
    -- Metrics Cache
    total_clicks INT NOT NULL DEFAULT 0,
    total_leads INT NOT NULL DEFAULT 0,
    total_orders INT NOT NULL DEFAULT 0,
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    blocked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for ultra-fast lookup on dynamic route /reff/:namamitra
CREATE INDEX idx_mitra_slug_status ON mitra (slug, status);
CREATE INDEX idx_mitra_status ON mitra (status);
CREATE INDEX idx_mitra_email ON mitra (email);
CREATE INDEX idx_mitra_phone ON mitra (phone_international);

-- ============================================================================
-- 4. Audit Table: REFERRAL_CLICKS (Visitor Traffic Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS referral_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mitra_id VARCHAR(50) NOT NULL REFERENCES mitra(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    visitor_ip VARCHAR(64),
    user_agent TEXT,
    referer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referral_clicks_mitra_created ON referral_clicks (mitra_id, created_at);
CREATE INDEX idx_referral_clicks_slug ON referral_clicks (slug);

-- ============================================================================
-- 5. Business Table: ORDERS (Sales Attribution & Commission Calculation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. 'ORD-20261027-0091'
    mitra_id VARCHAR(50) REFERENCES mitra(id) ON DELETE SET NULL, -- Attributed Partner
    mitra_slug VARCHAR(100),                     -- Snapshot of partner slug at purchase
    
    -- Client Information
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    client_email VARCHAR(150),
    client_business_name VARCHAR(150) NOT NULL,
    domain_choice VARCHAR(150) NOT NULL,
    package_type package_tier_enum NOT NULL DEFAULT 'UMKM',
    
    -- Financials & Split (60% Mitra : 40% Perusahaan)
    package_price NUMERIC(12, 2) NOT NULL DEFAULT 499000.00,
    discount_applied NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(12, 2) NOT NULL DEFAULT 499000.00,
    commission_mitra NUMERIC(12, 2) NOT NULL DEFAULT 299400.00,  -- 60%
    share_company NUMERIC(12, 2) NOT NULL DEFAULT 199600.00,     -- 40%
    
    -- Order State
    order_status order_status_enum NOT NULL DEFAULT 'PENDING_REVIEW',
    is_settled_to_mitra BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Lead Details
    product_details TEXT,
    target_audience TEXT,
    special_notes TEXT,
    ip_address VARCHAR(64),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_mitra_id ON orders (mitra_id);
CREATE INDEX idx_orders_status ON orders (order_status);
CREATE INDEX idx_orders_created ON orders (created_at);

-- ============================================================================
-- 6. Payout Table: MITRA_SETTLEMENTS (Weekly 60% Payout Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mitra_settlements (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. 'PAYOUT-202610-0012'
    mitra_id VARCHAR(50) NOT NULL REFERENCES mitra(id) ON DELETE RESTRICT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_orders_count INT NOT NULL DEFAULT 0,
    gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    net_payout NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Bank Transfer Reference
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder VARCHAR(150) NOT NULL,
    transfer_proof_url TEXT,
    status settlement_status_enum NOT NULL DEFAULT 'PENDING',
    
    processed_by VARCHAR(100),
    transferred_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settlements_mitra ON mitra_settlements (mitra_id);
CREATE INDEX idx_settlements_status ON mitra_settlements (status);

-- ============================================================================
-- 7. Trigger: Automatically Update Timestamps & Partner Metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_mitra_updated_at
    BEFORE UPDATE ON mitra
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 8. Seed Verified Initial Approved Partners
-- ============================================================================
INSERT INTO mitra (
    id, nama_lengkap, slug, email, phone_number, phone_international,
    password_hash, status, kota_domisili, nama_bank, nomor_rekening,
    nama_pemilik_rekening, approved_at, total_clicks, total_leads, total_orders, total_earnings
) VALUES
(
    'ITDI-MTR-2026-5652',
    'Prima aldino',
    'prima-aldino',
    '1primaaldino@gmail.com',
    '085811735280',
    '6285811735280',
    '$2a$12$eXampleHashedPasswordPrima1234567890',
    'APPROVED',
    'Bekasi',
    'BCA',
    '7309876210',
    'Prima aldino',
    '2026-10-27 07:00:00+07',
    142,
    18,
    7,
    2100000.00
),
(
    'ITDI-MTR-2026-6075',
    'Padilah ramadhan',
    'padilah-ramadhan',
    'padilahramadhan002@gmail.com',
    '087874805975',
    '6287874805975',
    '$2a$12$eXampleHashedPasswordPadilah12345678',
    'APPROVED',
    'Bekasi',
    'BCA',
    '8410293812',
    'Padilah ramadhan',
    '2026-10-27 07:05:00+07',
    98,
    12,
    4,
    1200000.00
),
(
    'ITDI-MTR-2026-0018',
    'Budi Santoso, S.Kom',
    'budi-santoso',
    'budi.santoso@gmail.com',
    '081234567890',
    '6281234567890',
    '$2a$12$eXampleHashedPasswordBudi12345678900',
    'APPROVED',
    'Kota Bekasi',
    'BCA',
    '8410293812',
    'Budi Santoso',
    '2026-10-12 11:00:00+07',
    215,
    29,
    11,
    3300000.00
)
ON CONFLICT (id) DO NOTHING;
