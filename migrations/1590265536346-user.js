const mongoose = require('mongoose');
const values = require('./migration_values.json');

mongoose.connect(process.env.DB_PATH);

const User = require('../models/users');

const up = async () => {
    return User.create({
        ...values.user,
        created: new Date(),
    });
};

async function down() {
    return User.findOneAndDelete({
        username: 'admin',
    });
}

module.exports = { up, down };
