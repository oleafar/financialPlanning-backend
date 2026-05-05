import request from 'supertest';
import app from '../src/app';
import { transactions } from '../src/store';

beforeEach(() => {
  transactions.clear();
});

describe('GET /api/transactions', () => {
  it('returns empty array when no transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all transactions', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 1000,
      description: 'Salary payment',
      category: 'Salary',
      date: '2024-01-15',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-16',
    });

    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters by type', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 1000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-15',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-16',
    });

    const res = await request(app).get('/api/transactions?type=income');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].type).toBe('income');
  });

  it('filters by category', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 1000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-15',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-16',
    });

    const res = await request(app).get('/api/transactions?category=Food');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Food');
  });

  it('filters by date range', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 1000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-10',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-20',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 30,
      description: 'Bus',
      category: 'Transport',
      date: '2024-02-01',
    });

    const res = await request(app).get('/api/transactions?startDate=2024-01-15&endDate=2024-01-25');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Food');
  });
});

describe('POST /api/transactions', () => {
  it('creates a transaction successfully', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 2500,
      description: 'Monthly salary',
      category: 'Salary',
      date: '2024-01-01',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      type: 'income',
      amount: 2500,
      description: 'Monthly salary',
      category: 'Salary',
      date: '2024-01-01',
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 when type is missing', async () => {
    const res = await request(app).post('/api/transactions').send({
      amount: 100,
      description: 'Test',
      category: 'Other',
      date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when type is invalid', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'invalid',
      amount: 100,
      description: 'Test',
      category: 'Other',
      date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is negative', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: -50,
      description: 'Test',
      category: 'Other',
      date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is zero', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 0,
      description: 'Test',
      category: 'Other',
      date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when description is missing', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      category: 'Food',
      date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when date is invalid', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 50,
      description: 'Test',
      category: 'Food',
      date: 'not-a-date',
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/transactions/:id', () => {
  it('returns transaction by id', async () => {
    const create = await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 500,
      description: 'Freelance work',
      category: 'Freelance',
      date: '2024-01-01',
    });

    const res = await request(app).get(`/api/transactions/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(create.body.id);
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).get('/api/transactions/non-existent-id');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/transactions/:id', () => {
  it('updates a transaction', async () => {
    const create = await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 500,
      description: 'Original',
      category: 'Freelance',
      date: '2024-01-01',
    });

    const res = await request(app).put(`/api/transactions/${create.body.id}`).send({
      amount: 750,
      description: 'Updated',
    });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(750);
    expect(res.body.description).toBe('Updated');
    expect(res.body.type).toBe('income');
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).put('/api/transactions/non-existent').send({ amount: 100 });
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid update data', async () => {
    const create = await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 500,
      description: 'Test',
      category: 'Salary',
      date: '2024-01-01',
    });

    const res = await request(app).put(`/api/transactions/${create.body.id}`).send({
      amount: -100,
    });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('deletes a transaction', async () => {
    const create = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 20,
      description: 'Coffee',
      category: 'Food',
      date: '2024-01-01',
    });

    const del = await request(app).delete(`/api/transactions/${create.body.id}`);
    expect(del.status).toBe(204);

    const get = await request(app).get(`/api/transactions/${create.body.id}`);
    expect(get.status).toBe(404);
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/transactions/non-existent');
    expect(res.status).toBe(404);
  });
});
