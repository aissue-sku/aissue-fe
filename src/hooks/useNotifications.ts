import { useState, useEffect } from 'react';
import { notificationService } from '../services';
import type { NotificationItem } from '../types/api';

// 컴포넌트 재마운트 시에도 낙관적 읽음 상태 유지
const pendingReadIds = new Set<number>();

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    notificationService
      .getList()
      .then((fetched) =>
        // 재마운트 시 API 응답이 아직 안 반영됐을 수 있으므로 로컬 캐시와 병합
        setNotifications(
          fetched.map((n) =>
            pendingReadIds.has(n.id) ? { ...n, read: true } : n,
          ),
        ),
      )
      .catch((e) =>
        setError(e instanceof Error ? e.message : '알림을 불러오지 못했습니다.'),
      )
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    pendingReadIds.add(id);
    notificationService
      .markAsRead(id)
      .then(() => pendingReadIds.delete(id))
      .catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => pendingReadIds.add(n.id));
    notificationService
      .markAllAsRead()
      .then(() => notifications.forEach((n) => pendingReadIds.delete(n.id)))
      .catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteRead = () => {
    notifications
      .filter((n) => n.read)
      .forEach((n) => pendingReadIds.delete(n.id));
    notificationService.deleteRead().catch(() => {});
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const dismiss = (id: number) => {
    pendingReadIds.delete(id);
    notificationService.dismiss(id).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteRead,
    dismiss,
  };
};
