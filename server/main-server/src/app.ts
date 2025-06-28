import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import logRoutes from './routes/log.routes';
import nurseRoutes from './routes/nurse.routes';
import bookingRoutes from './routes/booking.route';

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/nurses", nurseRoutes);
app.use("/api/v1/bookings", bookingRoutes);

export default app;