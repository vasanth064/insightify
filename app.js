import express from 'express';
import AppError from './helpers/appError.js';
import errorHandler from './helpers/errorHandler.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import monogoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options('*', cors());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please Try again later',
});

app.use('/api', limiter);

app.use(monogoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// app.use('/public', protectedRoute, express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`));
});

app.use(errorHandler);

export default app;
