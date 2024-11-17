
import { useState } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery); // Pass the search query to the parent component
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key press
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key press
        placeholder="Search by location (e.g., New York, Paris)"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
