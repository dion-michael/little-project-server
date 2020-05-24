const Role = require('../../models/roles');
const RolePermission = require('../../models/relation_tables/role_permissions');
const { ErrorHandler } = require('../../helpers/errorHandler');
const Permission = require('../../models/permissions');

class RoleDAO {
    static async find(query, fields) {
        try {
            const role = await Role.find(query).select(fields);
            return role;
        } catch (error) {
            throw error;
        }
    }

    static async findOne(query, fields) {
        try {
            const role = await Role.findOne(query).select(fields);
            return role;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id, fields) {
        try {
            const role = await Role.findById(id).select(fields);
            return role;
        } catch (error) {
            throw error;
        }
    }

    static async create(req) {
        try {
            const saved = await new Role({
                role_name: req.body.role_name,
            }).save();
            return saved;
        } catch (error) {
            throw error;
        }
    }

    static async addRolePermisson(req) {
        try {
            const { _id: role_id } = await Role.findOne({
                role_name: req.params.role_name,
            }).select('id');
            const permissions = await Permission.find({
                permission_name: {
                    $in: req.body.permissions,
                },
            });
            if (role_id && permissions.length) {
                const data = [];
                permissions.forEach((permission) => {
                    data.push(
                        new RolePermission({
                            role_id,
                            permission_id: permission._id,
                            value: false,
                        }),
                    );
                });
                const saved = await RolePermission.insertMany(data);
                return saved;
            } else {
                throw new ErrorHandler(404, `role/permissions not found`);
            }
        } catch (error) {
            throw error;
        }
    }

    static async getRolePermissions(role_name) {
        try {
            const role = await Role.findOne({
                role_name,
            }).select('id');
            if (role) {
                const role_id = role._id;
                const permissions = await RolePermission.find({
                    role_id,
                }).populate('permission_id');
                if (permissions) {
                    let response = {};
                    permissions.forEach((data) => {
                        response[data.permission_id.permission_name] =
                            data.value;
                    });
                    return {
                        role_id,
                        role_name,
                        role_permissions: response,
                    };
                } else {
                    throw new ErrorHandler(404, 'permission not found');
                }
            } else {
                throw new ErrorHandler(404, 'role not found');
            }
        } catch (error) {
            throw error;
        }
    }

    static async removeRolePermission(req) {
        try {
            const role = await Role.findOne({
                role_name: req.params.role_name,
            }).select('id');
            const permission = await Permission.findOne({
                permission_name: req.body.permission_name,
            }).select('id');
            if (role && permission) {
                const role_id = role.id;
                const permission_id = permission.id;
                await RolePermission.findOneAndDelete({
                    role_id,
                    permission_id,
                });
                return {
                    success: true,
                    message: `successfully delete ${req.body.permission_name} from role ${req.params.role_name}`,
                };
            } else {
                throw new ErrorHandler(404, 'role/permission not found');
            }
        } catch (error) {
            throw error;
        }
    }

    static async removeRole(req) {
        try {
            const { role_name } = req.body;
            const deleted = await Role.findOneAndDelete({ role_name });
            if (deleted) {
                return {
                    success: true,
                    message: `successfully deleted role ${role_name}`,
                };
            } else {
                throw new ErrorHandler(404, 'role does not exist');
            }
        } catch (error) {
            throw error;
        }
    }

    static async updateRolePermissions(role_name, updateValue) {
        const permission_names = Object.keys(updateValue);
        try {
            const permission_ids = await Permission.find({
                permission_name: {
                    $in: permission_names,
                },
            });
            const role = await Role.findOne({ role_name }).select('_id');
            if (role) {
                const role_id = role._id;
                const updates = [];
                permission_ids.forEach((permission_id, index) => {
                    updates.push(
                        RolePermission.findOneAndUpdate(
                            { role_id, permission_id },
                            { value: updateValue[permission_names[index]] },
                        ),
                    );
                });
                const update = await Promise.all(updates);
                return update;
            } else {
                throw new ErrorHandler(404, 'role not found');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleDAO;
