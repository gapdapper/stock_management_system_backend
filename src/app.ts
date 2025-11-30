import express from 'express';
import '@/config/env';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import { errorHandler } from '@/middlewares/error-handler';
import authRouter from '@/routes/authRoutes';
import productRouter from '@/routes/productRoutes';
import productColorRouter from '@/routes/productColorRoutes';
import productSizeRouter from '@/routes/productSizeRoutes';
import transactionRouter from '@/routes/transactionRoutes';
import cookieParser from 'cookie-parser';

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
app.use('/api/v1/productColors', productColorRouter);
app.use('/api/v1/productSizes', productSizeRouter);
app.use('/api/v1/transactions', transactionRouter);

// Error Handling Middleware
app.use(errorHandler);


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);