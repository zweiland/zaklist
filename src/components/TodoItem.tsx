import React from 'react';

interface TodoItemProps {
  text: string;
  description?: string; // Optional description
  onComplete: () => void;
  onClick: () => void; // Handler for clicking the todo
  isCondensed: boolean; // New prop for list style
  completed: boolean; // New prop for completed state
  color?: string; // New optional color prop
}

const TodoItem: React.FC<TodoItemProps> = ({ text, description, onComplete, onClick, isCondensed, color }) => {
  return (
    <div
      onClick={onClick}
      className={`todo-item flex items-center justify-between ${
        isCondensed ? 'p-2' : 'p-3'
      } shadow-md rounded-lg transition-all duration-200 cursor-pointer 
      hover:bg-gray-200 dark:hover:bg-gray-700`}
      style={{
        backgroundColor: 'var(--bg-color)', // Use theme background color
        color: color ? 'white' : 'inherit', // Ensure text is readable on colored backgrounds
      }}
    >
      <div className="flex items-center">
        {/* Color Circle */}
        <div
          className="w-3 h-3 rounded-full mr-3"
          style={{
            backgroundColor: color || 'var(--default-circle-color)', // Use the item's color or default
          }}
        ></div>
        <span
          className={`font-medium ${
            isCondensed ? 'text-sm' : 'text-base'
          } text-gray-800 dark:text-gray-100`}
        >
          {text}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          onComplete();
        }}
        className="p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
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