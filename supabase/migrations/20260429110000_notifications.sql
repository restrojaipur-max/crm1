-- Notifications Module Migration
-- Supports owner (workforce events) and employee (personal + broadcast) notifications

-- 1. Notification type enum
DROP TYPE IF EXISTS public.notification_type CASCADE;
CREATE TYPE public.notification_type AS ENUM (
  'employee_added',
  'employee_removed',
  'employee_status_changed',
  'employee_edited',
  'attendance_approved',
  'attendance_rejected',
  'production_approved',
  'production_rejected',
  'dispatch_approved',
  'dispatch_rejected',
  'shift_reminder',
  'announcement',
  'system'
);

-- 2. Notification category enum
DROP TYPE IF EXISTS public.notification_category CASCADE;
CREATE TYPE public.notification_category AS ENUM (
  'workforce',
  'attendance',
  'production',
  'dispatch',
  'announcement',
  'system'
);

-- 3. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recipient_role TEXT, -- 'owner' | 'employee' | null (broadcast)
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'system'::public.notification_type,
  category public.notification_category NOT NULL DEFAULT 'system'::public.notification_category,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_broadcast BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMPTZ
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON public.notifications(recipient_role);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);

-- 5. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "users_view_own_notifications" ON public.notifications;
CREATE POLICY "users_view_own_notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  recipient_id = auth.uid()
  OR is_broadcast = true
);

DROP POLICY IF EXISTS "users_mark_own_notifications_read" ON public.notifications;
CREATE POLICY "users_mark_own_notifications_read"
ON public.notifications
FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

DROP POLICY IF EXISTS "authenticated_insert_notifications" ON public.notifications;
CREATE POLICY "authenticated_insert_notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "users_delete_own_notifications" ON public.notifications;
CREATE POLICY "users_delete_own_notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (recipient_id = auth.uid());

-- 7. Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 8. Seed sample notifications
DO $$
DECLARE
  owner_id UUID;
  employee_id UUID;
BEGIN
  SELECT id INTO owner_id FROM public.user_profiles WHERE role = 'owner' LIMIT 1;
  SELECT id INTO employee_id FROM public.user_profiles WHERE role = 'employee' LIMIT 1;

  IF owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, recipient_role, title, body, type, category, is_read, created_at)
    VALUES
      (owner_id, 'owner', 'New Employee Added', 'Suresh Patel has been added to Weaving department.', 'employee_added'::public.notification_type, 'workforce'::public.notification_category, false, NOW() - INTERVAL '5 minutes'),
      (owner_id, 'owner', 'Employee Status Changed', 'Ramesh Kumar status changed to Inactive.', 'employee_status_changed'::public.notification_type, 'workforce'::public.notification_category, false, NOW() - INTERVAL '30 minutes'),
      (owner_id, 'owner', 'Employee Profile Edited', 'Priya Singh profile was updated — department changed to Dispatch.', 'employee_edited'::public.notification_type, 'workforce'::public.notification_category, true, NOW() - INTERVAL '2 hours'),
      (owner_id, 'owner', 'Employee Removed', 'Mohan Das has been removed from the workforce.', 'employee_removed'::public.notification_type, 'workforce'::public.notification_category, true, NOW() - INTERVAL '1 day')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF employee_id IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, recipient_role, title, body, type, category, is_read, created_at)
    VALUES
      (employee_id, 'employee', 'Attendance Approved', 'Your attendance for today has been approved by the owner.', 'attendance_approved'::public.notification_type, 'attendance'::public.notification_category, false, NOW() - INTERVAL '10 minutes'),
      (employee_id, 'employee', 'Production Entry Approved', 'Your production entry of 120 units has been approved.', 'production_approved'::public.notification_type, 'production'::public.notification_category, false, NOW() - INTERVAL '1 hour'),
      (employee_id, 'employee', 'Shift Reminder', 'Your Shift A starts at 8:00 AM tomorrow. Please be on time.', 'shift_reminder'::public.notification_type, 'announcement'::public.notification_category, true, NOW() - INTERVAL '3 hours'),
      (employee_id, 'employee', 'Dispatch Rejected', 'Your dispatch entry for Customer XYZ was rejected. Please review.', 'dispatch_rejected'::public.notification_type, 'dispatch'::public.notification_category, false, NOW() - INTERVAL '5 hours')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Broadcast announcement
  INSERT INTO public.notifications (recipient_id, recipient_role, title, body, type, category, is_broadcast, is_read, created_at)
  VALUES
    (NULL, NULL, 'Factory Holiday Notice', 'The factory will remain closed on 1st May for Labour Day. All shifts are cancelled.', 'announcement'::public.notification_type, 'announcement'::public.notification_category, true, false, NOW() - INTERVAL '6 hours')
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data failed: %', SQLERRM;
END $$;
