const mongoose = require('mongoose');
const { ErrorHandler } = require('../../helpers/errorHandler');
const { boolean } = require('@hapi/joi');
const Schema = mongoose.Schema;

const RolePermissionSchema = new Schema({
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    permission_id: {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
        validate: {
            validator: async function () {
                let role = await RolePermission.findOne({
                    role_id: this.role_id,
                    permission_id: this.permission_id,
                })
                    .populate('role_id')
                    .populate('permission_id');
                if (role) {
                    throw new ErrorHandler(
                        400,
                        `role ${role.role_id.role_name} already have permission ${role.permission_id.permission_name}`,
                    );
                } else {
                    return true;
                }
            },
        },
    },
    value: {
        type: Boolean,
        required: true,
    },
});

RolePermissionSchema.virtual('permission', {
    ref: 'Permission',
    localField: 'permission_id',
    foreignField: '_id',
    justOne: true,
});

RolePermissionSchema.set('toJSON', { virtuals: true });

const RolePermission = mongoose.model('RolePermission', RolePermissionSchema);

module.exports = RolePermission;
