const { Authenticate } = require('../middlewares/auth.js');
const { LoginSchema } = require('./users/bodyValidation');
const validate = require('../middlewares/validate');
const router = require('express').Router();
const { login } = require('../controllers/user');
const User = require('../models/users');
const MailUser = require('../controllers/mail');

router.get('/', (req, res) => res.json({ health: 'OK' }));

router.post('/login', validate(LoginSchema), login);

router.use('/menus', Authenticate, require('./menus'));
router.use('/permissions', Authenticate, require('./permissions'));
router.use('/roles', Authenticate, require('./roles'));
router.use('/users', Authenticate, require('./users'));
router.post('/send', MailUser);

module.exports = router;
