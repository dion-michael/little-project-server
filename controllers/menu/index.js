const Menu = require('../../models/menus');

class MenuController {
    static async getMenus(req, res) {
        try {
            const menus = await Menu.find();
            res.status(200).json(menus);
        } catch (error) {
            next(error);
        }
    }
    static async createMenu(req, res, next) {
        const newMenu = new Menu({
            text: req.body.text,
            path: req.body.path,
            icon: req.body.icon,
            component: req.body.component,
        });
        try {
            const saved = await newMenu.save();
            res.status(200).json(saved);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MenuController;
