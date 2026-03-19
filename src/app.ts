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
import productVariantRouter from '@/routes/productvariantRoutes'
import dailyUploadLogRouter from '@/routes/dailyUploadLogRoutes';
import dashboardRouter from '@/routes/dashboardRoutes';
import webhookRouter from '@/routes/webhookRoutes';
import healthRouter from '@/routes/healthRoutes';
import cookieParser from 'cookie-parser';
import {startDailyUploadNotifyJob} from '@/cron/dailyUploadNotify';
import {startLowStockNotifyJob} from '@/cron/lowStockNotify';
import { startWarmUp } from './utils/warmup';

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp());



// Start the daily upload notification job
startDailyUploadNotifyJob();
startLowStockNotifyJob();

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/productColors', productColorRouter);
app.use('/api/v1/productSizes', productSizeRouter);
app.use('/api/v1/productVariant', productVariantRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/dailyUploadLog', dailyUploadLogRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/webhooks', webhookRouter);
app.use('/api/v1/health', healthRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start warmup job
startWarmUp();

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);