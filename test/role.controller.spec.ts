import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { ROLE } from '../src/constants';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('RoleController', () => {
  let tokenAdmin: string;
  const host = env.get('HOST').required().asString();
  const port = env.get('PORT').required().asString();
  
  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };


  beforeAll(async function() {
    tokenAdmin = (await request(`http://${host}:${port}`).get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('get role', async () => {

    const respondGetRole = (await request(`http://${host}:${port}`)
    .get('/role')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ role: ROLE[ROLE.PLAYER] }))
    .body;

    expect(respondGetRole).toMatchObject({
      id: expect.any(Number),
      role: ROLE[ROLE.PLAYER],
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  it('get /role/all', async () => {

    const respondGetAllRole = (await request(`http://${host}:${port}`)
    .get('/role/all')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(respondGetAllRole).toBeDefined();
    expect(respondGetAllRole).not.toEqual([])
  });

});