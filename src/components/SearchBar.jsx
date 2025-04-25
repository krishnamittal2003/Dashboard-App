import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'react-feather';

function SearchBar({ searchQuery, setSearchQuery }) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <div className="relative">
      <button
        className="p-2 text-gray-600 dark:text-white hover:text-blue-600"
        onClick={() => setExpanded(!expanded)}
      >
        <Search />
      </button>
      {expanded && (
        <input
          ref={inputRef}
          type="text"
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => !searchQuery && setExpanded(false)}
          className="absolute right-0 top-0 w-64 px-3 py-1 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
        />
      )}
    </div>
  );
}

export default SearchBar;
