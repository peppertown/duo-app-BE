import { NotificationType } from '@prisma/client';

export interface NotificationSender {
  send(params: {
    to: number;
    type: NotificationType;
    payload: { title: string; body: string };
  }): Promise<void>;
}
