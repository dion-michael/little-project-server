const mongoose = require('mongoose');
const UserPermission = require('./relation_tables/user_permissions');
const RolePermission = require('./relation_tables/role_permissions');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    permission_name: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await Permission.findOne({
                    permission_name: this.permission_name,
                });
                if (isUsed) {
                    return false;
                } else {
                    return true;
                }
            },
            message: (data) => `duplicate permission ${data.value}`,
        },
    },
});

PermissionSchema.pre('deleteMany', async function (next) {
    const queries = this._conditions._id['$in'];
    try {
        await UserPermission.deleteMany({ permission_id: { $in: queries } });
        await RolePermission.deleteMany({ permission_id: { $in: queries } });
    } catch (error) {
        next(error);
    }
    next();
});

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;
