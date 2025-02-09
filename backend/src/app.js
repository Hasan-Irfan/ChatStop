import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config({
  path: '.env'
});

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",  // Allow only localhost for development (or use process.env for dynamic URL)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

// Handling preflight requests
app.options("*", cors()); // Enable pre-flight across-the-board

// Your routes and server setup
app.get("/", (req, res) => {
  res.send("CORS is enabled for all origins!");
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '16kb'}));
app.use(express.static(process.env.PUBLIC_DIR));
app.use(cookieParser());

//routes imports
import AuthRouter from './routes/AuthRoutes.js';
import RequestRouter from './routes/requestRoutes.js';
import MessageRouter from './routes/messageRoutes.js';

//routes declaration
app.use('/main',AuthRouter);
app.use('/main',RequestRouter);
app.use('/main',MessageRouter);