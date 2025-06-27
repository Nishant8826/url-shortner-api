import express from "express";
const userRouter = express.Router();
import { login, signup } from "../controllers/userControls.js";


userRouter.post('/login', login);
userRouter.post('/signup', signup);

export default userRouter;
