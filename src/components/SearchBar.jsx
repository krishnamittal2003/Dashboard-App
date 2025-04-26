import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'react-feather';

function SearchBar({ searchTerm, setSearchTerm }) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef();

  // Close search when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <Search size={20} />
      </button>

      {/* Smoothly show input when expanded */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'w-60' : 'w-0'}`}>
        {expanded && (
          <input
            type="text"
            placeholder="Search Widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white bg-white text-black shadow"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}

export default SearchBar;