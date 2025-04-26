import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Category from './components/Category';
import AddWidgetModal from './components/AddWidgetModal';
import { useSelector } from 'react-redux';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const { categories } = useSelector((state) => state.dashboard);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <div className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white dark:bg-gray-800 z-50">
          <h1 className="text-2xl font-bold">Dynamic Dashboard</h1>

          <div className="flex items-center gap-3">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ThemeToggle />
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Widget
            </button>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(categories).map((category) => (
            <Category
              key={category}
              name={category}
              widgets={categories[category]}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      </div>

      {showModal && <AddWidgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;