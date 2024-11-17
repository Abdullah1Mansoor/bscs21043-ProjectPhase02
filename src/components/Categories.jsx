
import { useState } from 'react';
import PropTypes from 'prop-types';
import './Categories.css';

const Categories = ({ setSelectedCategory }) => {
  const categories = ['Beachfront', 'Cabins', 'Trending', 'Luxury', 'Unique Stays'];
  const [activeCategory, setActiveCategory] = useState('');

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCategory(category); // Update selected category in the parent component
  };

  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${category === activeCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
Categories.propTypes = {
  setSelectedCategory: PropTypes.func.isRequired,
};

export default Categories;

