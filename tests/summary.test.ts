import request from 'supertest';
import app from '../src/app';
import { transactions } from '../src/store';

beforeEach(() => {
  transactions.clear();
});

describe('GET /api/summary', () => {
  it('returns zero summary when no transactions', async () => {
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      incomeByCategory: [],
      expensesByCategory: [],
    });
  });

  it('calculates total income correctly', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 3000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 500,
      description: 'Side project',
      category: 'Freelance',
      date: '2024-01-15',
    });

    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body.totalIncome).toBe(3500);
    expect(res.body.totalExpenses).toBe(0);
    expect(res.body.balance).toBe(3500);
  });

  it('calculates total expenses correctly', async () => {
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 800,
      description: 'Rent',
      category: 'Housing',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 200,
      description: 'Groceries',
      category: 'Food',
      date: '2024-01-05',
    });

    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body.totalExpenses).toBe(1000);
    expect(res.body.totalIncome).toBe(0);
    expect(res.body.balance).toBe(-1000);
  });

  it('calculates balance with mixed transactions', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 4000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 1200,
      description: 'Rent',
      category: 'Housing',
      date: '2024-01-02',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 300,
      description: 'Food',
      category: 'Food',
      date: '2024-01-10',
    });

    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body.totalIncome).toBe(4000);
    expect(res.body.totalExpenses).toBe(1500);
    expect(res.body.balance).toBe(2500);
  });

  it('breaks down income by category', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 3000,
      description: 'Jan Salary',
      category: 'Salary',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 3000,
      description: 'Feb Salary',
      category: 'Salary',
      date: '2024-02-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 500,
      description: 'Freelance gig',
      category: 'Freelance',
      date: '2024-01-20',
    });

    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);

    const salaryEntry = res.body.incomeByCategory.find(
      (c: { category: string }) => c.category === 'Salary'
    );
    expect(salaryEntry).toBeDefined();
    expect(salaryEntry.total).toBe(6000);
    expect(salaryEntry.count).toBe(2);

    const freelanceEntry = res.body.incomeByCategory.find(
      (c: { category: string }) => c.category === 'Freelance'
    );
    expect(freelanceEntry).toBeDefined();
    expect(freelanceEntry.total).toBe(500);
    expect(freelanceEntry.count).toBe(1);
  });

  it('breaks down expenses by category', async () => {
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 800,
      description: 'Rent',
      category: 'Housing',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 100,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-05',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 150,
      description: 'Dinner',
      category: 'Food',
      date: '2024-01-10',
    });

    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);

    const housingEntry = res.body.expensesByCategory.find(
      (c: { category: string }) => c.category === 'Housing'
    );
    expect(housingEntry).toBeDefined();
    expect(housingEntry.total).toBe(800);
    expect(housingEntry.count).toBe(1);

    const foodEntry = res.body.expensesByCategory.find(
      (c: { category: string }) => c.category === 'Food'
    );
    expect(foodEntry).toBeDefined();
    expect(foodEntry.total).toBe(250);
    expect(foodEntry.count).toBe(2);
  });

  it('categories are sorted by total descending', async () => {
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 100,
      description: 'Bus pass',
      category: 'Transport',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 800,
      description: 'Rent',
      category: 'Housing',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 300,
      description: 'Groceries',
      category: 'Food',
      date: '2024-01-01',
    });

    const res = await request(app).get('/api/summary');
    const breakdown = res.body.expensesByCategory;
    expect(breakdown[0].category).toBe('Housing');
    expect(breakdown[1].category).toBe('Food');
    expect(breakdown[2].category).toBe('Transport');
  });

  it('handles floating point amounts correctly', async () => {
    await request(app).post('/api/transactions').send({
      type: 'income',
      amount: 100.55,
      description: 'Partial payment',
      category: 'Freelance',
      date: '2024-01-01',
    });
    await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 33.33,
      description: 'Item',
      category: 'Other',
      date: '2024-01-02',
    });

    const res = await request(app).get('/api/summary');
    expect(res.body.totalIncome).toBe(100.55);
    expect(res.body.totalExpenses).toBe(33.33);
    expect(res.body.balance).toBe(67.22);
  });
});
