import request from 'supertest';
import app from '../src/app';

describe('GET /api/categories', () => {
  it('returns default categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(10);
  });

  it('includes expected default categories', async () => {
    const res = await request(app).get('/api/categories');
    const names = res.body.map((c: { name: string }) => c.name);
    expect(names).toContain('Salary');
    expect(names).toContain('Investment');
    expect(names).toContain('Freelance');
    expect(names).toContain('Food');
    expect(names).toContain('Transport');
    expect(names).toContain('Housing');
    expect(names).toContain('Health');
    expect(names).toContain('Entertainment');
    expect(names).toContain('Education');
    expect(names).toContain('Other');
  });

  it('each category has required fields', async () => {
    const res = await request(app).get('/api/categories');
    for (const cat of res.body) {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(['income', 'expense', 'both']).toContain(cat.type);
      expect(cat.createdAt).toBeDefined();
    }
  });
});

describe('POST /api/categories', () => {
  it('creates a new category', async () => {
    const res = await request(app).post('/api/categories').send({
      name: 'Groceries',
      type: 'expense',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Groceries', type: 'expense' });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();

    // Cleanup
    await request(app).delete(`/api/categories/${res.body.id}`);
  });

  it('returns 409 for duplicate category', async () => {
    const first = await request(app).post('/api/categories').send({
      name: 'UniqueCategory',
      type: 'expense',
    });
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/categories').send({
      name: 'UniqueCategory',
      type: 'expense',
    });
    expect(second.status).toBe(409);

    // Cleanup
    await request(app).delete(`/api/categories/${first.body.id}`);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/categories').send({ type: 'expense' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when type is invalid', async () => {
    const res = await request(app).post('/api/categories').send({
      name: 'Test',
      type: 'invalid',
    });
    expect(res.status).toBe(400);
  });

  it('allows type "both"', async () => {
    const res = await request(app).post('/api/categories').send({
      name: 'Miscellaneous',
      type: 'both',
    });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('both');

    // Cleanup
    await request(app).delete(`/api/categories/${res.body.id}`);
  });
});

describe('PUT /api/categories/:id', () => {
  it('updates a category name', async () => {
    const create = await request(app).post('/api/categories').send({
      name: 'OldName',
      type: 'expense',
    });

    const res = await request(app).put(`/api/categories/${create.body.id}`).send({
      name: 'NewName',
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('NewName');
    expect(res.body.type).toBe('expense');

    // Cleanup
    await request(app).delete(`/api/categories/${create.body.id}`);
  });

  it('updates a category type', async () => {
    const create = await request(app).post('/api/categories').send({
      name: 'FlexCat',
      type: 'income',
    });

    const res = await request(app).put(`/api/categories/${create.body.id}`).send({
      type: 'both',
    });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('both');

    // Cleanup
    await request(app).delete(`/api/categories/${create.body.id}`);
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).put('/api/categories/non-existent').send({ name: 'Test' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid type', async () => {
    const create = await request(app).post('/api/categories').send({
      name: 'ValidCat',
      type: 'expense',
    });

    const res = await request(app).put(`/api/categories/${create.body.id}`).send({
      type: 'invalid',
    });
    expect(res.status).toBe(400);

    // Cleanup
    await request(app).delete(`/api/categories/${create.body.id}`);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('deletes a category', async () => {
    const create = await request(app).post('/api/categories').send({
      name: 'ToDelete',
      type: 'expense',
    });

    const del = await request(app).delete(`/api/categories/${create.body.id}`);
    expect(del.status).toBe(204);

    const all = await request(app).get('/api/categories');
    const found = all.body.find((c: { id: string }) => c.id === create.body.id);
    expect(found).toBeUndefined();
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/categories/non-existent');
    expect(res.status).toBe(404);
  });
});

describe('Categories store isolation', () => {
  it('categories store is shared across requests', async () => {
    const before = await request(app).get('/api/categories');
    const initialCount = before.body.length;

    const created = await request(app).post('/api/categories').send({
      name: 'IsolationTest',
      type: 'both',
    });
    expect(created.status).toBe(201);

    const after = await request(app).get('/api/categories');
    expect(after.body.length).toBe(initialCount + 1);

    // Cleanup
    await request(app).delete(`/api/categories/${created.body.id}`);
  });
});
