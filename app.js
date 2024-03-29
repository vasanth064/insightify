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
import formRouter from './routes/formRouter.js';
import pollsRouter from './routes/pollsRouter.js';
import formResponsesRouter from './routes/formResponsesRouter.js';
import analyticsRouter from './routes/analyticsRouter.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options('*', cors());


//web-socket
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],transports: ['polling', 'websocket'],
  }
});


    
const chatSocket = io.of('/chat/pollresp');
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

chatSocket.on('connection', (socket) => {
  console.log('A user connected to the chat namespace');
  console.log(socket.id);
  socket.on('getResponse', (message) => {
    console.log('Message received on chat namespace:', message);
    socket.emit('receiveMessage', message);
  });  
});

//web-socket

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP, Please Try again later',
// });

// app.use('/api', limiter);

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
app.use('/api/v1/polls', pollsRouter);
app.use('/api/v1/forms', formRouter);
app.use('/api/v1/formResponses', formResponsesRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`));
});

app.use(errorHandler);

export default app;
