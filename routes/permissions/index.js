const router = require('express').Router();
const permissionController = require('../../controllers/permission');
const { Authorize } = require('../../middlewares/auth');

router.use('/', Authorize('manage_permissions'));

router.get('/', permissionController.getAll);

router.post('/', permissionController.create);

router.delete('/', permissionController.deletePermissions);

module.exports = router;
