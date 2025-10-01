export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: '심사 중',
  approved: '승인됨',
  rejected: '거절됨',
  withdrawn: '취소됨',
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};
