import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <ul>
        <li><a href="#">Support</a></li>
        <li><a href="#">Community</a></li>
        <li><a href="#">Hosting</a></li>
        <li><a href="#">About</a></li>
      </ul>
      <div className="social-icons">
        {/* Example with Font Awesome icons */}
        <i className="fab fa-facebook"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-instagram"></i>
      </div>
      <p>© 2024 Airbnb, Inc. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
