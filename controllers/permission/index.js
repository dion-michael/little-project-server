const Permission = require('../../models/permissions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../../helpers/errorHandler');

class PermissionController {
    static async getAll(req, res, next) {
        try {
            const permissions = await Permission.find();
            res.json(permissions);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const saved = await new Permission({
                permission_name: req.body.permission_name,
            }).save();
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async deletePermissions(req, res, next) {
        try {
            const { permissions: permission_names } = req.body;
            const permissions = await Permission.find({
                permission_name: {
                    $in: permission_names,
                },
            });
            if (permissions) {
                const data = permissions.map((permission) => permission._id);
                const deleted = await Permission.deleteMany({
                    _id: {
                        $in: data,
                    },
                });
                res.json(deleted);
            } else {
                throw new ErrorHandler(404, 'permissions not found');
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PermissionController;
