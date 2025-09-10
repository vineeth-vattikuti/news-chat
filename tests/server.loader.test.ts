import express from 'express';
import request from 'supertest';
import router from '../server/routes';

const app = express();
app.use('/api', router);

describe('server routes', () => {
  it('GET /api/articles returns something', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('count');
  });

  it('GET /api/search without q fails', async () => {
    const res = await request(app).get('/api/search');
    expect(res.statusCode).toBe(400);
  });
});
