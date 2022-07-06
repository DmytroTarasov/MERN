import { Router } from 'express';
import { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } from '../controllers/places-controller.js';
import { check } from 'express-validator';

const router = Router();

// get place by id
router.get('/:pid', getPlaceById);

// get places of a specific user
router.get('/user/:uid', getPlacesByUserId);

// post a place
router.post('/', 
    [
        check('title').not().isEmpty(), 
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ], createPlace);

// update a place
router.patch('/:pid', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ], updatePlace);

// delete a place
router.delete('/:pid', deletePlace);

export default router;