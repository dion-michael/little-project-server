const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await User.findOne({
                    username: this.username,
                    _id: {
                        $ne: this._id,
                    },
                });
                if (isUsed) {
                    return false;
                } else {
                    return true;
                }
            },
            message: (data) => `${data.value} is already in use`,
        },
    },
    displayName: String,
    position: {
        title: String,
        branch: String,
    },
    password: String,
    email: String,
    access: {
        claim: {
            create: Boolean,
            read: Boolean,
            update: Boolean,
        },
        bpu: {
            create: Boolean,
            read: Boolean,
            update: Boolean,
        },
        mppa_pk: {
            create: Boolean,
            read: Boolean,
            update: Boolean,
        },
    },
});

UserSchema.pre('save', async function (next) {
    console.log('masuk');
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
