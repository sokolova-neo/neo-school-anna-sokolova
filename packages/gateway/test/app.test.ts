import { FastifyInstance } from 'fastify';
import request from 'supertest';

import createApp from '../src/app';

let app: FastifyInstance;

beforeAll(async (): Promise<void> => {
  app = await createApp({
    noRemote: true,
    noRedis: true,
  });
});

describe('app', (): void => {
  test('status controller returns OK', async (): Promise<void> => {
    const response = await request(app.server).get('/status');

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toMatchObject({ status: 'OK' });
  });

  test('invalid route returns 404', async (): Promise<void> => {
    const response = await request(app.server).get('/noexist');

    expect(response.status).toBe(404);
  });
});
