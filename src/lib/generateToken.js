const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    const secretKey = 'your_secret_key'; // Replace with your actual secret key
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    return token;
};

module.exports = generateToken;