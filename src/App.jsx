import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Categories from './components/Categories';
import ListingCard from './components/ListingCard';
import Footer from './components/Footer';
import ListingDetails from './pages/ListingDetails';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [listings, setListings] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [userToken, setUserToken] = useState(localStorage.getItem('token')); // Manage user authentication token

  // Fetch listings from the backend
  useEffect(() => {
    const fetchListings = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:5000/api/listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
      setIsFetching(false);
    };

    fetchListings();
  }, []);

  // Filter listings by category and location
  const filteredListings = listings.filter((listing) =>
    (selectedCategory ? listing.category.toLowerCase() === selectedCategory.toLowerCase() : true) &&
    (searchLocation ? listing.location.toLowerCase().includes(searchLocation.toLowerCase()) : true)
  );

  // Handle search query for location
  const handleSearch = (query) => {
    setSearchLocation(query);
  };

  // Handle token for login/signup
  const handleUserToken = (token) => {
    setUserToken(token);
    localStorage.setItem('token', token);
  };

  return (
    <Router>
      <Navbar />
      <SearchBar onSearch={handleSearch} />

      <Categories setSelectedCategory={setSelectedCategory} />

      <Routes>
        {/* Homepage Route */}
        <Route
          path="/"
          element={
            <div className="listings-container">
              {isFetching ? (
                <p>Loading listings...</p>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))
              ) : (
                <p>No listings found.</p>
              )}
            </div>
          }
        />

        {/* Listing Details Route */}
        <Route path="/listings/:id" element={<ListingDetails listings={listings} />} />

        {/* Booking Page Route */}
        <Route path="/book/:id" element={<BookingPage listings={listings} />} />

        {/* Login Route */}
        <Route path="/login" element={<LoginPage onLogin={handleUserToken} />} />

        {/* Signup Route */}
        <Route path="/signup" element={<SignupPage onSignup={handleUserToken} />} />
        {/* new code */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
