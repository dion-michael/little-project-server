/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_PATH);

const User = require('../models/users');
const Menu = require('../models/menus');
const UserMenu = require('../models/relation_tables/user_menus');
const values = require('./migration_values.json');

async function up() {
    // Write migration here
    const user = await User.findOne({ username: values.user.username });
    const menus = await Menu.find();
    const userMenu = menus.map((menu) => ({
        user_id: user._id,
        menu_id: menu._id,
    }));
    return UserMenu.insertMany(userMenu);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const user = await User.findOne({ username: values.user.username });
    return UserMenu.deleteMany({ user_id: user._id });
}

module.exports = { up, down };
