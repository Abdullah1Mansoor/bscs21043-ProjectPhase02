
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Categories from './components/Categories';
import ListingCard from './components/ListingCard';
import Footer from './components/Footer';
import ListingDetails from './pages/ListingDetails';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
  const [listings, setListings] = useState([]); // Store all listings
  const [isFetching, setIsFetching] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(''); // Default to no category
  const [searchLocation, setSearchLocation] = useState(''); // Store search query for location

  // Fetch listings from the backend hello
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
    setSearchLocation(query); // Set the search query to filter by location
  };

  return (
    <Router>
      <Navbar />
      <SearchBar onSearch={handleSearch} />

      {/* Pass setSelectedCategory to Categories */}
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
        <Route
          path="/listings/:id"
          element={<ListingDetails listings={listings} />}
        />

        {/* Booking Page Route */}
        <Route
          path="/book/:id"
          element={<BookingPage listings={listings} />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
