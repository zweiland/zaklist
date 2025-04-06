import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">Welcome to ZakList</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Organize your tasks and track your progress with ease.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')} // Updated to direct to /login
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
        >
          Log In {/* Changed from "Sign In" to "Log In" */}
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;