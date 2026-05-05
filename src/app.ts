import express from 'express';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import summaryRoutes from './routes/summary';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
