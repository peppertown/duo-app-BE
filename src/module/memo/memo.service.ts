import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SseService } from 'src/sse/sse.service';
import { MemoRepository } from 'src/common/repositories/memo.repository';
import { getPartnerId } from 'src/common/utils/couple.util';
import { formatMemoData, formatSingleMemo } from './utils/memo.util';
import { formatApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class MemoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sse: SseService, // SSE 서비스 주입
    private readonly memoRepository: MemoRepository,
  ) {}

  private readonly notificationType = 'MEMO_CREATED'; // 알림 타입 정의

  // 메모 생성
  async createMemo(userId: number, coupleId: number, content: string) {
    const memo = await this.memoRepository.createMemo({
      writerId: userId,
      coupleId,
      content,
    });

    const partnerId = getPartnerId(memo.couple, userId);
    // 알림 생성 및 전송
    await this.sse.createNofication(partnerId, this.notificationType, {
      id: memo.id,
      message: '새로운 메모가 생성되었습니다.',
    });
    return formatApiResponse(200, '메모가 생성되었습니다.', {
      memo: formatSingleMemo(memo, false),
    });
  }

  // 메모 전체 조회
  async getMemo(userId: number, coupleId: number) {
    const widgetMemo = await this.memoRepository.findCoupleWidgetMemo(coupleId);

    const memoData = await this.memoRepository.findMemosByCoupleId(coupleId);
    const memo = formatMemoData(memoData, widgetMemo.widgetMemoId);

    return formatApiResponse(200, '메모 조회 성공', { memo });
  }

  // 위젯 메모 설정
  async setWidgetMemo(userId: number, coupleId: number, memoId: number) {
    const memo = await this.memoRepository.findMemoById(memoId);
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.memoRepository.updateWidgetMemo(coupleId, memoId);

    return formatApiResponse(200, '위젯 메모 설정 완료');
  }

  // 메모 삭제
  async deleteMemo(userId: number, coupleId: number, memoId: number) {
    const memo = await this.memoRepository.findMemoById(memoId);
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.memoRepository.deleteMemo(memoId);

    return formatApiResponse(200, '메모가 삭제되었습니다.');
  }

  // 메모 수정
  async updateMemo(
    userId: number,
    coupleId: number,
    memoId: number,
    content: string,
  ) {
    const memo = await this.memoRepository.findMemoById(memoId);
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedMemo = await this.memoRepository.updateMemo(memoId, {
      content,
    });

    const widgetMemo = await this.memoRepository.findCoupleById(coupleId);

    return formatApiResponse(200, '메모가 수정되었습니다.', {
      memo: formatSingleMemo(
        updatedMemo,
        widgetMemo.widgetMemoId === updatedMemo.id,
      ),
    });
  }
}
