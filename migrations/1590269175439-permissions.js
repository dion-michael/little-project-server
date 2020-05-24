/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_PATH);

const Permission = require('../models/permissions');
const values = require('./migration_values.json');

const data = values.permissions.map((permission) => ({
    permission_name: permission,
}));

async function up() {
    // Write migration here
    return Permission.insertMany(data);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const permissions = await Permission.find({
        permission_name: { $in: values.permissions },
    });
    const data = permissions.map((permission) => permission._id);
    return Permission.deleteMany({
        _id: { $in: data },
    });
}

module.exports = { up, down };
