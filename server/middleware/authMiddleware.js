// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // Check if the token is present in the Authorization header
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Access denied, no token provided' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract the token

//   try {
//     // Verify the token using the secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user information to the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     // Token verification failed, invalid or expired token
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is present in the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Token verification failed, invalid or expired token
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware for admin-only access
module.exports.isAdmin = (req, res, next) => {
  const user = req.user;

  // Ensure the user role is admin
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }

  // User is an admin, proceed to the next middleware or route handler
  next();
};
