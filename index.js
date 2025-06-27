import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


import route from "./src/routes/url.js";
import { errorMiddleware } from './src/middlewares/error.js';
import userRouter from "./src/routes/user.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/', route);
app.use('/user', userRouter);

const port = process.env.PORT || 5000;


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

import './src/utils/cron-job.js';