import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { 
  CreateApplicationRequest, 
  CreateApplicationResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
  ListCampaignApplicationsRequest,
  ListCampaignApplicationsResponse,
} from './schema';
import { applicationErrorCodes, type ApplicationServiceError } from './error';

export const createApplication = async (
  client: SupabaseClient,
  userId: string,
  data: CreateApplicationRequest,
): Promise<HandlerResult<CreateApplicationResponse, ApplicationServiceError, unknown>> => {
  try {
    // Check if campaign exists and is open for applications
    const { data: campaign, error: campaignError } = await client
      .from('campaigns')
      .select('id, title, application_deadline, status, max_participants, current_participants')
      .eq('id', data.campaignId)
      .eq('status', 'active')
      .single();

    if (campaignError || !campaign) {
      return failure(
        404,
        applicationErrorCodes.campaignNotFound,
        '캠페인을 찾을 수 없거나 신청이 불가능합니다',
      );
    }

    // Check if application deadline has passed
    if (new Date(campaign.application_deadline) < new Date()) {
      return failure(
        400,
        applicationErrorCodes.applicationClosed,
        '신청 마감일이 지났습니다',
      );
    }

    // Check if campaign is full
    if (campaign.current_participants >= campaign.max_participants) {
      return failure(
        400,
        applicationErrorCodes.applicationClosed,
        '모집 인원이 마감되었습니다',
      );
    }

    // Check for duplicate application
    const { data: existingApplication, error: checkError } = await client
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('campaign_id', data.campaignId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return failure(
        500,
        applicationErrorCodes.databaseError,
        `중복 신청 확인 중 오류: ${checkError.message}`,
      );
    }

    if (existingApplication) {
      return failure(
        409,
        applicationErrorCodes.duplicateApplication,
        '이미 신청한 캠페인입니다',
      );
    }

    // Create application
    const { data: newApplication, error: applicationError } = await client
      .from('applications')
      .insert({
        user_id: userId,
        campaign_id: data.campaignId,
        motivation: data.motivation,
        experience: data.experience,
        expected_outcome: data.expectedOutcome,
        status: 'pending',
      })
      .select()
      .single();

    if (applicationError) {
      return failure(
        500,
        applicationErrorCodes.applicationCreationFailed,
        `신청 생성 실패: ${applicationError.message}`,
      );
    }

    return success({
      applicationId: newApplication.id,
      status: newApplication.status,
      submittedAt: newApplication.created_at,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, applicationErrorCodes.applicationCreationFailed, message);
  }
};

export const listApplications = async (
  client: SupabaseClient,
  userId: string,
  params: ListApplicationsRequest,
): Promise<HandlerResult<ListApplicationsResponse, ApplicationServiceError, unknown>> => {
  try {
    const { page, limit, status } = params;
    const offset = (page - 1) * limit;

    // Build query
    let query = client
      .from('applications')
      .select(`
        id,
        campaign_id,
        motivation,
        experience,
        expected_outcome,
        status,
        created_at,
        updated_at,
        campaigns!inner(
          title
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error, count } = await query;

    if (error) {
      return failure(
        500,
        applicationErrorCodes.databaseError,
        `신청 목록 조회 실패: ${error.message}`,
      );
    }

    if (!applications) {
      return failure(
        404,
        applicationErrorCodes.applicationNotFound,
        '신청 내역을 찾을 수 없습니다',
      );
    }

    // Transform data
    const transformedApplications = applications.map((app: any) => ({
      id: app.id,
      campaignId: app.campaign_id,
      campaignTitle: app.campaigns.title,
      motivation: app.motivation,
      experience: app.experience,
      expectedOutcome: app.expected_outcome,
      status: app.status,
      submittedAt: app.created_at,
      reviewedAt: app.updated_at !== app.created_at ? app.updated_at : null,
      feedback: null, // TODO: Add feedback field to database
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return success({
      applications: transformedApplications,
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
    return failure(500, applicationErrorCodes.databaseError, message);
  }
};

export const updateApplicationStatus = async (
  client: SupabaseClient,
  advertiserUserId: string,
  data: UpdateApplicationStatusRequest,
): Promise<HandlerResult<UpdateApplicationStatusResponse, ApplicationServiceError, unknown>> => {
  try {
    // First, verify that the advertiser owns the campaign for this application
    const { data: application, error: appError } = await client
      .from('applications')
      .select(`
        id,
        campaign_id,
        campaigns!inner(
          advertiser_id
        )
      `)
      .eq('id', data.applicationId)
      .single();

    if (appError || !application) {
      return failure(
        404,
        applicationErrorCodes.applicationNotFound,
        '신청을 찾을 수 없습니다',
      );
    }

    // Check if the advertiser owns this campaign
    if ((application.campaigns as any).advertiser_id !== advertiserUserId) {
      return failure(
        403,
        applicationErrorCodes.unauthorizedAccess,
        '이 캠페인의 신청을 관리할 권한이 없습니다',
      );
    }

    // Update application status
    const { data: updatedApplication, error: updateError } = await client
      .from('applications')
      .update({
        status: data.status,
        feedback: data.feedback || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.applicationId)
      .select()
      .single();

    if (updateError) {
      return failure(
        500,
        applicationErrorCodes.applicationUpdateFailed,
        `신청 상태 업데이트 실패: ${updateError.message}`,
      );
    }

    return success({
      applicationId: updatedApplication.id,
      status: updatedApplication.status,
      updatedAt: updatedApplication.updated_at,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, applicationErrorCodes.applicationUpdateFailed, message);
  }
};

export const listCampaignApplications = async (
  client: SupabaseClient,
  advertiserUserId: string,
  params: ListCampaignApplicationsRequest,
): Promise<HandlerResult<ListCampaignApplicationsResponse, ApplicationServiceError, unknown>> => {
  try {
    const { campaignId, page, limit, status } = params;
    const offset = (page - 1) * limit;

    // First, verify that the advertiser owns this campaign
    const { data: campaign, error: campaignError } = await client
      .from('campaigns')
      .select('id, advertiser_id')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return failure(
        404,
        applicationErrorCodes.campaignNotFound,
        '캠페인을 찾을 수 없습니다',
      );
    }

    if (campaign.advertiser_id !== advertiserUserId) {
      return failure(
        403,
        applicationErrorCodes.unauthorizedAccess,
        '이 캠페인의 신청을 조회할 권한이 없습니다',
      );
    }

    // Build query for applications
    let query = client
      .from('applications')
      .select(`
        id,
        campaign_id,
        motivation,
        experience,
        expected_outcome,
        status,
        created_at,
        updated_at,
        user_profiles!inner(
          name,
          email
        )
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error, count } = await query;

    if (error) {
      return failure(
        500,
        applicationErrorCodes.databaseError,
        `신청 목록 조회 실패: ${error.message}`,
      );
    }

    if (!applications) {
      return failure(
        404,
        applicationErrorCodes.applicationNotFound,
        '신청 내역을 찾을 수 없습니다',
      );
    }

    // Transform data
    const transformedApplications = applications.map((app: any) => ({
      id: app.id,
      campaignId: app.campaign_id,
      campaignTitle: '', // Not needed for this response
      motivation: app.motivation,
      experience: app.experience,
      expectedOutcome: app.expected_outcome,
      status: app.status,
      submittedAt: app.created_at,
      reviewedAt: app.updated_at !== app.created_at ? app.updated_at : null,
      feedback: null, // TODO: Add feedback field to database
      applicantName: app.user_profiles.name,
      applicantEmail: app.user_profiles.email,
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return success({
      applications: transformedApplications,
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
    return failure(500, applicationErrorCodes.databaseError, message);
  }
};
