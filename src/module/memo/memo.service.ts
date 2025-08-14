import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class MemoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sse: SseService, // SSE 서비스 주입
  ) {}

  private readonly notificationType = 'MEMO_CREATED'; // 알림 타입 정의

  // 메모 생성
  async createMemo(userId: number, coupleId: number, content: string) {
    const memo = await this.prisma.memo.create({
      data: {
        writerId: userId,
        coupleId,
        content,
      },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
        couple: {
          select: {
            aId: true,
            bId: true,
          },
        },
      },
    });

    const partnerId =
      memo.couple.aId == userId ? memo.couple.bId : memo.couple.aId;
    // 알림 생성 및 전송
    await this.sse.createNofication(partnerId, this.notificationType, {
      id: memo.id,
      message: '새로운 메모가 생성되었습니다.',
    });
    return {
      message: { code: 200, text: '메모가 생성되었습니다.' },
      memo: {
        id: memo.id,
        content: memo.content,
        createdAt: memo.createdAt,
        user: { id: memo.writer.id, nickname: memo.writer.nickname },
        isWidgetMemo: false,
      },
    };
  }

  // 메모 전체 조회
  async getMemo(userId: number, coupleId: number) {
    const widgetMemo = await this.prisma.couple.findUnique({
      where: { id: coupleId },
      select: { widgetMemoId: true },
    });

    const memoData = await this.prisma.memo.findMany({
      where: { coupleId },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    const memo = memoData.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      user: {
        id: m.writer.id,
        nickname: m.writer.nickname,
      },
      isWidgetMemo: widgetMemo.widgetMemoId === m.id,
    }));

    return { message: { code: 200, text: '메모 조회 성공' }, memo };
  }

  // 위젯 메모 설정
  async setWidgetMemo(userId: number, coupleId: number, memoId: number) {
    const memo = await this.prisma.memo.findUnique({
      where: { id: memoId },
    });
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.couple.update({
      where: { id: coupleId },
      data: { widgetMemoId: memoId },
    });

    return { message: { code: 200, text: '위젯 메모 설정 완료' } };
  }

  // 메모 삭제
  async deleteMemo(userId: number, coupleId: number, memoId: number) {
    const memo = await this.prisma.memo.findUnique({
      where: { id: memoId },
    });
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.memo.delete({
      where: { id: memoId },
    });

    return { message: { code: 200, text: '메모가 삭제되었습니다.' } };
  }

  // 메모 수정
  async updateMemo(
    userId: number,
    coupleId: number,
    memoId: number,
    content: string,
  ) {
    const memo = await this.prisma.memo.findUnique({
      where: { id: memoId },
    });
    if (!memo || memo.coupleId !== coupleId) {
      throw new HttpException(
        '존재하지 않는 메모입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedMemo = await this.prisma.memo.update({
      where: { id: memoId },
      data: { content },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const widgetMemo = await this.prisma.couple.findUnique({
      where: { id: coupleId },
    });

    return {
      message: { code: 200, text: '메모가 수정되었습니다.' },
      memo: {
        id: updatedMemo.id,
        content: updatedMemo.content,
        createdAt: updatedMemo.createdAt,
        user: {
          id: updatedMemo.writer.id,
          nickname: updatedMemo.writer.nickname,
        },
        isWidgetMemo: widgetMemo.widgetMemoId === updatedMemo.id,
      },
    };
  }
}
