import { http } from './client';
import type { ApiResponse, NotificationItem } from '../types/api';

export const notificationService = {
  getList: (): Promise<NotificationItem[]> =>
    http
      .get<ApiResponse<NotificationItem[]>>('/api/notifications')
      .then((res) => res.data),

  getUnreadCount: (): Promise<number> =>
    http
      .get<ApiResponse<number>>('/api/notifications/unread-count')
      .then((res) => res.data),

  markAsRead: (id: number): Promise<void> =>
    http.patch(`/api/notifications/${id}/read`),

  dismiss: (id: number): Promise<void> =>
    http.delete(`/api/notifications/${id}`),
};
