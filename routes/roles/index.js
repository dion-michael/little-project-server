const router = require('express').Router();
const { Authenticate, Authorize } = require('../../middlewares/auth');
const roleController = require('../../controllers/role');

router.use('/', Authorize('manage_roles'));

router.get('/', roleController.getAll);
router.get('/:role_name', roleController.getRolePermissions);

router.post('/', roleController.create);
router.post('/:role_name/permissions', roleController.addRolePermission);

router.patch('/:role_name/permissions', roleController.updateRolePermissions);

router.delete('/', roleController.removeRole);
router.delete('/:role_name/permissions', roleController.removeRolePermission);

module.exports = router;
