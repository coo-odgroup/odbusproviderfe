export interface CampaignNotification {
  id?: number;

  notification_category_id?: number;

  campaign_name?: string;
  title?: string;
  message?: string;
  image?: string;

  type?: 'PROMOTIONAL' | 'TRANSACTIONAL' | 'REMINDER' | 'CUSTOM';

  target_type?:
    | 'ALL'
    | 'ACTIVE'
    | 'INACTIVE'
    | 'VERIFIED'
    | 'CUSTOM';

  schedule_type?:
    | 'IMMEDIATE'
    | 'SCHEDULED'
    | 'BEFORE_EVENT'
    | 'AFTER_EVENT';

  schedule_minutes?: number;

  active_status?: number;

  total_users?: number;
  processed_users?: number;
  success_users?: number;
  failed_users?: number;

  schedule_at?: string;

  is_completed?: number;

  started_at?: string;
  completed_at?: string;

  created_by?: string;
  updated_by?: string;

  created_at?: string;
  updated_at?: string;

  deleted_at?: string;
}