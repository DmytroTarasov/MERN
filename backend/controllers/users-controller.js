import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';

export const getUsers = async (req, res, next) => {
    let users;
    
    try {
        users = await User.find({}, '-password'); // projection - users that will be returned, won`t contain a password
    } catch (error) {
        return next(new HttpError('Fetching users failed', 500));
    }

    res.json({users: users.map(user => user.toObject({ getters: true }))});
}

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs were passed.', 422));
    }

    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(error) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }
 
    if (existingUser) {
        return next(new HttpError('User exists already, please login instead.', 422));
    }

    const createdUser = new User({
        name, 
        email,
        image: req.file.path,
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch(error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    res.status(201).json({user: createdUser.toObject({ getters: true} )});
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(error) {
        return next(new HttpError('Login failed, please try again later.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials.', 401));
    }

    res.json({message: 'Logged in', user: existingUser.toObject({ getters: true })});
}