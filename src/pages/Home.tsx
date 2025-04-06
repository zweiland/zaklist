import React, { useState, useEffect } from 'react';
import { Sun, Moon, SidebarSimple, House, Microphone } from 'phosphor-react';
import TodoList, { Todo } from '../components/TodoList';

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
      setIsShaking(true); // Trigger shake animation for empty input
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      description: '',
      completed: false, // Default to not completed
      color: '', // Default color
    };

    // Add the new todo to the top of the list
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Save to localStorage
    setInputValue(''); // Clear the input field
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

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-gray-200 dark:bg-gray-800 transition-all duration-300 flex flex-col p-4`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between w-full mb-6">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-all duration-300">
              ZakList
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            aria-label="Toggle Sidebar"
          >
            <SidebarSimple size={24} weight="light" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => console.log('Home clicked')}
            className={`flex items-center p-2 rounded-lg ${
              sidebarOpen
                ? 'text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
                : 'text-gray-800 dark:text-gray-100'
            } hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500`}
          >
            <House size={24} weight="light" />
            {sidebarOpen && <span className="ml-2 text-sm font-medium">Home</span>}
          </button>
        </nav>

        <div className="flex-1"></div> {/* Empty space to push future items to the bottom */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 rounded-lg p-4 text-lg text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                isShaking ? 'animate-shake' : ''
              }`}
              placeholder="Add a new todo"
            />
            <button
              onClick={addTodo}
              className="ml-4 px-6 py-4 text-lg font-semibold text-white bg-blue-500 dark:bg-blue-700 rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-offset-2"
            >
              Add
            </button>
            <button
              onClick={startListening}
              className={`ml-2 p-2 rounded-full text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600`}
              aria-label="Start Voice Input"
            >
              <Microphone size={24} weight="thin" />
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

          {/* Sorting Dropdown */}
          <div className="flex justify-end mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <option value="time">Sort by Time Added</option>
              <option value="color">Sort by Color</option>
            </select>
          </div>

          <TodoList
            todos={sortedTodos} // Pass the sorted todos
            onRemove={removeTodo} // Pass the removeTodo function
            onSelect={(todo) => openTodoDetails(todo)} // Opens the edit drawer
            isCondensed={isCondensed} // Pass the isCondensed state
          />
        </div>
      </div>

      {/* Light/Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
      >
        {darkMode ? <Sun size={24} weight="light" /> : <Moon size={24} weight="light" />}
      </button>

      {/* Right Drawer */}
      {selectedTodo && (
        <>
          <div
            onClick={closeTodoDetails}
            className="fixed inset-0 z-40"
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-gray-100 dark:bg-gray-800 shadow-lg p-4 z-50 transition-transform duration-300 ease-in-out transform ${
              selectedTodo ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <button
                onClick={closeTodoDetails}
                className="p-2 rounded-full text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                aria-label="Close Drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1} // Thinner stroke for a minimalistic look
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <input
                type="text"
                value={selectedTodo.text}
                onChange={(e) => updateTodoName(selectedTodo.id, e.target.value)}
                className="ml-4 w-full text-lg font-bold text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                placeholder="Edit todo name..."
              />
            </div>
            <textarea
              value={selectedTodo?.description || ''}
              onChange={(e) => updateTodoDescription(selectedTodo!.id, e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              placeholder="Add a description..."
            />
            {/* Color Picker */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                Select Color
              </label>
              <div className="flex space-x-2">
                {['red', 'green', 'blue', 'yellow', 'purple', 'gray'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateTodoColor(selectedTodo.id, color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedTodo.color === color
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;