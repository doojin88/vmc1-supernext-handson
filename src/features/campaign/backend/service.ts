import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { ListCampaignsRequest, ListCampaignsResponse } from './schema';
import { campaignErrorCodes, type CampaignServiceError } from './error';

export const listCampaigns = async (
  client: SupabaseClient,
  params: ListCampaignsRequest,
): Promise<HandlerResult<ListCampaignsResponse, CampaignServiceError, unknown>> => {
  try {
    const { page, limit, category, status = 'active', search } = params;
    const offset = (page - 1) * limit;

    // Build query
    let query = client
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        category,
        target_audience,
        requirements,
        compensation,
        application_deadline,
        campaign_start_date,
        campaign_end_date,
        max_participants,
        current_participants,
        status,
        created_at,
        updated_at,
        advertiser_profiles!inner(
          company_name,
          business_type
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: campaigns, error, count } = await query;

    if (error) {
      return failure(
        500,
        campaignErrorCodes.databaseError,
        `캠페인 조회 실패: ${error.message}`,
      );
    }

    if (!campaigns) {
      return failure(
        404,
        campaignErrorCodes.campaignsNotFound,
        '캠페인을 찾을 수 없습니다',
      );
    }

    // Transform data
    const transformedCampaigns = campaigns.map((campaign: any) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      targetAudience: campaign.target_audience,
      requirements: campaign.requirements,
      compensation: campaign.compensation,
      applicationDeadline: campaign.application_deadline,
      campaignStartDate: campaign.campaign_start_date,
      campaignEndDate: campaign.campaign_end_date,
      maxParticipants: campaign.max_participants,
      currentParticipants: campaign.current_participants,
      status: campaign.status,
      advertiserName: campaign.advertiser_profiles.company_name,
      advertiserBusinessType: campaign.advertiser_profiles.business_type,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return success({
      campaigns: transformedCampaigns,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, campaignErrorCodes.databaseError, message);
  }
};
