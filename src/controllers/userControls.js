import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { db } from '../utils/db.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = TryCatch(async (req, res, next) => {
    let { email, password, displayName } = req.body;
    if (!email || !password) return next(new ErrorHandler('Invalid credentials', 400));
    let user = await db.select('*').from('applicationusers').where('email', email).first();
    if (user) return next(new ErrorHandler('Email already exist', 200))
    const passwordHash = await bcrypt.hash(password, 10);
    password = passwordHash
    user = await db('applicationusers').returning('*').insert({ email, password, display_name: displayName });
    user = user[0]
    const token = await jwt.sign(user, 'url-shortner', { expiresIn: 7 })
    return res.status(201).send({ user, token })
})

export const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler('Invalid credentials', 400));
    const user = await db.select('*').from('applicationusers').where('email', email).first();
    if (!user) return res.status(200).send({ msg: "Email not found", type: 'email' });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(200).send({ msg: "Password is incorrect", type: 'password' });
    const token = await jwt.sign(user, 'url-shortner', { expiresIn: 7 })
    return res.status(200).send({ user, token })
})
