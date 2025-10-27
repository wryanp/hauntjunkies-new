-- Check RLS policies on ticket_requests table
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
WHERE tablename = 'ticket_requests';

-- If no DELETE policy exists or it's too restrictive, this might be the issue
-- The service role key should bypass RLS, but let's verify the policies are correct
