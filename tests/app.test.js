import request from 'supertest';
import app from '#src/app.js';

describe('App Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health').expect(200);
      expect(res.body).toHaveProperty('status', 'Healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API greeting', async () => {
      const res = await request(app).get('/api').expect(200);
      expect(res.text).toBe('Hello, from Acquisitions API!');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown endpoint', async () => {
      const res = await request(app).get('/nonexistent').expect(404);
      expect(res.body).toHaveProperty('message', 'Endpoint not found');
    });
  });
});
