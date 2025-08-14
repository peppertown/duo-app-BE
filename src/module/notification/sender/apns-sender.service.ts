import { Injectable } from '@nestjs/common';
import { NotificationSender } from './notification-sender';

@Injectable()
export class ApnsSenderService implements NotificationSender {
  async send() {}
}
