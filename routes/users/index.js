const userController = require('../../controllers/userController');
const router = require('express').Router();
const { Authenticate } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { LoginSchema } = require('./bodyValidation');

router.post('/register', userController.createUser);

router.post('/login', validate(LoginSchema), userController.login);

router.get('/profile', Authenticate, userController.getProfile);

router.get('/', Authenticate, userController.getAll);

module.exports = router;
