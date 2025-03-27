const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Add user info to request
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            twitterToken: decoded.twitterToken,
            twitterRefreshToken: decoded.twitterRefreshToken,
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { protect }; 