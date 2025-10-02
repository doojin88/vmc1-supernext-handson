-- ============================================================
-- Migration: 0009_update_foodtruck_campaign_deadline
-- Description: Update 박푸드트럭 스트리트푸드 체험단 모집마감일을 2025-10-16으로 변경
-- ============================================================

BEGIN;

-- Update 박푸드트럭 스트리트푸드 체험단의 모집마감일을 2025-10-16으로 변경
UPDATE campaigns
SET
    recruitment_start_date = '2025-10-10',  -- 모집 시작일도 적절히 조정
    recruitment_end_date = '2025-10-16',
    status = 'recruiting'
WHERE id = '88888888-8888-8888-8888-888888888888'
  AND title = '박푸드트럭 스트리트푸드 체험단';

COMMIT;
