import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

import authRouter from './modules/auth/auth.router';
import usersRouter from './modules/users/users.router';
import servicesRouter from './modules/services/services.router';
import requestsRouter from './modules/requests/requests.router';
import staffRouter from './modules/staff/staff.router';
import adminRouter from './modules/admin/admin.router';
import paymentsRouter from './modules/payments/payments.router';
import locationsRouter from './modules/locations/locations.router';
import notificationsRouter from './modules/notifications/notifications.router';
import certificatesRouter from './modules/certificates/certificates.router';
import transportRouter from './modules/transport/transport.router';

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost frontend or same-origin
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(authenticate);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'namma-city-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/requests', requestsRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/locations', locationsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/certificates', certificatesRouter);
app.use('/api/v1/transport', transportRouter);

// Error handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[NAMMA CITY API] Server running on http://localhost:${config.port}`);
    console.log(`[NAMMA CITY API] Health check at http://localhost:${config.port}/api/v1/health`);
  });
}

export default app;
