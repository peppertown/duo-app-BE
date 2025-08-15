import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoRepository } from 'src/common/repositories/memo.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SseService } from 'src/sse/sse.service';

describe('MemoService', () => {
  let service: MemoService;
  let memoRepository: jest.Mocked<MemoRepository>;
  let sseService: jest.Mocked<SseService>;

  const mockMemoRepository = {
    createMemo: jest.fn(),
    findCoupleWidgetMemo: jest.fn(),
    findMemosByCoupleId: jest.fn(),
    findMemoById: jest.fn(),
    updateWidgetMemo: jest.fn(),
    deleteMemo: jest.fn(),
    updateMemo: jest.fn(),
    findCoupleById: jest.fn(),
  };

  const mockSseService = {
    createNofication: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: MemoRepository,
          useValue: mockMemoRepository,
        },
        {
          provide: SseService,
          useValue: mockSseService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MemoService>(MemoService);
    memoRepository = module.get(MemoRepository);
    sseService = module.get(SseService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('createMemo', () => {
    it('should create memo successfully and send notification', async () => {
      const userId = 1;
      const coupleId = 10;
      const content = '새로운 메모';

      const mockCreatedMemo = {
        id: 100,
        coupleId,
        writerId: userId,
        content,
        createdAt: new Date(),
        writer: { id: userId, nickname: '사용자' },
        couple: { aId: userId, bId: 2 },
      };

      memoRepository.createMemo.mockResolvedValue(mockCreatedMemo);
      sseService.createNofication.mockResolvedValue(undefined);

      const result = await service.createMemo(userId, coupleId, content);

      expect(memoRepository.createMemo).toHaveBeenCalledWith({
        writerId: userId,
        coupleId,
        content,
      });
      expect(sseService.createNofication).toHaveBeenCalledWith(
        2, // partnerId
        'MEMO_CREATED',
        {
          id: 100,
          message: '새로운 메모가 생성되었습니다.',
        },
      );
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('메모가 생성되었습니다.');
      expect(result.memo.id).toBe(100);
    });
  });

  describe('getMemo', () => {
    it('should get memos successfully', async () => {
      const userId = 1;
      const coupleId = 10;

      const mockWidgetMemo = { widgetMemoId: 1 };
      const mockMemoData = [
        {
          id: 1,
          coupleId,
          writerId: 1,
          content: '메모1',
          createdAt: new Date(),
          writer: { id: 1, nickname: '사용자1' },
        },
        {
          id: 2,
          coupleId,
          writerId: 2,
          content: '메모2',
          createdAt: new Date(),
          writer: { id: 2, nickname: '사용자2' },
        },
      ];

      memoRepository.findCoupleWidgetMemo.mockResolvedValue(mockWidgetMemo);
      memoRepository.findMemosByCoupleId.mockResolvedValue(mockMemoData);

      const result = await service.getMemo(userId, coupleId);

      expect(memoRepository.findCoupleWidgetMemo).toHaveBeenCalledWith(
        coupleId,
      );
      expect(memoRepository.findMemosByCoupleId).toHaveBeenCalledWith(coupleId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('메모 조회 성공');
      expect(result.memo).toHaveLength(2);
    });
  });

  describe('setWidgetMemo', () => {
    it('should set widget memo successfully', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 5;

      const mockMemo = {
        id: memoId,
        coupleId,
        writerId: userId,
        content: '위젯 메모',
        createdAt: new Date(),
      };

      memoRepository.findMemoById.mockResolvedValue(mockMemo);
      memoRepository.updateWidgetMemo.mockResolvedValue(undefined);

      const result = await service.setWidgetMemo(userId, coupleId, memoId);

      expect(memoRepository.findMemoById).toHaveBeenCalledWith(memoId);
      expect(memoRepository.updateWidgetMemo).toHaveBeenCalledWith(
        coupleId,
        memoId,
      );
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('위젯 메모 설정 완료');
    });

    it('should throw exception when memo not found', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 999;

      memoRepository.findMemoById.mockResolvedValue(null);

      await expect(
        service.setWidgetMemo(userId, coupleId, memoId),
      ).rejects.toThrow(
        new HttpException('존재하지 않는 메모입니다.', HttpStatus.NOT_FOUND),
      );

      expect(memoRepository.updateWidgetMemo).not.toHaveBeenCalled();
    });

    it('should throw exception when memo belongs to different couple', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 5;

      const mockMemo = {
        id: memoId,
        coupleId: 999, // 다른 커플의 메모
        writerId: userId,
        content: '다른 커플 메모',
        createdAt: new Date(),
      };

      memoRepository.findMemoById.mockResolvedValue(mockMemo);

      await expect(
        service.setWidgetMemo(userId, coupleId, memoId),
      ).rejects.toThrow(
        new HttpException('존재하지 않는 메모입니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteMemo', () => {
    it('should delete memo successfully', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 5;

      const mockMemo = {
        id: memoId,
        coupleId,
        writerId: userId,
        content: '삭제할 메모',
        createdAt: new Date(),
      };

      memoRepository.findMemoById.mockResolvedValue(mockMemo);
      memoRepository.deleteMemo.mockResolvedValue(undefined);

      const result = await service.deleteMemo(userId, coupleId, memoId);

      expect(memoRepository.findMemoById).toHaveBeenCalledWith(memoId);
      expect(memoRepository.deleteMemo).toHaveBeenCalledWith(memoId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('메모가 삭제되었습니다.');
    });

    it('should throw exception when trying to delete non-existent memo', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 999;

      memoRepository.findMemoById.mockResolvedValue(null);

      await expect(
        service.deleteMemo(userId, coupleId, memoId),
      ).rejects.toThrow(
        new HttpException('존재하지 않는 메모입니다.', HttpStatus.NOT_FOUND),
      );

      expect(memoRepository.deleteMemo).not.toHaveBeenCalled();
    });
  });

  describe('updateMemo', () => {
    it('should update memo successfully', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 5;
      const newContent = '수정된 메모 내용';

      const mockMemo = {
        id: memoId,
        coupleId,
        writerId: userId,
        content: '원래 내용',
        createdAt: new Date(),
      };

      const mockUpdatedMemo = {
        id: memoId,
        coupleId,
        writerId: userId,
        content: newContent,
        createdAt: new Date(),
        writer: { id: userId, nickname: '사용자' },
      };

      const mockCouple = {
        id: coupleId,
        createdAt: new Date(),
        aId: userId,
        bId: 2,
        anniversary: new Date(),
        widgetMemoId: memoId,
      };

      memoRepository.findMemoById.mockResolvedValue(mockMemo);
      memoRepository.updateMemo.mockResolvedValue(mockUpdatedMemo);
      memoRepository.findCoupleById.mockResolvedValue(mockCouple);

      const result = await service.updateMemo(
        userId,
        coupleId,
        memoId,
        newContent,
      );

      expect(memoRepository.findMemoById).toHaveBeenCalledWith(memoId);
      expect(memoRepository.updateMemo).toHaveBeenCalledWith(memoId, {
        content: newContent,
      });
      expect(memoRepository.findCoupleById).toHaveBeenCalledWith(coupleId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('메모가 수정되었습니다.');
      expect(result.memo.content).toBe(newContent);
      expect(result.memo.isWidgetMemo).toBe(true);
    });

    it('should throw exception when trying to update non-existent memo', async () => {
      const userId = 1;
      const coupleId = 10;
      const memoId = 999;
      const newContent = '수정 내용';

      memoRepository.findMemoById.mockResolvedValue(null);

      await expect(
        service.updateMemo(userId, coupleId, memoId, newContent),
      ).rejects.toThrow(
        new HttpException('존재하지 않는 메모입니다.', HttpStatus.NOT_FOUND),
      );

      expect(memoRepository.updateMemo).not.toHaveBeenCalled();
    });
  });
});
