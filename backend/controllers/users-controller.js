import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcryptjs'; // library for hashing passwords
import jwt from 'jsonwebtoken';

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

    let hashedPassword;

    try {
        // the 2nd argument is a number of times the password will be salted
        hashedPassword = await bcrypt.hash(password, 12); 
    } catch (err) {
        return next(new HttpError('Could not create a user, try again.', 500));
    }

    const createdUser = new User({
        name, 
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch(error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    let token;
    try {
        // 1st argument - which creds to put into the token
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, 'supersecret_dont_share', { expiresIn: '1h' });
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    res.status(201).json(
    {
       userId: createdUser.id,
       email: createdUser.email,
       token
    });
}


export const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email }); // find a User in DB
    } catch(error) {
        return next(new HttpError('Login failed, please try again later.', 500));
    }

    // if the user with provided email doesn`t exist, return an error
    if (!existingUser) {
        return next(new HttpError('Invalid credentials.', 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        // this error will be thrown if smth during the password comparison went wrong (not in the case when 2 passwords doesn`t match)
        return next(new HttpError('Could not log you in, please check your credentials and try again.', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials.', 401));
    }

    let token;
    try {
        // 1st argument - which creds to put into the token
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, 'supersecret_dont_share', { expiresIn: '1h' });
    } catch (err) {
        return next(new HttpError('Logging in failed, please try again.', 500));
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token
    });
}