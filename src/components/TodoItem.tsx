import React from 'react';

interface TodoItemProps {
  text: string;
  description?: string;
  color?: string;
  status: string;
  completed: boolean;
  isCondensed: boolean; // Add this line
  onComplete: () => void;
  onClick: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ text, description, color, status, completed, onComplete, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="todo-item p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer relative"
    >
      {/* Title */}
      <h3 className={`text-lg font-bold mb-2 ${completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
        {text}
      </h3>

      {/* Inline Details */}
      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        {/* Color Indicator */}
        {color && (
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
            title={`Color: ${color}`}
          ></div>
        )}

        {/* Status */}
        <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {status}
        </span>

        {/* Description */}
        {description && (
          <span className="truncate flex-1" title={description}>
            {description}
          </span>
        )}
      </div>

      {/* Complete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          onComplete();
        }}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600"
        aria-label="Complete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;