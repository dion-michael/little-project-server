/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_PATH);

const User = require('../models/users');
const Role = require('../models/roles');
const UserRole = require('../models/relation_tables/user_roles');
const values = require('./migration_values.json');

async function up() {
    // Write migration here
    const user = await User.findOne({ username: values.user.username });
    const role = await Role.findOne({ role_name: values.role.role_name });
    return UserRole.create({ user_id: user._id, role_id: role._id });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const user = await User.findOne({ username: values.user.username });
    return UserRole.deleteMany({ user_id: user._id });
}

module.exports = { up, down };
