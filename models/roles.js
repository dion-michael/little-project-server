const mongoose = require('mongoose');
const RolePermission = require('./relation_tables/role_permissions');
const { ErrorHandler } = require('../helpers/errorHandler');
const UserPermission = require('./relation_tables/user_permissions');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    role_name: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await Role.findOne({
                    role_name: this.role_name,
                });
                if (isUsed) {
                    return false;
                } else {
                    return true;
                }
            },
            message: (data) => `duplicate role ${data.value}`,
        },
    },
});

RoleSchema.post('findOneAndDelete', async function (value) {
    try {
        await RolePermission.deleteMany({ role_id: value._id });
        await UserPermission.deleteMany({ role_id: value._id });
    } catch (error) {
        throw new ErrorHandler(
            500,
            `unable to delete ${value.role_name}'s permissions`,
        );
    }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
