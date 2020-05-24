const menuController = require('../../controllers/menu');
const router = require('express').Router();

router.get('/', menuController.getMenus);

router.post('/', menuController.createMenu);

module.exports = router;
