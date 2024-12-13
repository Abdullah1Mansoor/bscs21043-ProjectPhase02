import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
//import jwt_decode from 'jwt-decode'; // Correct import for jwt-decode
import './BookingPage.css';

const BookingPage = ({ listings }) => {
  const { id } = useParams();
  const listing = listings.find(listing => listing.id === parseInt(id));
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const calculatePrice = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates: Check if check-out is after check-in
    if (checkOut <= checkIn) {
      setErrorMessage('Check-out date must be after check-in date.');
      setTotalPrice(null);
      return;
    }

    // Calculate the number of nights
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (nights <= 0) {
      setErrorMessage('Please select valid check-in and check-out dates.');
      setTotalPrice(null);
      return;
    }

    const calculatedPrice = nights * listing.price;
    setTotalPrice(calculatedPrice);
    setErrorMessage('');
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    // If the token doesn't exist, show an error message
    if (!token) {
      setErrorMessage('You need to log in first.');
      return;
    }
  
    // Decode the token to check for expiry (using jwt-decode)
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Get the current time in seconds
      if (decoded.exp < currentTime) {
        setErrorMessage('Your session has expired. Please log in again.');
        return;
      }
    } catch (error) {
      setErrorMessage('Invalid token.');
      return;
    }
  
    // Proceed with the booking if the token is valid
    const bookingDetails = {
      listingId: listing.id,
      checkInDate,
      checkOutDate,
      totalPrice,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(bookingDetails),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Booking confirmed for ${listing.title}!\nTotal Price: $${totalPrice}`);
        navigate(`/`); // Redirect after booking
      } else {
        setErrorMessage(data.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error confirming booking. Please try again later.');
    }
  };

  return (
    <div className="booking-page">
      <h1>Book {listing.title}</h1>

      <form onSubmit={(e) => { e.preventDefault(); calculatePrice(); }}>
        <div>
          <label>
            Check-In Date:
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Check-Out Date:
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Calculate Price</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {totalPrice !== null && (
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <p><strong>Check-In Date:</strong> {checkInDate}</p>
          <p><strong>Check-Out Date:</strong> {checkOutDate}</p>
          <p><strong>Total Price:</strong> ${totalPrice}</p>
          <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
      )}
    </div>
  );
};

BookingPage.propTypes = {
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BookingPage;
