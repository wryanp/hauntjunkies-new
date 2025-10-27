# Storage Buckets Setup Guide

This guide will help you create the necessary Supabase Storage buckets for image uploads.

## Quick Setup

### Option 1: SQL Script (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/create-storage-buckets.sql`
5. Click **Run** to execute the script

This will create:
- `review-images` bucket (for logos, social images, and gallery photos)
- `mccloud-photos` bucket (for McCloud Manor gallery)
- All necessary storage policies

### Option 2: Manual Setup via Dashboard

#### Create Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Create first bucket:
   - **Name:** `review-images`
   - **Public bucket:** ✅ Yes
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp, image/gif`
4. Create second bucket:
   - **Name:** `mccloud-photos`
   - **Public bucket:** ✅ Yes
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp, image/gif`

#### Set Storage Policies

After creating the buckets, you'll need to set up RLS policies. Go to **SQL Editor** and run the policy creation statements from `migrations/create-storage-buckets.sql`.

## Bucket Structure

### review-images
```
review-images/
├── logos/           # Review logos (logos/{review-id}.ext)
├── social/          # Social share images (social/{review-id}.ext)
└── [root]           # Gallery images
```

### mccloud-photos
```
mccloud-photos/
└── [root]           # McCloud Manor gallery images
```

## Verifying Setup

After running the setup, test the buckets:

1. Go to **Storage** in Supabase dashboard
2. You should see both `review-images` and `mccloud-photos` buckets
3. Both should show as "Public" with a green indicator
4. Try uploading a logo from the admin panel at `/admin/reviews`

## Troubleshooting

### "Bucket not found" error
- Make sure the SQL script ran successfully without errors
- Check that the bucket names are exactly `review-images` and `mccloud-photos` (no typos)
- Verify buckets appear in the Storage section of your dashboard

### "Row-level security policy" error
- Ensure you're logged in as an authenticated user in the admin panel
- Verify the storage policies were created (check SQL Editor for any errors)
- Make sure your admin user has the correct authentication role

### Images not appearing
- Verify buckets are set to **Public**
- Check that the image URLs in the database start with your Supabase project URL
- Ensure file paths follow the correct subfolder structure (e.g., `logos/`, `social/`)

## Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your service role key is set correctly in `.env`
3. Ensure you're using the correct Supabase project URL
