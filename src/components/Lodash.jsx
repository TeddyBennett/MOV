import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SearchWithFilter = () => {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // dropdown value
  const [results, setResults] = useState([]);

  const fetchData = async (query, category) => {
    const res = await fetch(`https://api.example.com/search?q=${query}&filter=${category}`);
    const data = await res.json();
    setResults(data.results);
  };
  
  // Debounced version — uses latest input + filter

  const debouncedFetch = useCallback(() =>  // useMemo(() => 
    debounce((query, category) => {
      fetchData(query, category);
    }, 500),
  []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedFetch(value, filter); // ✅ use both input and dropdown
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    debouncedFetch(input, value); // ✅ use both dropdown and current input
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search..."
      />

      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="books">Books</option>
        <option value="movies">Movies</option>
      </select>

      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchWithFilter;
