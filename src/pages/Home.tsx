import React, { useState, useEffect } from 'react';
import { Sun, Moon, Microphone, FunnelSimple, SortDescending, SortAscending, ChartPie } from 'phosphor-react';
import TodoList, { Todo } from '../components/TodoList';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Add this type definition at the top of the file
type SpeechRecognitionEvent = Event & {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
};

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false); // State for list style
  const [isListening, setIsListening] = useState(false); // State for voice input
  const [sortOption, setSortOption] = useState('time'); // State for sorting option
  const [statusFilter, setStatusFilter] = useState<string>(''); // State for status filter
  const [colorFilter, setColorFilter] = useState<string>(''); // State for color filter
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isShaking) {
      const timeout = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isShaking]);

  const addTodo = () => {
    if (inputValue.trim() === '') {
      setIsShaking(true);
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      description: '',
      completed: false,
      color: '', // Default color
      createdAt: new Date().toISOString(), // Add timestamp
      status: 'Backlog', // Default status
    };

    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setInputValue('');
  };

  const updateTodoDescription = (id: number, description: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, description } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    // Update the selectedTodo to reflect the change immediately
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo({ ...selectedTodo, description });
    }
  };

  const updateTodoName = (id: number, text: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    // Update the selectedTodo to reflect the change immediately
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo({ ...selectedTodo, text });
    }
  };

  const updateTodoColor = (id: number, color: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, color } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    // Update the selectedTodo to reflect the change immediately
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo({ ...selectedTodo, color });
    }
  };

  const updateTodoStatus = (id: number, status: Todo['status']) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, status } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    // Update the selectedTodo to reflect the change immediately
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo({ ...selectedTodo, status });
    }
  };

  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openTodoDetails = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const closeTodoDetails = () => {
    setSelectedTodo(null);
  };

  const toggleListStyle = () => {
    setIsCondensed(!isCondensed); // Toggle between condensed and cushy
  };

  // Voice input functionality
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript); // Update the input field with the recognized text
    };

    recognition.start();
  };

  // Sorting logic
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOption === 'color') {
      return (a.color || '').localeCompare(b.color || '');
    }
    return b.id - a.id; // Default: Sort by time added (newest first)
  });

  // Filtered Todos
  const filteredTodos = sortedTodos.filter((todo) => {
    const matchesStatus = statusFilter ? todo.status === statusFilter : true;
    const matchesColor = colorFilter ? todo.color === colorFilter : true;
    return matchesStatus && matchesColor;
  });

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePage="home" isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="relative flex mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 rounded-lg p-4 pr-12 text-lg text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                isShaking ? 'animate-shake' : ''
              }`}
              placeholder="Add a new todo"
            />
            {/* Microphone Button */}
            <button
              onClick={startListening}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600"
              aria-label="Start Voice Input"
            >
              <Microphone size={20} weight="thin" />
            </button>
          </div>
          {/* Toggle Button for List Style */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleListStyle}
              className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              {isCondensed ? 'Switch to Cushy' : 'Switch to Condensed'}
            </button>
          </div>

          {/* Sorting and Filtering Row */}
          <div className="flex items-center justify-end mb-4 space-x-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 flex items-center justify-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FunnelSimple size={20} weight="thin" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
                  {/* Status Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                    >
                      <option value="">All Statuses</option>
                      <option value="Backlog">Backlog</option>
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Done">Done</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Color
                    </label>
                    <select
                      value={colorFilter}
                      onChange={(e) => setColorFilter(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                    >
                      <option value="">All Colors</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SortAscending size={20} weight="thin" className="text-gray-800 dark:text-gray-100" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              >
                <option value="default">Default</option>
                <option value="time">Time Added</option>
                <option value="color">Color</option>
              </select>
            </div>
          </div>

          <TodoList
            todos={filteredTodos} // Pass the filtered todos
            onRemove={removeTodo} // Pass the removeTodo function
            onSelect={(todo) => openTodoDetails(todo)} // Opens the edit drawer
            isCondensed={isCondensed} // Pass the isCondensed state
            setTodos={setTodos} // Pass setTodos as a prop
          />
        </div>
      </main>
    </div>
  );
};

export default Home;