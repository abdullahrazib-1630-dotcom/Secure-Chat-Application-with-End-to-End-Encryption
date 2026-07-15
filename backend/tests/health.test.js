const request = require('supertest');
const app = require('../src/app');

describe('health route', () => {
  test('returns successful health response', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
