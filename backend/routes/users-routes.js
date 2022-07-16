import { Router } from 'express';
import { getUsers, signup, login } from '../controllers/users-controller.js';
import { check } from 'express-validator';
import fileUpload from '../middleware/file-upload.js';

const router = Router();

router.get('/', getUsers);

router.post('/signup', 
    fileUpload.single('image'), // middleware to be able to operate with images that comes from a frontend ('image' - is a key which holds an image file)
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
    ], signup);

router.post('/login', login);

export default router;