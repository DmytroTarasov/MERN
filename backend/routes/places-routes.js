import { Router } from 'express';
import { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } from '../controllers/places-controller.js';
import { check } from 'express-validator';
import fileUpload from '../middleware/file-upload.js';
import checkAuth from '../middleware/check-auth.js';

const router = Router();

// get place by id
router.get('/:pid', getPlaceById);

// get places of a specific user
router.get('/user/:uid', getPlacesByUserId);

router.use(checkAuth); // all routes that come after this middleware, will be reachable only if the user is logged in (create, update, delete a place)

// post a place
router.post('/', 
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(), 
        check('description').isLength({ min: 5 }),
        check('address').not().isEmpty()
    ], createPlace);

// update a place
router.patch('/:pid', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 })
    ], updatePlace);

// delete a place
router.delete('/:pid', deletePlace);

export default router;