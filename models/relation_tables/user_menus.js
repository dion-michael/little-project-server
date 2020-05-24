const mongoose = require('mongoose');
const { ErrorHandler } = require('../../helpers/errorHandler');
const User = require('../users');
const Menu = require('../menus');
const Schema = mongoose.Schema;

const UserMenuSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function () {
                let user = await User.findById(this.user_id);
                if (user) {
                    return true;
                } else {
                    throw new ErrorHandler(404, 'not found');
                }
            },
        },
    },
    menu_id: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
        validate: {
            validator: async function () {
                let menu = await Menu.findById(this.menu_id);
                if (menu) {
                    let isAssigned = await UserMenu.findOne({
                        menu_id: this.menu_id,
                        user_id: this.user_id,
                    });
                    if (isAssigned) {
                        throw new ErrorHandler(
                            400,
                            'user already has access to this menu',
                        );
                    } else {
                        return true;
                    }
                } else {
                    throw new ErrorHandler(404, 'not found');
                }
            },
        },
    },
});

const UserMenu = mongoose.model('UserMenu', UserMenuSchema);

module.exports = UserMenu;
