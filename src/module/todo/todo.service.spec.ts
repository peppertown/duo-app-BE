import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoRepository } from 'src/common/repositories/todo.repository';
import { CoupleRepository } from 'src/common/repositories/couple.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: jest.Mocked<TodoRepository>;
  let coupleRepository: jest.Mocked<CoupleRepository>;

  const mockTodoRepository = {
    createTodo: jest.fn(),
    findTodosByCoupleId: jest.fn(),
    findTodosByWriterId: jest.fn(),
    findTodoById: jest.fn(),
    findUserById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  const mockCoupleRepository = {
    findUsersById: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
        {
          provide: CoupleRepository,
          useValue: mockCoupleRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get(TodoRepository);
    coupleRepository = module.get(CoupleRepository);

    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create todo successfully', async () => {
      const userId = 1;
      const coupleId = 10;
      const content = '새로운 투두';

      const mockCreatedTodo = {
        id: 100,
        coupleId,
        writerId: userId,
        content,
        isDone: false,
        createdAt: new Date(),
      };

      todoRepository.createTodo.mockResolvedValue(mockCreatedTodo);

      const result = await service.createTodo(userId, coupleId, content);

      expect(todoRepository.createTodo).toHaveBeenCalledWith({
        coupleId,
        writerId: userId,
        content,
        isDone: false,
      });
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('투두 등록이 완료되었습니다');
      expect(result.todo.id).toBe(100);
    });
  });

  describe('getTodos', () => {
    it('should get couple todos when coupleId exists', async () => {
      const userId = 1;
      const coupleId = 10;

      const mockTodos = [
        {
          id: 1,
          coupleId,
          writerId: 1,
          content: '사용자1의 투두',
          isDone: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          coupleId,
          writerId: 2,
          content: '사용자2의 투두',
          isDone: true,
          createdAt: new Date(),
        },
      ];

      const mockUsers = {
        a: {
          id: 1,
          nickname: '사용자1',
          profileUrl: 'profile1.jpg',
          code: 'code1',
          birthday: new Date('1990-01-01'),
        },
        b: {
          id: 2,
          nickname: '사용자2',
          profileUrl: 'profile2.jpg',
          code: 'code2',
          birthday: new Date('1990-01-02'),
        },
      };

      todoRepository.findTodosByCoupleId.mockResolvedValue(mockTodos);
      coupleRepository.findUsersById.mockResolvedValue(mockUsers);

      const result = await service.getTodos(userId, coupleId);

      expect(todoRepository.findTodosByCoupleId).toHaveBeenCalledWith(coupleId);
      expect(coupleRepository.findUsersById).toHaveBeenCalledWith(coupleId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('투두 조회에 성공했습니다.');
      expect(result.todosByUser[1].nickname).toBe('사용자1');
      expect(result.todosByUser[2].nickname).toBe('사용자2');
      expect(result.todosByUser[1].todos).toHaveLength(1);
      expect(result.todosByUser[2].todos).toHaveLength(1);
    });

    it('should get solo todos when coupleId is null', async () => {
      const userId = 1;
      const coupleId = null;

      const mockUser = {
        id: 1,
        nickname: '솔로유저',
        createdAt: new Date(),
        sub: 'sub1',
        email: 'solo@test.com',
        password: 'password',
        profileUrl: 'profile.jpg',
        authProvider: 'local',
        code: 'code1',
        birthday: new Date('1990-01-01'),
        themeId: 1,
        pushToken: 'token',
        updatedAt: new Date(),
      };
      const mockTodos = [
        {
          id: 1,
          coupleId: null,
          writerId: 1,
          content: '개인 투두',
          isDone: false,
          createdAt: new Date(),
        },
      ];

      todoRepository.findUserById.mockResolvedValue(mockUser);
      todoRepository.findTodosByWriterId.mockResolvedValue(mockTodos);

      const result = await service.getTodos(userId, coupleId);

      expect(todoRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(todoRepository.findTodosByWriterId).toHaveBeenCalledWith(userId);
      expect(result.message.code).toBe(200);
      expect(result.todosByUser[1].nickname).toBe('솔로유저');
      expect(result.todosByUser[1].todos).toHaveLength(1);
    });

    it('should get solo todos when coupleId is 0', async () => {
      const userId = 1;
      const coupleId = 0;

      const mockUser = {
        id: 1,
        nickname: '솔로유저',
        createdAt: new Date(),
        sub: 'sub1',
        email: 'solo@test.com',
        password: 'password',
        profileUrl: 'profile.jpg',
        authProvider: 'local',
        code: 'code1',
        birthday: new Date('1990-01-01'),
        themeId: 1,
        pushToken: 'token',
        updatedAt: new Date(),
      };
      const mockTodos = [];

      todoRepository.findUserById.mockResolvedValue(mockUser);
      todoRepository.findTodosByWriterId.mockResolvedValue(mockTodos);

      const result = await service.getTodos(userId, coupleId);

      expect(todoRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(todoRepository.findTodosByWriterId).toHaveBeenCalledWith(userId);
      expect(result.todosByUser[1].todos).toHaveLength(0);
    });
  });

  describe('getSoloTodo', () => {
    it('should get solo todos correctly', async () => {
      const userId = 1;

      const mockUser = {
        id: 1,
        nickname: '솔로유저',
        createdAt: new Date(),
        sub: 'sub1',
        email: 'solo@test.com',
        password: 'password',
        profileUrl: 'profile.jpg',
        authProvider: 'local',
        code: 'code1',
        birthday: new Date('1990-01-01'),
        themeId: 1,
        pushToken: 'token',
        updatedAt: new Date(),
      };
      const mockTodos = [
        {
          id: 1,
          coupleId: null,
          writerId: 1,
          content: '개인 투두 1',
          isDone: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          coupleId: null,
          writerId: 1,
          content: '개인 투두 2',
          isDone: true,
          createdAt: new Date(),
        },
      ];

      todoRepository.findUserById.mockResolvedValue(mockUser);
      todoRepository.findTodosByWriterId.mockResolvedValue(mockTodos);

      const result = await service.getSoloTodo(userId);

      expect(todoRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(todoRepository.findTodosByWriterId).toHaveBeenCalledWith(userId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('투두 조회에 성공했습니다.');
      expect(result.todosByUser[1].nickname).toBe('솔로유저');
      expect(result.todosByUser[1].todos).toHaveLength(2);
    });
  });

  describe('todoDoneHandler', () => {
    it('should toggle todo done status from false to true', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: userId,
        content: '투두 내용',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      const mockUpdatedTodo = {
        ...mockTodo,
        isDone: true,
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);
      todoRepository.updateTodo.mockResolvedValue(mockUpdatedTodo);

      const result = await service.todoDoneHandler(userId, todoId);

      expect(todoRepository.findTodoById).toHaveBeenCalledWith(todoId);
      expect(todoRepository.updateTodo).toHaveBeenCalledWith(todoId, {
        isDone: true, // false -> true
      });
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('투두 완료 상태가 변경되었습니다.');
      expect(result.todo.isDone).toBe(true);
    });

    it('should toggle todo done status from true to false', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: userId,
        content: '투두 내용',
        isDone: true, // 이미 완료된 상태
        coupleId: 10,
        createdAt: new Date(),
      };

      const mockUpdatedTodo = {
        ...mockTodo,
        isDone: false,
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);
      todoRepository.updateTodo.mockResolvedValue(mockUpdatedTodo);

      const result = await service.todoDoneHandler(userId, todoId);

      expect(todoRepository.updateTodo).toHaveBeenCalledWith(todoId, {
        isDone: false, // true -> false
      });
      expect(result.todo.isDone).toBe(false);
    });

    it('should throw exception when user has no permission', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: 999, // 다른 사용자의 투두
        content: '남의 투두',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);

      await expect(service.todoDoneHandler(userId, todoId)).rejects.toThrow(
        new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST),
      );

      expect(todoRepository.updateTodo).not.toHaveBeenCalled();
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: userId,
        content: '삭제할 투두',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);
      todoRepository.deleteTodo.mockResolvedValue(undefined);

      const result = await service.deleteTodo(userId, todoId);

      expect(todoRepository.findTodoById).toHaveBeenCalledWith(todoId);
      expect(todoRepository.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(result.message.code).toBe(200);
      expect(result.message.text).toBe('투두가 삭제되었습니다.');
    });

    it('should throw exception when user has no permission to delete', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: 999, // 다른 사용자의 투두
        content: '남의 투두',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);

      await expect(service.deleteTodo(userId, todoId)).rejects.toThrow(
        new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST),
      );

      expect(todoRepository.deleteTodo).not.toHaveBeenCalled();
    });
  });

  describe('confirmTodoAuth', () => {
    it('should return todo when user has permission', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: userId,
        content: '내 투두',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);

      const result = await service.confirmTodoAuth(userId, todoId);

      expect(todoRepository.findTodoById).toHaveBeenCalledWith(todoId);
      expect(result).toEqual(mockTodo);
    });

    it('should throw exception when user has no permission', async () => {
      const userId = 1;
      const todoId = 100;

      const mockTodo = {
        id: todoId,
        writerId: 999, // 다른 사용자
        content: '남의 투두',
        isDone: false,
        coupleId: 10,
        createdAt: new Date(),
      };

      todoRepository.findTodoById.mockResolvedValue(mockTodo);

      await expect(service.confirmTodoAuth(userId, todoId)).rejects.toThrow(
        new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
