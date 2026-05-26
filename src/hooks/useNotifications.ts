import { useState, useEffect } from 'react';
import { notificationService } from '../services';
import type { NotificationItem } from '../types/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    notificationService
      .getList()
      .then(setNotifications)
      .catch((e) => setError(e instanceof Error ? e.message : '알림을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    notificationService.markAsRead(id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const dismiss = (id: number) => {
    notificationService.dismiss(id).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, unreadCount, loading, error, markAsRead, dismiss };
};
