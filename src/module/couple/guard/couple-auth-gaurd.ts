import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CoupleService } from '../couple.service';

@Injectable()
export class CoupleAuthGuard implements CanActivate {
  constructor(private coupleService: CoupleService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const coupleId = Number(request.params.coupleId || request.body.coupleId);
    const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);
    if (!auth)
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    return true;
  }
}
