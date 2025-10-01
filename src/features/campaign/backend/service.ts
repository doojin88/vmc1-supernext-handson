import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { 
  ListCampaignsRequest, 
  ListCampaignsResponse, 
  GetCampaignRequest, 
  GetCampaignResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  ListAdvertiserCampaignsRequest,
  ListAdvertiserCampaignsResponse,
} from './schema';
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
      advertiserName: (campaign.advertiser_profiles as any).company_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).business_type,
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

export const getCampaign = async (
  client: SupabaseClient,
  params: GetCampaignRequest,
): Promise<HandlerResult<GetCampaignResponse, CampaignServiceError, unknown>> => {
  try {
    const { id } = params;

    const { data: campaign, error } = await client
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
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return failure(
          404,
          campaignErrorCodes.campaignNotFound,
          '캠페인을 찾을 수 없습니다',
        );
      }
      return failure(
        500,
        campaignErrorCodes.databaseError,
        `캠페인 조회 실패: ${error.message}`,
      );
    }

    if (!campaign) {
      return failure(
        404,
        campaignErrorCodes.campaignNotFound,
        '캠페인을 찾을 수 없습니다',
      );
    }

    // Transform data
    const transformedCampaign = {
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
      advertiserName: (campaign.advertiser_profiles as any).company_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).business_type,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    };

    return success(transformedCampaign);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, campaignErrorCodes.databaseError, message);
  }
};

export const createCampaign = async (
  client: SupabaseClient,
  advertiserUserId: string,
  data: CreateCampaignRequest,
): Promise<HandlerResult<CreateCampaignResponse, CampaignServiceError, unknown>> => {
  try {
    // Create campaign
    const { data: newCampaign, error: campaignError } = await client
      .from('campaigns')
      .insert({
        advertiser_id: advertiserUserId,
        title: data.title,
        description: data.description,
        category: data.category,
        target_audience: data.targetAudience,
        requirements: data.requirements,
        compensation: data.compensation,
        application_deadline: data.applicationDeadline,
        campaign_start_date: data.campaignStartDate,
        campaign_end_date: data.campaignEndDate,
        max_participants: data.maxParticipants,
        current_participants: 0,
        status: 'draft',
      })
      .select()
      .single();

    if (campaignError) {
      return failure(
        500,
        campaignErrorCodes.campaignCreationFailed,
        `캠페인 생성 실패: ${campaignError.message}`,
      );
    }

    return success({
      campaignId: newCampaign.id,
      status: newCampaign.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, campaignErrorCodes.campaignCreationFailed, message);
  }
};

export const listAdvertiserCampaigns = async (
  client: SupabaseClient,
  advertiserUserId: string,
  params: ListAdvertiserCampaignsRequest,
): Promise<HandlerResult<ListAdvertiserCampaignsResponse, CampaignServiceError, unknown>> => {
  try {
    const { page, limit, status } = params;
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
      .eq('advertiser_id', advertiserUserId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
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
      advertiserName: (campaign.advertiser_profiles as any).company_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).business_type,
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
