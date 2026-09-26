-- =============================================================================
-- JANCO Initial Schema
-- Run this once on a fresh database BEFORE any other migrations.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles  (all users: customers + janitors + admins)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT,                           -- nullable until 001 migration
    full_name       TEXT,
    phone           TEXT,
    avatar_url      TEXT,
    role            TEXT NOT NULL DEFAULT 'customer'
                        CHECK (role IN ('customer', 'janitor', 'admin')),
    address         TEXT,
    landmark        TEXT,
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    push_token      TEXT,
    is_registered   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    deletion_requested_at TIMESTAMPTZ,
    deletion_reason TEXT,
    anonymized_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role  ON profiles(role);

-- ---------------------------------------------------------------------------
-- janitors  (extra profile data for users with role = 'janitor')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS janitors (
    id              UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    phone           TEXT,
    address         TEXT,
    service_types   TEXT[]      NOT NULL DEFAULT '{}',
    experience      TEXT,
    bio             TEXT,
    availability    BOOLEAN     NOT NULL DEFAULT FALSE,
    is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    trust_score     DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    trust_tier      TEXT        NOT NULL DEFAULT 'Pending',
    avg_rating      DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    punctuality_rate DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    approval_status TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_janitors_availability ON janitors(availability);
CREATE INDEX IF NOT EXISTS idx_janitors_is_verified  ON janitors(is_verified);

-- ---------------------------------------------------------------------------
-- jobs  (service requests / bookings)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id),
    janitor_id      UUID REFERENCES janitors(id),
    service_type    TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
    payment_status  TEXT NOT NULL DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid','pending','paid','refunded')),
    scheduled_date  TEXT,
    scheduled_time  TEXT,
    address         TEXT,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    rooms           INTEGER NOT NULL DEFAULT 1,
    toilets         INTEGER NOT NULL DEFAULT 0,
    extras          JSONB,
    notes           TEXT,
    price           INTEGER,                        -- in kobo / smallest currency unit
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_user_id    ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_janitor_id ON jobs(janitor_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status     ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- ---------------------------------------------------------------------------
-- messages  (in-app chat per job)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES profiles(id),
    content     TEXT NOT NULL,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_job_id     ON messages(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(job_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- ratings  (customer reviews of completed jobs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID NOT NULL REFERENCES jobs(id),
    janitor_id  UUID NOT NULL REFERENCES janitors(id),
    user_id     UUID NOT NULL REFERENCES profiles(id),
    score       INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment     TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, user_id)                        -- one rating per job per customer
);

CREATE INDEX IF NOT EXISTS idx_ratings_janitor_id ON ratings(janitor_id);

-- ---------------------------------------------------------------------------
-- verifications  (janitor identity verification state via Dojah)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verifications (
    janitor_id  UUID PRIMARY KEY REFERENCES janitors(id) ON DELETE CASCADE,
    id_type     TEXT,                               -- 'nin' or 'bvn'
    dojah_ref   TEXT,
    status      TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started','id_verified','id_failed','liveness_failed','verified')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    verified_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- refresh_tokens  (created by migration 002 — included here for fresh installs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    family_id   UUID NOT NULL,
    issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    user_agent  TEXT,
    ip_address  INET
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id   ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id ON refresh_tokens(family_id);
