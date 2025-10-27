-- Add DELETE policy for ticket_requests table
-- This allows authenticated users (admins) to delete ticket requests

-- First, check if a delete policy already exists
DO $$
BEGIN
    -- Drop any existing delete policies to avoid conflicts
    DROP POLICY IF EXISTS "Authenticated users can delete ticket requests" ON ticket_requests;
    DROP POLICY IF EXISTS "Public can delete ticket requests" ON ticket_requests;
    DROP POLICY IF EXISTS "Allow authenticated delete" ON ticket_requests;
END $$;

-- Create the delete policy for authenticated users
CREATE POLICY "Authenticated users can delete ticket requests"
ON ticket_requests
FOR DELETE
TO public
USING (auth.role() = 'authenticated');

-- Verify the policy was created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'ticket_requests'
ORDER BY cmd;
