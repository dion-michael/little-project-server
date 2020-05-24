const {
    createUser,
    getAll,
    getProfile,
    getUserMenu,
    addUserPermissions,
    addUserMenu,
    addUserRole,
    getComputedPermissions,
    removeUserPermissions,
    updateUserPermissions,
    updateUserRole,
} = require('../../controllers/user');
const router = require('express').Router();
const { Authorize, IsNotYourOwnData } = require('../../middlewares/auth');

router.get('/my/profile', getProfile); //get my profile
router.get('/my/menus', getUserMenu); //get my menus
router.get('/my/permissions', getComputedPermissions); //get my permissions

router.get('/all/profile', Authorize('manage_users'), getAll); // get all user profiles
router.get('/:user_id/profile', Authorize('manage_users'), getProfile); //get user profile
router.get('/:user_id/menus', Authorize('manage_users'), getUserMenu); //get user menus
router.get(
    '/:user_id/permissions',
    Authorize('manage_users'),
    getComputedPermissions,
); //get user permissions

router.post('/', Authorize('manage_users'), createUser); //create a new user
router.post('/:user_id/menus', Authorize('manage_users'), addUserMenu); //add user menu
router.post(
    '/:user_id/permissions',
    Authorize('manage_users'),
    addUserPermissions,
); //add user permission
router.post('/:user_id/role', Authorize('manage_users'), addUserRole); //add role permission

router.patch(
    '/:user_id/permissions',
    Authorize('manage_users'),
    IsNotYourOwnData,
    updateUserPermissions,
); // update user permission
router.patch(
    '/:user_id/role',
    Authorize('manage_users'),
    IsNotYourOwnData,
    updateUserRole,
); // update user role

router.delete(
    '/:user_id/permissions',
    Authorize('manage_users'),
    IsNotYourOwnData,
    removeUserPermissions,
); // delete user permission

module.exports = router;
