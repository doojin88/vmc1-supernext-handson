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
    const { page, limit, status = 'recruiting', search } = params;
    const offset = (page - 1) * limit;

    // Build query
    let query = client
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        recruitment_start_date,
        recruitment_end_date,
        recruitment_count,
        benefits,
        mission,
        store_name,
        store_address,
        store_phone,
        status,
        created_at,
        updated_at,
        advertiser_profiles!inner(
          business_name,
          category
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter
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
      recruitmentStartDate: campaign.recruitment_start_date,
      recruitmentEndDate: campaign.recruitment_end_date,
      recruitmentCount: campaign.recruitment_count,
      benefits: campaign.benefits,
      mission: campaign.mission,
      storeName: campaign.store_name,
      storeAddress: campaign.store_address,
      storePhone: campaign.store_phone,
      status: campaign.status,
      advertiserName: (campaign.advertiser_profiles as any).business_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).category,
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
        recruitment_start_date,
        recruitment_end_date,
        recruitment_count,
        benefits,
        mission,
        store_name,
        store_address,
        store_phone,
        status,
        created_at,
        updated_at,
        advertiser_profiles!inner(
          business_name,
          category
        )
      `)
      .eq('id', id)
      .eq('status', 'recruiting')
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
      recruitmentStartDate: campaign.recruitment_start_date,
      recruitmentEndDate: campaign.recruitment_end_date,
      recruitmentCount: campaign.recruitment_count,
      benefits: campaign.benefits,
      mission: campaign.mission,
      storeName: campaign.store_name,
      storeAddress: campaign.store_address,
      storePhone: campaign.store_phone,
      status: campaign.status,
      advertiserName: (campaign.advertiser_profiles as any).business_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).category,
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
        recruitment_start_date: data.recruitmentStartDate,
        recruitment_end_date: data.recruitmentEndDate,
        recruitment_count: data.recruitmentCount,
        benefits: data.benefits,
        mission: data.mission,
        store_name: data.storeName,
        store_address: data.storeAddress,
        store_phone: data.storePhone,
        status: 'recruiting',
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
        recruitment_start_date,
        recruitment_end_date,
        recruitment_count,
        benefits,
        mission,
        store_name,
        store_address,
        store_phone,
        status,
        created_at,
        updated_at,
        advertiser_profiles!inner(
          business_name,
          category
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
      recruitmentStartDate: campaign.recruitment_start_date,
      recruitmentEndDate: campaign.recruitment_end_date,
      recruitmentCount: campaign.recruitment_count,
      benefits: campaign.benefits,
      mission: campaign.mission,
      storeName: campaign.store_name,
      storeAddress: campaign.store_address,
      storePhone: campaign.store_phone,
      status: campaign.status,
      advertiserName: (campaign.advertiser_profiles as any).business_name,
      advertiserBusinessType: (campaign.advertiser_profiles as any).category,
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