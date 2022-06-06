import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { ROLE } from '../src/constants';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';

describe('RoleController', () => {
  let tokenAdmin: string;
  
  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };


  beforeAll(async function() {
    tokenAdmin = (await request(`${baseString}`).get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('get role', async () => {

    const respondGetRole = (await request(`${baseString}`)
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

    const respondGetAllRole = (await request(`${baseString}`)
    .get('/role/all')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(respondGetAllRole).toBeDefined();
    expect(respondGetAllRole).not.toEqual([])
  });

});