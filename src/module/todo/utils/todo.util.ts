// 사용자별 Todo 그룹화
export const groupTodosByUser = (
  todos: any[],
  users: any,
): Record<number, { nickname: string; todos: any[] }> => {
  const todosByUser: Record<number, { nickname: string; todos: any[] }> = {};

  for (const key of ['a', 'b']) {
    const user = users[key];
    todosByUser[user.id] = {
      nickname: user.nickname,
      todos: todos.filter((todo) => todo.writerId === user.id),
    };
  }

  return todosByUser;
};

// 솔로 Todo 데이터 포매팅
export const formatSoloTodoData = (userId: number, user: any, todos: any[]) => {
  return {
    [userId]: {
      nickname: user.nickname,
      todos,
    },
  };
};
