// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminDashboard.css';

// const AdminDashboard = () => {
//   const [listings, setListings] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [newListing, setNewListing] = useState({ title: '', description: '', pricePerNight: '' });
//   const [error, setError] = useState('');

//   const fetchListings = async (page = 1) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/admin/listings?page=${page}`);
//       setListings(response.data.data || []);
//       setTotalPages(response.data.totalPages || 1);
//       setCurrentPage(response.data.currentPage || 1);
//     } catch (err) {
//       console.error('Error fetching listings:', err);
//       setError('Failed to fetch listings');
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/bookings');
//       setBookings(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setError('Failed to fetch bookings');
//     }
//   };

//   const handleAddListing = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/admin/listings', newListing);
//       setNewListing({ title: '', description: '', pricePerNight: '' });
//       fetchListings();
//     } catch (err) {
//       console.error('Error adding listing:', err);
//       setError('Failed to add listing');
//     }
//   };

//   const handleDeleteListing = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/listings/${id}`);
//       fetchListings();
//     } catch (err) {
//       console.error('Error deleting listing:', err);
//       setError('Failed to delete listing');
//     }
//   };

//   const handleUpdateListing = async (id, updatedData) => {
//     try {
//       await axios.put(`http://localhost:5000/api/admin/listings/${id}`, updatedData);
//       fetchListings();
//     } catch (err) {
//       console.error('Error updating listing:', err);
//       setError('Failed to update listing');
//     }
//   };

//   const handleUpdateBooking = async (id, status) => {
//     try {
//       await axios.put(`http://localhost:5000/api/admin/bookings/${id}`, { status });
//       fetchBookings();
//     } catch (err) {
//       console.error('Error updating booking:', err);
//       setError('Failed to update booking');
//     }
//   };

//   useEffect(() => {
//     fetchListings();
//     fetchBookings();
//   }, []);

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <section>
//         <h2>Listings</h2>
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             value={newListing.title}
//             onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Description"
//             value={newListing.description}
//             onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Price Per Night"
//             value={newListing.pricePerNight}
//             onChange={(e) => setNewListing({ ...newListing, pricePerNight: e.target.value })}
//           />
//           <button onClick={handleAddListing}>Add Listing</button>
//         </div>

//         <ul>
//           {Array.isArray(listings) && listings.map((listing) => (
//             <li key={listing.id}>
//               <strong>{listing.title}</strong> - {listing.description} (${listing.pricePerNight})
//               <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
//               <button
//                 onClick={() =>
//                   handleUpdateListing(listing.id, { ...listing, pricePerNight: listing.pricePerNight + 10 })
//                 }
//               >
//                 Increase Price by $10
//               </button>
//             </li>
//           ))}
//         </ul>

//         <div>
//           <button disabled={currentPage === 1} onClick={() => fetchListings(currentPage - 1)}>
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button disabled={currentPage === totalPages} onClick={() => fetchListings(currentPage + 1)}>
//             Next
//           </button>
//         </div>
//       </section>

//       <section>
//         <h2>Bookings</h2>
//         <ul>
//           {Array.isArray(bookings) && bookings.map((booking) => (
//             <li key={booking.id}>
//               Booking #{booking.id} for {booking.Listing.title} - Status: {booking.status}
//               <button onClick={() => handleUpdateBooking(booking.id, 'Completed')}>Mark as Completed</button>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;


// new test code
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newListing, setNewListing] = useState({ title: '', description: '', pricePerNight: '' });
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/admin'; // Hardcoded API URL

  useEffect(() => {
    fetchListings();
    fetchBookings();
  }, []);

  const fetchListings = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/listings?page=${page}`);
      setListings(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch listings');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    }
  };

  const handleAddListing = async () => {
    if (!newListing.title || !newListing.description || !newListing.pricePerNight) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post(`${API_URL}/listings`, newListing);
      setNewListing({ title: '', description: '', pricePerNight: '' });
      fetchListings();
    } catch (err) {
      setError('Failed to add listing');
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await axios.delete(`${API_URL}/listings/${id}`);
      fetchListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleUpdateListing = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/listings/${id}`, updatedData);
      fetchListings();
    } catch (err) {
      setError('Failed to update listing');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {/* Render Listings and Bookings here */}
    </div>
  );
};

export default AdminDashboard;
