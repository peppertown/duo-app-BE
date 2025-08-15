import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SseService } from 'src/sse/sse.service';
import { ListRepository } from 'src/common/repositories/list.repository';
import { CoupleRepository } from 'src/common/repositories/couple.repository';
import {
  formatListData,
  createBucketListCompletionMessage,
} from './utils/list.util';
import { formatApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class ListService {
  constructor(
    private readonly sse: SseService,
    private readonly listRepository: ListRepository,
    private readonly coupleRepository: CoupleRepository,
  ) {}

  private readonly notificationType = 'LIST_TOGGLED';

  // 리스트 목록 추가
  async createList(
    userId: number,
    coupleId: number,
    categoryId: number,
    content: string,
  ) {
    const coupleList = await this.listRepository.findListByCoupleId(coupleId);

    await this.listRepository.createListContent({
      listId: coupleList.id,
      writerId: userId,
      categoryId,
      content,
    });

    return formatApiResponse(200, '리스트 목록이 작성되었습니다.');
  }

  // 리스트 조회
  async getList(userId: number, coupleId: number) {
    const coupleList = await this.listRepository.findListByCoupleId(coupleId);

    if (!coupleList)
      throw new HttpException(
        '버킷리스트 사용 전 커플 연결이 필요합니다.',
        HttpStatus.BAD_REQUEST,
      );

    const listData = await this.listRepository.findListContentsByListId(
      coupleList.id,
    );

    const list = formatListData(listData, userId);

    return formatApiResponse(200, '버킷 리스트 조회가 완료되었습니다.', {
      list,
    });
  }

  // 리스트 목록 완료여부 토글
  async listDoneHandler(userId: number, coupleId: number, contentId: number) {
    const listContent =
      await this.listRepository.findListContentById(contentId);

    if (!listContent) {
      throw new HttpException(
        '리스트 목록을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.listRepository.updateListContent(contentId, {
      isDone: !listContent.isDone,
    });

    // 완료시 알림 전송
    if (!listContent.isDone) {
      const partnerId =
        await this.coupleRepository.findPartnerIdByUserAndCoupleId(
          userId,
          coupleId,
        );

      if (partnerId) {
        await this.sse.createNofication(partnerId, this.notificationType, {
          id: listContent.id,
          message: createBucketListCompletionMessage(
            listContent.category.name,
            listContent.content,
          ),
        });
      }
    }

    return formatApiResponse(200, '리스트 완료 여부 설정이 완료되었습니다.');
  }

  // 리스트 목록 삭제
  async deleteList(userId: number, coupleId: number, contentId: number) {
    await this.listRepository.deleteListContent(contentId);

    return formatApiResponse(200, '리스트 목록이 삭제 삭제되었습니다.');
  }
}
