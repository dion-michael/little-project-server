const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
};

const compareHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    generateToken,
    compareHash,
};
