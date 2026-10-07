import { NotificationItem, UserRole } from '../types';

export const notificationService = {
  create(
    title: string,
    message: string,
    targetRole: UserRole | 'all' = 'all',
    type: 'order' | 'earnings' | 'alert' | 'system' | 'pass' = 'order',
    orderId?: string,
    targetUserId?: string
  ): NotificationItem {
    return {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      targetRole,
      targetUserId,
      orderId,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
  },
};
