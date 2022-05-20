import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('RoleController', () => {
  let tokenAdmin: any;

  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '1234'
  }

  beforeAll(async function() {
    tokenAdmin = (await request('http://localhost:3030').get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('post/get  role', async () => {
    const role = {
      role: faker.name.lastName(),
      description: 'description'
    }

    const respondCreatedRole = (await request('http://localhost:3030')
    .post('/role')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send(role))
    .body;

    expect(respondCreatedRole).toMatchObject({
      id: expect.any(Number),
      ...role,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });

    const respondGetRole = (await request('http://localhost:3030')
    .get('/role')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ role: role.role }))
    .body;

    expect(respondGetRole).toMatchObject({
      id: expect.any(Number),
      ...role,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  it('get /role/all', async () => {

    const respondGetAllRole = (await request('http://localhost:3030')
    .get('/role/all')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(respondGetAllRole).toBeDefined();
    expect(respondGetAllRole).not.toEqual([])
  });

});