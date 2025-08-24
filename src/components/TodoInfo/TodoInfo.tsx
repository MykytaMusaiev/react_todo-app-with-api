/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (arg: number) => Promise<boolean>;
  isAdding: boolean;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<boolean>;
  editingTodoId: number | null;
  onEdit: (todoId: number | null) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  isAdding,
  onUpdate,
  editingTodoId,
  onEdit,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const isEditing = editingTodoId === todo.id;

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      onEdit(null);

      return;
    }

    if (trimmedTitle === '') {
      const removedSuccessfully = await removeTodo(todo.id);

      if (removedSuccessfully) {
        onEdit(null);
      }

      return;
    }

    const updateSuccessfull = await onUpdate(todo.id, { title: trimmedTitle });

    if (updateSuccessfull) {
      onEdit(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEdit(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleDoubleClick = () => {
    onEdit(todo.id);
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            id={`todo-title-${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
            disabled={isAdding}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={editFieldRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleNewTitle}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => removeTodo(todo.id)}
              disabled={isAdding}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isAdding })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

export default TodoInfo;
