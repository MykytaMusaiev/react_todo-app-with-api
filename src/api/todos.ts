import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3334;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
// export const postTodos = (data: Omit<Todo, 'id'>) => {
//   return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
// };

export const postTodos = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
