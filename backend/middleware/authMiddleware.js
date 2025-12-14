const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    // Handle both "Bearer <token>" and raw token strings
    const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

module.exports = verifyToken;