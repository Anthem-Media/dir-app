-- ============================================================
-- DIR (Diamond in the Rough) — DATABASE SCHEMA
-- Database: PostgreSQL
-- Updated: April 20, 2026
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

INSERT INTO sports (name, slug) VALUES
    ('Baseball', 'baseball'),
    ('Football', 'football'),
    ('Basketball', 'basketball'),
    ('Hockey', 'hockey'),
    ('Soccer', 'soccer'),
    ('UFC', 'ufc'),
    ('F1', 'f1');


-- ============================================================
-- TABLE 2: MANUFACTURERS
-- Card manufacturers / brands
-- ============================================================
CREATE TABLE manufacturers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO manufacturers (name, slug) VALUES
    ('Topps', 'topps'),
    ('Panini', 'panini'),
    ('Upper Deck', 'upper-deck'),
    ('Bowman', 'bowman');


-- ============================================================
-- TABLE 3: BOX_SETS
-- Core table — one row per unique box set product
-- Example: "2024 Topps Chrome Baseball Hobby Box" is one row
--
-- PENDING AMENDMENT (database phase):
-- Add parent_set_id INT REFERENCES box_sets(id) NULL
-- This groups all formats of the same set together (Hobby, Jumbo,
-- Blaster, Mega, Retail). Used by the format switcher on the box
-- profile page. A NULL parent_set_id means no related formats exist.
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

    -- Links related formats of the same set together (Hobby, Jumbo, Blaster etc.)
    -- Add during database phase: parent_set_id INT REFERENCES box_sets(id) NULL
    -- NULL = no related formats. All formats of the same set share the same parent_set_id.

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

    -- Metadata
    release_date            DATE,
    is_active               BOOLEAN DEFAULT TRUE,
    image_url               VARCHAR(500),
    notes                   TEXT,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_box_sets_sport ON box_sets(sport_id);
CREATE INDEX idx_box_sets_year ON box_sets(year);
CREATE INDEX idx_box_sets_manufacturer ON box_sets(manufacturer_id);
CREATE INDEX idx_box_sets_format ON box_sets(box_format);


-- ============================================================
-- TABLE 4: CARD_CATEGORIES
-- Defines the tiers/types of cards within a set
-- Tier 1=Base, 2=Insert/SP, 3=Parallel, 4=Auto, 5=Premium Hit
-- ============================================================
CREATE TABLE card_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    tier        SMALLINT NOT NULL,
    description TEXT
);

INSERT INTO card_categories (name, tier, description) VALUES
    ('Base', 1, 'Standard base cards'),
    ('Base Rookie', 1, 'Base set rookie cards'),
    ('Short Print', 2, 'Base card short print variations'),
    ('Insert', 2, 'Insert cards, non-parallel'),
    ('Refractor', 3, 'Chrome refractor parallels'),
    ('Rookie Refractor', 3, 'Chrome refractor parallels of rookie cards'),
    ('Numbered Refractor', 3, 'Refractor parallels with serial numbering'),
    ('Numbered Rookie Refractor', 3, 'Numbered refractor parallels of rookie cards'),
    ('Base Auto', 4, 'Standard autograph cards'),
    ('Refractor Auto', 4, 'Autographed refractor parallels'),
    ('Numbered Autograph', 4, 'Autograph cards with serial numbering'),
    ('Patch Auto', 5, 'Signed patch/memorabilia cards'),
    ('Numbered Patch Auto', 5, 'Signed patch cards with serial numbering'),
    ('Memorabilia / Relic', 5, 'Game-used memorabilia cards'),
    ('Superfractor', 5, 'One of one superfractor cards');


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
    circulation_status  VARCHAR(20) DEFAULT 'unknown',

    -- Current market value (updated periodically)
    current_value       NUMERIC(10,2),
    value_last_updated  TIMESTAMP,

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
-- App users (for accounts, saved boxes, alerts)
-- Minimum age: 13 (COPPA compliance)
-- ============================================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    display_name    VARCHAR(100),
    password_hash   VARCHAR(255) NOT NULL,
    plan            VARCHAR(20) DEFAULT 'free',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLE 10: SAVED_BOXES
-- User watchlist / saved box sets
-- ============================================================
CREATE TABLE saved_boxes (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id     INT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    notes       TEXT,
    added_at    TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, card_id)
);

CREATE INDEX idx_user_wishlist_user ON user_wishlist(user_id);
CREATE INDEX idx_user_wishlist_card ON user_wishlist(card_id);


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
-- EXAMPLE DATA — 2024 Topps Chrome Baseball Hobby
-- ============================================================

INSERT INTO box_sets (
    name, slug, year, sport_id, manufacturer_id, box_format,
    packs_per_box, cards_per_pack, total_cards_per_box,
    msrp, release_date
) VALUES (
    '2024 Topps Chrome Baseball',
    '2024-topps-chrome-baseball-hobby',
    2024,
    (SELECT id FROM sports WHERE slug = 'baseball'),
    (SELECT id FROM manufacturers WHERE slug = 'topps'),
    'Hobby',
    12, 4, 48,
    129.99,
    '2024-09-18'
);

INSERT INTO pull_rates (box_set_id, category_id, odds_numerator, odds_denominator, pull_probability, odds_source)
VALUES
    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Refractor'),
     1, 4, 0.250000, 'Manufacturer'),

    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Base Auto'),
     1, 12, 0.083333, 'Manufacturer'),

    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Patch Auto'),
     1, 96, 0.010417, 'Manufacturer');

INSERT INTO cards (box_set_id, category_id, card_number, player_name, team, rookie_card, current_value)
VALUES
    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Base'),
     '#1', 'Juan Soto', 'New York Yankees', FALSE, 4.99),

    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Base Auto'),
     '#RA-JS', 'Jackson Chourio', 'Milwaukee Brewers', TRUE, 89.99),

    ((SELECT id FROM box_sets WHERE slug = '2024-topps-chrome-baseball-hobby'),
     (SELECT id FROM card_categories WHERE name = 'Refractor'),
     '#1-REF', 'Juan Soto', 'New York Yankees', FALSE, 12.50);
