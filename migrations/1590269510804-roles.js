/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_PATH);

const Roles = require('../models/roles');

const values = require('./migration_values.json');

async function up() {
    // Write migration here
    return Roles.create(values.role);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const role = Roles.findOne(values.role);
    return Roles.findOneAndDelete(values.role);
}

module.exports = { up, down };
