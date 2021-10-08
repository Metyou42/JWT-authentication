const { Router } = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.get('/users', authMiddleware, UserController.getUsers);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.post('/registration', body('email').isEmail(), body('password').isLength({ min: 3, max: 64 }), UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

module.exports = router;
