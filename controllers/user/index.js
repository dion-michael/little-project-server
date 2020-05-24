const { ErrorHandler } = require('../../helpers/errorHandler');
const UserMenu = require('../../models/relation_tables/user_menus');
const UserDAO = require('./data_access');
const generateUserData = require('../../helpers/generateUserData');
const { generateToken, compareHash } = require('../../helpers/generateToken');
const customLogger = require('../../helpers/customLogger');

class Controller {
    static async getAll(req, res, next) {
        const { query } = req;
        try {
            const data = await UserDAO.find(query, '-password');
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req, res, next) {
        const userData = generateUserData(req.body);
        try {
            const savedData = await UserDAO.create(userData);
            res.status(201).json({
                success: true,
                data: savedData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const user = await UserDAO.findOne(
                {
                    username: req.body.username,
                },
                'password',
            );
            if (user) {
                const isValid = compareHash(req.body.password, user.password);
                if (isValid) {
                    let token = generateToken({
                        id: user._id,
                    });
                    res.json({
                        status: 'success',
                        token,
                    });
                } else {
                    throw new ErrorHandler(400, 'wrong username/password');
                }
            } else {
                throw new ErrorHandler(400, 'wrong username/password');
            }
        } catch (err) {
            next(err);
        }
    }

    static async getProfile(req, res, next) {
        try {
            const id = req.params.user_id
                ? req.params.user_id
                : req.loggedUser.id;
            const user = await UserDAO.getUserProfile(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    static async getUserMenu(req, res, next) {
        const id = req.params.user_id ? req.params.user_id : req.loggedUser.id;
        try {
            const menus = await UserDAO.getUserMenu(id);
            res.json(menus);
        } catch (error) {
            next(error);
        }
    }

    static async addUserMenu(req, res, next) {
        try {
            const newMenu = new UserMenu({
                user_id: req.params.user_id,
                menu_id: req.body.menu_id,
            });
            const saved = await newMenu.save();
            res.json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async getUserPermissions(req, res, next) {
        try {
            const permissions = await UserDAO.getUserPermissions(
                req.loggedUser.id,
            );
            res.json(permissions);
        } catch (error) {
            next(error);
        }
    }

    static async addUserPermissions(req, res, next) {
        const { permissions } = req.body;
        const { user_id } = req.params;
        try {
            const newPermission = await UserDAO.addUserPermissions(
                user_id,
                permissions,
            );
            res.json(newPermission);
        } catch (error) {
            next(error);
        }
    }

    static async addUserRole(req, res, next) {
        const { role_name } = req.body;
        const { user_id } = req.params;
        try {
            const userRole = await UserDAO.addOrUpdateUserRole(
                user_id,
                role_name,
            );
            res.json(userRole);
        } catch (error) {
            next(error);
        }
    }

    static async getComputedPermissions(req, res, next) {
        try {
            const user_id = req.params.user_id
                ? req.params.user_id
                : req.loggedUser.id;
            const userRole = await UserDAO.getComputedPermissions(user_id);
            res.json(userRole);
        } catch (error) {
            next(error);
        }
    }

    static async removeUserPermissions(req, res, next) {
        try {
            const { user_id } = req.params;
            const { permissions } = req.body;
            const deleted = await UserDAO.removeUserPermissions(
                user_id,
                permissions,
            );
            res.json(deleted);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserPermissions(req, res, next) {
        try {
            const { user_id } = req.params;
            const { permissions } = req.body;
            const updated = await UserDAO.updateUserPermissions(
                user_id,
                permissions,
            );
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserRole(req, res, next) {
        try {
            const { user_id } = req.params;
            const { role_name } = req.body;
            const updated = await UserDAO.addOrUpdateUserRole(
                user_id,
                role_name,
            );
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
