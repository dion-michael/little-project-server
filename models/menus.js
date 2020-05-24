const mongoose = require('mongoose');
const { string } = require('@hapi/joi');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    text: String,
    path: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await Menu.findOne({
                    path: this.path,
                });
                if (isUsed) {
                    return false;
                } else {
                    return true;
                }
            },
            message: (data) => `duplicate path ${data.value}`,
        },
    },
    icon: String,
    component: String,
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
