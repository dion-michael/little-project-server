const User = require('../../models/users');
const UserPermission = require('../../models/relation_tables/user_permissions');
const UserMenu = require('../../models/relation_tables/user_menus');
const Permission = require('../../models/permissions');
const Role = require('../../models/roles');
const RolePermission = require('../../models/relation_tables/role_permissions');
const UserRoles = require('../../models/relation_tables/user_roles');
const { getRolePermissions } = require('../role/data_access');
const { ErrorHandler } = require('../../helpers/errorHandler');
const RoleDAO = require('../role/data_access');
const customLogger = require('../../helpers/customLogger');

class UserDAO {
    static async getUserProfile(id) {
        try {
            const user = await User.findById(id).select(
                '-password -is_active -created -_id',
            );
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async findOne(query) {
        try {
            const user = User.findOne(query).select();
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id, fields) {
        try {
            const user = await User.findById(id).select(fields);
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async find(query, fields) {
        try {
            const users = await User.find(query).select(fields);
            return users;
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            const newUser = await new User(userData).save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    static async getUserPermissions(id) {
        try {
            const userPermissions = await UserPermission.find({
                user_id: id,
            }).populate('permission_id', 'permission_name -_id');
            let response = {};
            userPermissions.forEach((data) => {
                response[data.permission_id.permission_name] = data.value;
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async addUserPermissions(user_id, permissions) {
        const permission_ids = await Permission.find({
            permission_name: {
                $in: permissions,
            },
        });
        const user = await UserDAO.findById(user_id);
        if (permission_ids && user) {
            const data = [];
            permission_ids.forEach((permit) => {
                data.push(
                    new UserPermission({
                        user_id,
                        permission_id: permit._id,
                        value: false,
                    }),
                );
            });
            const saved = await UserPermission.insertMany(data);
            return saved;
        } else {
            throw new ErrorHandler(404, 'user/permissions not found');
        }
    }

    static async getUserMenu(id) {
        try {
            const menus = await UserMenu.find({
                user_id: id,
            }).populate('menu_id', 'path component text icon');
            console.log(menus);
            const response = menus.map((menu) => ({
                path: menu.menu_id.path,
                component: menu.menu_id.component,
                text: menu.menu_id.text,
                icon: menu.menu_id.icon,
            }));
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async addUserRole(user_id, role_id) {
        try {
            const saved = await new UserRoles({
                user_id,
                role_id,
            }).save();
            return saved;
        } catch (error) {
            throw error;
        }
    }

    static async getComputedPermissions(user_id) {
        let roleName = '';
        let rolePermissions = {};
        let user_permissions = {};
        let computed_permissions = {};
        try {
            const userRole = await UserRoles.findOne({
                user_id,
            }).populate('role_id');
            if (userRole) {
                const { role_id: role } = userRole;
                roleName = role.role_name;
                const { role_permissions } = await getRolePermissions(
                    role.role_name,
                );
                rolePermissions = role_permissions;
            }
            user_permissions = await UserDAO.getUserPermissions(user_id);
            computed_permissions = {
                ...rolePermissions,
                ...user_permissions,
            };
            return {
                role: roleName,
                permissions: computed_permissions,
            };
        } catch (error) {
            throw error;
        }
    }

    static async removeUserPermissions(user_id, permission_names) {
        try {
            const permission_ids = await Permission.find({
                permission_name: {
                    $in: permission_names,
                },
            }).select('_id');
            const ids = permission_ids.map(
                (permission_id) => permission_id._id,
            );
            if (permission_ids) {
                const deleted = await UserPermission.deleteMany({
                    permission_id: {
                        $in: ids,
                    },
                });
                return deleted;
            }
        } catch (error) {
            throw error;
        }
    }

    static async updateUserPermissions(user_id, updateValue) {
        const permission_names = Object.keys(updateValue);
        try {
            const permission_ids = await Permission.find({
                permission_name: {
                    $in: permission_names,
                },
            });
            const updates = [];
            permission_ids.forEach((permission_id, index) => {
                updates.push(
                    UserPermission.findOneAndUpdate(
                        { user_id, permission_id },
                        { value: updateValue[permission_names[index]] },
                    ),
                );
            });
            const update = await Promise.all(updates);
            return update;
        } catch (error) {
            throw error;
        }
    }

    static async updateUserRole(user_id, role_id) {
        try {
            const userRole = await UserRoles.findOneAndUpdate(
                { user_id },
                { role_id },
            );
            const userole = await UserRoles.find({ user_id });
            return userRole;
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdateUserRole(user_id, role_name) {
        customLogger('updating / adding user role');
        try {
            const user = await User.findById(user_id);
            const role = await Role.findOne({ role_name });
            if (user && role) {
                customLogger('user and role valid');
                const userRole = await UserRoles.findOne({ user_id });
                if (userRole) {
                    customLogger('user already have role, update the role');
                    const updated = await UserDAO.updateUserRole(
                        user_id,
                        role.id,
                    );
                    console.log('user_id : ', typeof user_id);
                    console.log('user._id: ', typeof user.id);
                    console.log('role._id: ', typeof role.id);
                    console.log('role_id : ', typeof role.id);
                    customLogger('success update role');
                    return updated;
                } else {
                    customLogger('user does not have role yet, add a role');
                    const saved = await UserDAO.addUserRole(user_id, role._id);
                    console.log(saved);
                    customLogger('success adding role');
                    return saved;
                }
            } else {
                throw new ErrorHandler(404, 'user/role not found');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDAO;
