import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { House, ChartPie, List, Sun, Moon } from 'phosphor-react';

interface SidebarProps {
  activePage: 'home' | 'insights'; // Define the active page for styling
  isOpen: boolean; // State to control whether the sidebar is open
  toggleSidebar: () => void; // Function to toggle the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-200 dark:bg-gray-800 p-4 transition-all duration-300`}
    >
      {/* Header with App Name, Menu Toggle, and Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className={`text-xl font-bold text-gray-800 dark:text-gray-100 transition-all duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ZakList
        </h1>
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={24} weight="light" /> : <Moon size={24} weight="light" />}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            aria-label="Toggle Sidebar"
          >
            <List size={24} weight="light" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        {/* Home Navigation */}
        <button
          onClick={() => navigate('/home')} // Redirect to /home
          className={`flex items-center p-2 rounded-lg ${
            activePage === 'home'
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              : 'text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500`}
        >
          <House size={24} weight="light" />
          {isOpen && <span className="ml-2 text-sm font-medium">Home</span>}
        </button>

        {/* Insights Navigation */}
        <button
          onClick={() => navigate('/insights')}
          className={`flex items-center p-2 rounded-lg ${
            activePage === 'insights'
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              : 'text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500`}
        >
          <ChartPie size={24} weight="light" />
          {isOpen && <span className="ml-2 text-sm font-medium">Insights</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;