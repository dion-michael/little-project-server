const { Authenticate } = require('../middlewares/auth.js');

const router = require('express').Router();

router.get('/', (req, res) => res.json({ health: 'OK' }));
router.use('/users', require('./users/index.js'));

module.exports = router;
