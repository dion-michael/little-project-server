const mongoose = require('mongoose');
const { ErrorHandler } = require('../../helpers/errorHandler');
const Schema = mongoose.Schema;

const UserRolesSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
});

UserRolesSchema.virtual('role', {
    ref: 'Roles',
    localField: 'role_id',
    foreignField: '_id',
    justOne: true,
});

UserRolesSchema.set('toJSON', { virtuals: true });

const UserRoles = mongoose.model('UserRoles', UserRolesSchema);

module.exports = UserRoles;
