-- Performance Indexes for Haunt Junkies Database
-- Execute this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- These indexes will significantly improve query performance for common operations
-- All indexes use IF NOT EXISTS to be safely re-runnable

-- ============================================================================
-- REVIEWS TABLE INDEXES
-- ============================================================================

-- Index on slug for fast review lookups by URL
-- Used on: /reviews/[slug] page
CREATE INDEX IF NOT EXISTS idx_reviews_slug
ON reviews(slug);

-- Partial index on featured reviews for homepage queries
-- Used on: Homepage featured reviews section
-- Partial index is more efficient as it only indexes featured=true rows
CREATE INDEX IF NOT EXISTS idx_reviews_featured
ON reviews(featured)
WHERE featured = true;

-- Index on created_at for sorting recent reviews
-- Used on: Admin dashboard, reviews list
CREATE INDEX IF NOT EXISTS idx_reviews_created_at
ON reviews(created_at DESC);

-- Composite index for published, featured reviews ordered by rating
-- Used on: Homepage to show best featured haunts
CREATE INDEX IF NOT EXISTS idx_reviews_featured_rating
ON reviews(featured, rating_overall DESC)
WHERE featured = true;

-- ============================================================================
-- REVIEW COMMENTS TABLE INDEXES
-- ============================================================================

-- Partial index on approved comments for public display
-- Used on: Review detail pages showing approved comments
CREATE INDEX IF NOT EXISTS idx_comments_approved
ON review_comments(approved, created_at DESC)
WHERE approved = true;

-- Index on review_id for loading comments per review
-- Used on: /reviews/[slug] page
CREATE INDEX IF NOT EXISTS idx_comments_review_id
ON review_comments(review_id, created_at DESC);

-- Partial index for pending comment moderation
-- Used on: Admin comments page
CREATE INDEX IF NOT EXISTS idx_comments_pending
ON review_comments(created_at DESC)
WHERE approved = false;

-- ============================================================================
-- TICKET DATES TABLE INDEXES
-- ============================================================================

-- Partial index on available dates for ticket purchase page
-- Used on: /tickets page date selection
CREATE INDEX IF NOT EXISTS idx_ticket_dates_available
ON ticket_dates(date ASC)
WHERE is_available = true;

-- Index on date for admin ticket management
-- Used on: Admin ticket settings page
CREATE INDEX IF NOT EXISTS idx_ticket_dates_date
ON ticket_dates(date ASC);

-- ============================================================================
-- TICKET REQUESTS TABLE INDEXES
-- ============================================================================

-- Index on date for grouping ticket requests
-- Used on: Admin tickets page
CREATE INDEX IF NOT EXISTS idx_ticket_requests_date
ON ticket_requests(date, created_at DESC);

-- Index on email for customer lookup
-- Used on: Admin searching for specific customer
CREATE INDEX IF NOT EXISTS idx_ticket_requests_email
ON ticket_requests(email);

-- Partial index on confirmed tickets for capacity calculations
-- Used on: Ticket purchase capacity checks
CREATE INDEX IF NOT EXISTS idx_ticket_requests_confirmed
ON ticket_requests(date, tickets)
WHERE status = 'confirmed';

-- Index on created_at for recent tickets
-- Used on: Admin dashboard
CREATE INDEX IF NOT EXISTS idx_ticket_requests_created_at
ON ticket_requests(created_at DESC);

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE INDEXES
-- ============================================================================

-- Partial index on unread messages
-- Used on: Admin dashboard and contact page
CREATE INDEX IF NOT EXISTS idx_contact_unread
ON contact_submissions(created_at DESC)
WHERE read = false;

-- Index on created_at for all messages
-- Used on: Admin contact page
CREATE INDEX IF NOT EXISTS idx_contact_created_at
ON contact_submissions(created_at DESC);

-- ============================================================================
-- REVIEW IMAGES TABLE INDEXES
-- ============================================================================

-- Index on review_id and display_order for gallery loading
-- Used on: Review detail pages
CREATE INDEX IF NOT EXISTS idx_review_images_review_display
ON review_images(review_id, display_order ASC);

-- ============================================================================
-- MCCLOUD PHOTOS TABLE INDEXES
-- ============================================================================

-- Index on display_order for manor photo gallery
-- Used on: /haunt page
CREATE INDEX IF NOT EXISTS idx_mccloud_photos_display
ON mccloud_photos(display_order ASC);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Performance indexes created successfully!';
  RAISE NOTICE 'Query performance should be significantly improved.';
  RAISE NOTICE 'You can verify indexes by running: SELECT * FROM pg_indexes WHERE schemaname = ''public'';';
END $$;
