/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');
const { DB_PATH, DB_NAME } = process.env;

mongoose.connect(`mongodb://${DB_PATH}/${DB_NAME}`);

const Menu = require('../models/menus');

const { menus } = require('./migration_values.json');

async function up() {
    // Write migration here
    return Menu.insertMany(menus);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
    const menuPaths = menus.map((menu) => menu.path);
    return Menu.deleteMany({
        path: { $in: menuPaths },
    });
}

module.exports = { up, down };
