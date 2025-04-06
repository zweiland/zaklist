import React from 'react';
import TodoItem from './TodoItem';

export interface Todo {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  color?: string;
  createdAt: string; // Add this line
  status: 'Backlog' | 'To Do' | 'In Progress' | 'Blocked' | 'Done' | 'Archived'; // Add this line
}

interface TodoListProps {
  todos: Todo[];
  onRemove: (id: number) => void;
  onSelect: (todo: Todo) => void;
  isCondensed: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemove, onSelect, isCondensed, setTodos }) => {
  // Sort todos: incomplete todos first, then completed todos
  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <ul className="space-y-2">
      {sortedTodos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            text={todo.text}
            description={todo.description}
            completed={todo.completed || false}
            color={todo.color || 'gray'}
            status={todo.status || 'Backlog'}
            onComplete={() => {
              const updatedTodos = todos.map((t) =>
                t.id === todo.id ? { ...t, completed: !t.completed } : t
              );
              setTodos(updatedTodos);
              localStorage.setItem('todos', JSON.stringify(updatedTodos));
            }}
            onClick={() => onSelect(todo)}
            isCondensed={isCondensed}
          />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;