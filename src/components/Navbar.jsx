
import './Navbar.css';
// this is my navbar component
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Airbnb</div>
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Experiences</a></li>
        <li><a href="#">Online Experiences</a></li>
      </ul>
      <div className="user-menu">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
