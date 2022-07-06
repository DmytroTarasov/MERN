import { Router } from 'express';
import { getUsers, signup, login } from '../controllers/users-controller.js';
import { check } from 'express-validator';

const router = Router();

router.get('/', getUsers);

router.post('/signup', 
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
    ], signup);

router.post('/login', login);

export default router;