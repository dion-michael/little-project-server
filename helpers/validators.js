const User = require('../models/users');

const uniqueUsername = async function () {
    let isUsed = await User.findOne({
        username: this.username,
        _id: {
            $ne: this._id,
        },
    });
    if (isUsed) {
        return false;
    } else {
        return true;
    }
};

function isValidEmail(email) {
    return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
    );
}

module.exports = {
    uniqueUsername,
    isValidEmail,
};
