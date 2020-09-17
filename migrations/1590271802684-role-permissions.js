/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');
const { DB_PATH, DB_NAME } = process.env;

mongoose.connect(`mongodb://${DB_PATH}/${DB_NAME}`);

const Role = require('../models/roles');
const Permissions = require('../models/permissions');
const RolePermissions = require('../models/relation_tables/role_permissions');
const values = require('./migration_values.json');

async function up() {
    // Write migration here
    const role = await Role.findOne({ role_name: values.role.role_name });
    const permissions = await Permissions.find();
    const rolePermissions = permissions.map((permission) => ({
        role_id: role._id,
        permission_id: permission._id,
        value: true,
    }));
    return RolePermissions.insertMany(rolePermissions);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const role = await Role.findOne({ role_name: values.role.role_name });
    return RolePermissions.deleteMany({ role_id: role._id });
}

module.exports = { up, down };
