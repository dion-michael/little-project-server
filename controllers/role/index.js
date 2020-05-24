const Role = require('../../models/roles');
const RolePermission = require('../../models/relation_tables/role_permissions');
const { ErrorHandler } = require('../../helpers/errorHandler');
const Permission = require('../../models/permissions');
const RoleDAO = require('./data_access');

class RoleController {
    static async getAll(req, res, next) {
        try {
            const roles = await RoleDAO.find();
            res.json(roles);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const saved = await RoleDAO.create(req);
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async addRolePermission(req, res, next) {
        try {
            const saved = await RoleDAO.addRolePermisson(req);
            res.status(200).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async getRolePermissions(req, res, next) {
        try {
            const rolePermissions = await RoleDAO.getRolePermissions(
                req.params.role_name,
            );
            res.json(rolePermissions);
        } catch (error) {
            next(error);
        }
    }

    static async removeRole(req, res, next) {
        try {
            const deleted = await RoleDAO.removeRole(req);
            res.json(deleted);
        } catch (error) {
            next(error);
        }
    }

    static async removeRolePermission(req, res, next) {
        try {
            const deleted = await RoleDAO.removeRolePermission(req);
            res.json(deleted);
        } catch (error) {
            next(error);
        }
    }

    static async updateRolePermissions(req, res, next) {
        const { permissions } = req.body;
        const { role_name } = req.params;
        try {
            const saved = await RoleDAO.updateRolePermissions(
                role_name,
                permissions,
            );
            res.status(200).json(saved);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RoleController;
