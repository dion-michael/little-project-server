const mongoose = require('mongoose');
const { ErrorHandler } = require('../../helpers/errorHandler');
const Schema = mongoose.Schema;

const UserPermissionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    permission_id: {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
        validate: {
            validator: async function () {
                let isAssigned = await UserPermission.findOne({
                    user_id: this.user_id,
                    permission_id: this.permission_id,
                });
                if (isAssigned) {
                    throw new ErrorHandler(
                        400,
                        'user already has access to do this permission',
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

UserPermissionSchema.virtual('permission', {
    ref: 'Permission',
    localField: 'permission_id',
    foreignField: '_id',
    justOne: true,
});

UserPermissionSchema.set('toJSON', { virtuals: true });

const UserPermission = mongoose.model('UserPermission', UserPermissionSchema);

module.exports = UserPermission;
