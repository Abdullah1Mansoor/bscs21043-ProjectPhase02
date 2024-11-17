
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ListingCard.css';

const ListingCard = ({ 
  id, 
  image, 
  title, 
  type, 
  guests, 
  bedrooms, 
  bathrooms, 
  price, 
  category, 
  location 
}) => {
  return (
    <div className="listing-card">
      <img src={image} alt={title} className="listing-image" />
      <div className="listing-info">
        <h2 className="listing-title">{title}</h2>
        <p className="listing-type">Type: {type}</p>
        <p className="listing-category">Category: {category}</p>
        <p className="listing-location">Location: {location}</p> {/* Display location */}
        <p className="listing-details">
          {guests} guests | {bedrooms} bedrooms | {bathrooms} bathrooms
        </p>
        <p className="listing-price">${price} per night</p>
        {/* Link to the Listing Details page */}
        <Link to={`/listings/${id}`} className="details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

// PropTypes validation
ListingCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  guests: PropTypes.number.isRequired,
  bedrooms: PropTypes.number.isRequired,
  bathrooms: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired, // Add location as a required prop
};

export default ListingCard;
