const mongoose = require('mongoose');
const values = require('./migration_values.json');
const { DB_PATH, DB_NAME } = process.env;

mongoose.connect(`mongodb://${DB_PATH}/${DB_NAME}`);

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
