-- ============================================================
-- DIR (Diamond in the Rough) — DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- Updated: May 2026 — Stage 1 schema amendments batch
-- Previous version preserved as: dir_database_schema_OLD.sql
--
-- This file applies all 11 amendments from PRE-BETA-CHECKLIST.md
-- section 4 plus the four Stage 0a schema decisions (locked May
-- 2026). Apply once against an empty public schema via Supabase
-- SQL Editor.
-- ============================================================


-- ============================================================
-- TABLE 1: SPORTS
-- Reference table for sport types
-- ============================================================
CREATE TABLE sports (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    slug        VARCHAR(50) NOT NULL UNIQUE
);


-- ============================================================
-- TABLE 2: MANUFACTURERS
-- Card manufacturers / brands
-- ============================================================
CREATE TABLE manufacturers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================================
-- TABLE 3: BOX_SETS
-- Core table — one row per unique box set product
-- Example: "2024 Topps Chrome Baseball Hobby Box" is one row
--
-- parent_set_id groups all formats of the same set together
-- (Hobby, Jumbo, Blaster, Mega, Breaker). NULL = no related
-- formats. Powers the format switcher on the box profile page.
-- Parent identity rule: Hobby > Jumbo > Mega > Breaker > Blaster
-- (first format in the chain that exists for a set is parent).
--
-- is_featured powers homepage featured-box curation. Manually
-- managed in the Supabase table editor during beta.
--
-- ev_cards_priced / ev_cards_total power the EV coverage display
-- ("Based on X of Y cards priced") on the box profile page.
-- Both written when EV is calculated. Grails (print_run <= 10)
-- are excluded from both counts.
-- ============================================================
CREATE TABLE box_sets (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) NOT NULL UNIQUE,
    year                    SMALLINT NOT NULL,
    sport_id                INT NOT NULL REFERENCES sports(id),
    manufacturer_id         INT NOT NULL REFERENCES manufacturers(id),
    box_format              VARCHAR(50) NOT NULL,
    series                  VARCHAR(100),

    -- Self-referencing FK linking sibling formats of the same set
    parent_set_id           INT REFERENCES box_sets(id),

    -- Box configuration
    packs_per_box           SMALLINT,
    cards_per_pack          SMALLINT,
    total_cards_per_box     SMALLINT,

    -- Pricing
    msrp                    NUMERIC(10,2),
    current_market_price    NUMERIC(10,2),
    price_last_updated      TIMESTAMP,

    -- Expected value (calculated and cached)
    expected_value          NUMERIC(10,2),
    ev_last_calculated      TIMESTAMP,
    roi_percentage          NUMERIC(6,2),

    -- EV coverage counts (written when EV is calculated)
    -- Grails (print_run <= 10) excluded from both counts
    ev_cards_priced         SMALLINT,
    ev_cards_total          SMALLINT,

    -- Metadata
    release_date            DATE,
    is_active               BOOLEAN DEFAULT TRUE,
    is_featured             BOOLEAN DEFAULT FALSE,
    image_url               VARCHAR(500),
    notes                   TEXT,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_box_sets_sport ON box_sets(sport_id);
CREATE INDEX idx_box_sets_year ON box_sets(year);
CREATE INDEX idx_box_sets_manufacturer ON box_sets(manufacturer_id);
CREATE INDEX idx_box_sets_format ON box_sets(box_format);
CREATE INDEX idx_box_sets_parent ON box_sets(parent_set_id);


-- ============================================================
-- TABLE 4: CARD_CATEGORIES
-- Defines the tiers/types of cards within a set
-- Tier 1=Premium Hits, 2=Autographs, 3=Parallels,
-- 4=Inserts/SP, 5=Base/Rookies
-- ============================================================
CREATE TABLE card_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    tier        SMALLINT NOT NULL,
    description TEXT
);


