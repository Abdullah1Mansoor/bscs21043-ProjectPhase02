import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ListingDetails.css';

const ListingDetails = ({ listings }) => {
  const { id } = useParams(); // Get the listing ID from the URL
  const listing = listings.find(listing => listing.id === parseInt(id)); // Find the listing by ID

  // If the listing is not found, show a 'not found' message
  if (!listing) {
    return (
      <div className="listing-not-found">
        <h2>Listing not found</h2>
        <p>Sorry, the listing you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="back-to-home">Go back to home</Link>
      </div>
    );
  }

  return (
    <div className="listing-details">
      <img src={listing.image} alt={listing.title} className="listing-image" />
      <div className="details-content">
        <h1>{listing.title}</h1>
        <p><strong>Type:</strong> {listing.type}</p>
        <p><strong>Guests:</strong> {listing.guests}</p>
        <p><strong>Bedrooms:</strong> {listing.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {listing.bathrooms}</p>
        <p><strong>Price:</strong> ${listing.price} per night</p>
        <p><strong>Description:</strong> {listing.description}</p> {/* Adding description */}

        <div className="booking-button">
          <Link to={`/book/${listing.id}`} className="book-now-button">Book Now</Link>
        </div>
      </div>
    </div>
  );
};

ListingDetails.propTypes = {
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      guests: PropTypes.number.isRequired,
      bedrooms: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired, // Adding description in PropTypes
    })
  ).isRequired,
};

export default ListingDetails;
