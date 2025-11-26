import express from 'express';
import { pinoHttp } from 'pino-http';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from '@/middlewares/error-handler';
import authRouter from '@/routes/authRoutes';
import productRouter from '@/routes/productRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

export const ENV = {
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
}

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: "http://localhost:8081",
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);

// Error Handling Middleware
app.use(errorHandler);


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);