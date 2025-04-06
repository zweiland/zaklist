import React from 'react';
import TodoItem from './TodoItem';

export interface Todo {
  id: number;
  text: string;
  description?: string;
  completed?: boolean;
  color?: string;
}

interface TodoListProps {
  todos: Todo[];
  onRemove: (id: number) => void;
  onSelect: (todo: Todo) => void;
  isCondensed: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemove, onSelect, isCondensed }) => {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            text={todo.text}
            description={todo.description}
            completed={todo.completed || false}
            color={todo.color}
            onComplete={() => onRemove(todo.id)}
            onClick={() => onSelect(todo)}
            isCondensed={isCondensed}
          />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;