-- ============================================================
-- TABLE 5: CARDS
-- Every individual card in every set
-- One row = one card (e.g. "2024 Topps Chrome Mike Trout Base #1")
-- ============================================================
CREATE TABLE cards (
    id                  SERIAL PRIMARY KEY,
    box_set_id          INT NOT NULL REFERENCES box_sets(id) ON DELETE CASCADE,
    category_id         INT NOT NULL REFERENCES card_categories(id),

    -- Card identity
    card_number         VARCHAR(20),
    player_name         VARCHAR(255) NOT NULL,
    team                VARCHAR(100),
    position            VARCHAR(50),
    rookie_card         BOOLEAN DEFAULT FALSE,

    -- Variation details
    variation_name      VARCHAR(255),
    print_run           INT,
    is_numbered         BOOLEAN DEFAULT FALSE,
    is_autograph        BOOLEAN DEFAULT FALSE,
    is_relic            BOOLEAN DEFAULT FALSE,
    is_case_hit         BOOLEAN DEFAULT FALSE,

    -- Grails tab: tracks whether low-print cards (print_run <= 10) have been pulled/sold.
    -- 'unknown'        = status not yet verified (default for all low-print cards at entry)
    -- 'in_circulation' = confirmed still available in sealed product
    -- 'pulled_sold'    = confirmed pulled and sold; no longer in circulation
    -- Only meaningful for cards where print_run <= 10. Ignored for all other cards.
    circulation_status  VARCHAR(20) DEFAULT 'unknown'
        CHECK (circulation_status IN ('unknown', 'in_circulation', 'pulled_sold')),

    -- Current market value (updated periodically)
    current_value       NUMERIC(10,2),
    value_last_updated  TIMESTAMP,

    -- Tracks which pricing pipeline wrote each current_value.
    -- See PRE-BETA-CHECKLIST.md 4.11 and SCHEMA-AND-DATA.md DECIDED.
    -- eBay-first framing: full eBay pipeline (Browse + Marketplace
    -- Insights) is the happy path. Other values exist for Plan B
    -- fallback resilience. Every pipeline that writes current_value
    -- MUST also write value_source and update value_last_updated.
    -- NULL = unpriced.
    value_source        VARCHAR(40)
        CHECK (value_source IN (
            'ebay_browse_mitigation',
            'ebay_marketplace_insights',
            'card_hedge',
            'price_charting',
            'manual',
            'placeholder'
        )),

    -- Metadata
    image_url           VARCHAR(500),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cards_box_set ON cards(box_set_id);
CREATE INDEX idx_cards_player ON cards(player_name);
CREATE INDEX idx_cards_category ON cards(category_id);
CREATE INDEX idx_cards_rookie ON cards(rookie_card);
CREATE INDEX idx_cards_value ON cards(current_value DESC);
CREATE INDEX idx_cards_case_hit ON cards(is_case_hit);
CREATE INDEX idx_cards_print_run ON cards(print_run);
CREATE INDEX idx_cards_value_source ON cards(value_source);


-- ============================================================
-- TABLE 6: PULL_RATES
-- Pack odds for each card category within a box set
-- Published by manufacturers — one row per category per box set
-- ============================================================
CREATE TABLE pull_rates (
    id                  SERIAL PRIMARY KEY,
    box_set_id          INT NOT NULL REFERENCES box_sets(id) ON DELETE CASCADE,
    category_id         INT NOT NULL REFERENCES card_categories(id),

    -- Odds (stored as "1 in X packs")
    odds_numerator      INT NOT NULL DEFAULT 1,
    odds_denominator    INT NOT NULL,

    -- Calculated probability
    pull_probability    NUMERIC(8,6),

    -- Source: 'Manufacturer' or 'Unavailable'
    odds_source         VARCHAR(100),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(box_set_id, category_id)
);

CREATE INDEX idx_pull_rates_box_set ON pull_rates(box_set_id);


-- ============================================================
-- TABLE 7: PRICE_HISTORY
-- Running log of card prices over time
-- Powers all trend charts and ROI calculations
-- Also powers the tier price trend chart on the box profile page
-- (average sale price per tier over time)
-- ============================================================
CREATE TABLE price_history (
    id              BIGSERIAL PRIMARY KEY,
    card_id         INT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    box_set_id      INT NOT NULL REFERENCES box_sets(id),

    -- Price data
    sale_price      NUMERIC(10,2) NOT NULL,
    sale_date       DATE NOT NULL,
    condition       VARCHAR(20) DEFAULT 'raw',

    -- Source
    source          VARCHAR(50) NOT NULL,
    source_listing_id VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_history_card ON price_history(card_id);
CREATE INDEX idx_price_history_date ON price_history(sale_date DESC);
CREATE INDEX idx_price_history_box_set ON price_history(box_set_id);
CREATE INDEX idx_price_history_source ON price_history(source);


-- ============================================================
-- TABLE 8: BOX_PRICE_HISTORY
-- Tracks sealed box market prices over time
-- Powers the sealed box price trend chart in the hero section
-- ============================================================
CREATE TABLE box_price_history (
    id          BIGSERIAL PRIMARY KEY,
    box_set_id  INT NOT NULL REFERENCES box_sets(id) ON DELETE CASCADE,
    price       NUMERIC(10,2) NOT NULL,
    recorded_at DATE NOT NULL,
    source      VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_box_price_history_box_set ON box_price_history(box_set_id);
CREATE INDEX idx_box_price_history_date ON box_price_history(recorded_at DESC);


-- ============================================================
-- TABLE 9: USERS
-- App profile table — links 1:1 to Supabase's auth.users.
-- Minimum age: 13 (COPPA compliance, enforced at signup UI).
--
-- Supabase Auth manages passwords in its own auth.users table.
-- This table stores no passwords. The primary key is the same
-- UUID as auth.users(id), giving us a direct join and clean RLS
-- policies (e.g. WHERE user_id = auth.uid()).
--
-- Rows are auto-created by the on_auth_user_created trigger
-- (see below) when a new auth.users row is inserted. ON DELETE
-- CASCADE means deleting an auth user wipes their profile and
-- all child rows (saved_boxes, alerts, collection, wishlist).
--
-- plan column drives paywall logic:
--   'free' = post-beta default, blocked from box profiles
--   'beta' = beta signup, full access during beta period
--   'paid' = post-beta Stripe subscriber, full access
-- Paywall check is plan IN ('beta', 'paid').
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    display_name    VARCHAR(100),
    email_opt_in    BOOLEAN DEFAULT FALSE,
    plan            VARCHAR(20) DEFAULT 'free'
        CHECK (plan IN ('free', 'beta', 'paid')),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- AUTH TRIGGER — auto-create profile row on auth signup
--
-- When Supabase Auth inserts a new row into auth.users (e.g. on
-- signup), this trigger fires and inserts a matching profile row
-- into public.users. display_name and email_opt_in are pulled
-- from raw_user_meta_data, which the SignUp page populates with
-- the form values. SECURITY DEFINER lets the function write to
-- public.users even though the inserting role (Supabase auth) has
-- no direct privileges on the public schema.
--
-- Standard Supabase boilerplate. Keep in sync with the users
-- table — every column with a non-defaulted NOT NULL must be
-- populated here, or signup will start failing silently.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name, email_opt_in)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'display_name',
        COALESCE((NEW.raw_user_meta_data->>'email_opt_in')::boolean, FALSE)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- TABLE 10: SAVED_BOXES
-- User watchlist / saved box sets
-- ============================================================
CREATE TABLE saved_boxes (
    id          SERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    box_set_id  INT NOT NULL REFERENCES box_sets(id) ON DELETE CASCADE,
    saved_at    TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, box_set_id)
);

CREATE INDEX idx_saved_boxes_user ON saved_boxes(user_id);


-- ============================================================
-- TABLE 11: PRICE_ALERTS
-- User configured alerts for price movements
-- ============================================================
CREATE TABLE price_alerts (
    id              SERIAL PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    box_set_id      INT REFERENCES box_sets(id) ON DELETE CASCADE,
    card_id         INT REFERENCES cards(id) ON DELETE CASCADE,

    alert_type      VARCHAR(20) NOT NULL,
    threshold_price NUMERIC(10,2) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    triggered_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),

    CONSTRAINT chk_alert_target CHECK (
        (box_set_id IS NOT NULL AND card_id IS NULL) OR
        (card_id IS NOT NULL AND box_set_id IS NULL)
    )
);

CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);


-- ============================================================
-- TABLE 12: USER_COLLECTION
-- Cards a user owns (post-launch feature)
-- ============================================================
CREATE TABLE user_collection (
    id          SERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id     INT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    quantity    SMALLINT NOT NULL DEFAULT 1,
    condition   VARCHAR(20) DEFAULT 'raw',
    notes       TEXT,
    added_at    TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, card_id, condition)
);

CREATE INDEX idx_user_collection_user ON user_collection(user_id);
CREATE INDEX idx_user_collection_card ON user_collection(card_id);


-- ============================================================
-- TABLE 13: USER_WISHLIST
-- Cards a user wants (post-launch feature)
-- ============================================================
CREATE TABLE user_wishlist (
    id          SERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id     INT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    notes       TEXT,
    added_at    TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, card_id)
);

CREATE INDEX idx_user_wishlist_user ON user_wishlist(user_id);
CREATE INDEX idx_user_wishlist_card ON user_wishlist(card_id);


-- ============================================================
-- TABLE 14: DISTRIBUTORS
-- Affiliate distributors carried in the Buy Now system
-- (Dave & Adam's, Blowout Cards, Steel City, etc.).
-- Boxes without distributor listings fall back to "Find on eBay"
-- via the eBay Partner Network affiliate link.
-- ============================================================
CREATE TABLE distributors (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(100) NOT NULL UNIQUE,
    slug                    VARCHAR(100) NOT NULL UNIQUE,
    website_url             VARCHAR(500),
    logo_url                VARCHAR(500),
    affiliate_url_pattern   VARCHAR(500),
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLE 15: DISTRIBUTOR_LISTINGS
-- Joins distributors to box_sets with prices and affiliate URLs.
-- One distributor can list a given box at most once (UNIQUE).
-- ============================================================
CREATE TABLE distributor_listings (
    id              SERIAL PRIMARY KEY,
    distributor_id  INT NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
    box_set_id      INT NOT NULL REFERENCES box_sets(id) ON DELETE CASCADE,
    price           NUMERIC(10,2),
    affiliate_url   VARCHAR(1000),
    in_stock        BOOLEAN DEFAULT TRUE,
    last_checked    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),

    UNIQUE(distributor_id, box_set_id)
);

CREATE INDEX idx_distributor_listings_distributor ON distributor_listings(distributor_id);
CREATE INDEX idx_distributor_listings_box_set ON distributor_listings(box_set_id);


-- ============================================================
-- VIEWS
-- ============================================================

-- Box sets with their current EV and ROI in one clean query
CREATE VIEW v_box_set_summary AS
SELECT
    bs.id,
    bs.name,
    bs.year,
    bs.box_format,
    s.name AS sport,
    m.name AS manufacturer,
    bs.current_market_price,
    bs.expected_value,
    bs.roi_percentage,
    bs.release_date,
    bs.is_active,
    COUNT(DISTINCT c.id) AS total_cards_in_checklist
FROM box_sets bs
JOIN sports s ON bs.sport_id = s.id
JOIN manufacturers m ON bs.manufacturer_id = m.id
LEFT JOIN cards c ON c.box_set_id = bs.id
GROUP BY bs.id, s.name, m.name;

-- Top cards by value within a set (Top Chases tab)
-- Excludes Grails (print_run <= 10) — those are shown separately on the Grails tab
CREATE VIEW v_top_cards_by_set AS
SELECT
    c.box_set_id,
    bs.name AS set_name,
    c.player_name,
    c.variation_name,
    cc.name AS category,
    cc.tier,
    c.current_value,
    c.is_autograph,
    c.is_relic,
    c.is_case_hit,
    c.rookie_card,
    c.print_run,
    c.circulation_status,
    RANK() OVER (PARTITION BY c.box_set_id ORDER BY c.current_value DESC) AS value_rank
FROM cards c
JOIN box_sets bs ON c.box_set_id = bs.id
JOIN card_categories cc ON c.category_id = cc.id
WHERE c.print_run IS NULL OR c.print_run > 10;  -- Top Chases only; Grails handled separately


-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO sports (name, slug) VALUES
    ('Baseball', 'baseball'),
    ('Football', 'football'),
    ('Basketball', 'basketball'),
    ('Hockey', 'hockey'),
    ('Soccer', 'soccer'),
    ('UFC', 'ufc'),
    ('F1', 'f1');

INSERT INTO manufacturers (name, slug) VALUES
    ('Topps', 'topps'),
    ('Panini', 'panini'),
    ('Upper Deck', 'upper-deck'),
    ('Bowman', 'bowman');

-- Tier 1 = Premium Hits, Tier 2 = Autographs, Tier 3 = Parallels,
-- Tier 4 = Inserts/SP, Tier 5 = Base/Rookies (flipped from previous
-- numbering — see PRE-BETA-CHECKLIST.md 4.7).
INSERT INTO card_categories (name, tier, description) VALUES
    ('Patch Auto', 1, 'Signed patch/memorabilia cards'),
    ('Numbered Patch Auto', 1, 'Signed patch cards with serial numbering'),
    ('Memorabilia / Relic', 1, 'Game-used memorabilia cards'),
    ('Superfractor', 1, 'One of one superfractor cards'),
    ('Base Auto', 2, 'Standard autograph cards'),
    ('Refractor Auto', 2, 'Autographed refractor parallels'),
    ('Numbered Autograph', 2, 'Autograph cards with serial numbering'),
    ('Refractor', 3, 'Chrome refractor parallels'),
    ('Rookie Refractor', 3, 'Chrome refractor parallels of rookie cards'),
    ('Numbered Refractor', 3, 'Refractor parallels with serial numbering'),
    ('Numbered Rookie Refractor', 3, 'Numbered refractor parallels of rookie cards'),
    ('Short Print', 4, 'Base card short print variations'),
    ('Insert', 4, 'Insert cards, non-parallel'),
    ('Base', 5, 'Standard base cards'),
    ('Base Rookie', 5, 'Base set rookie cards');
