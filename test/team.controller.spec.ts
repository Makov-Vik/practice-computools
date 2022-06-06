import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';

describe('TeamController', () => {
  let tokenManager: string;
  
  const newTeam = {
      name: faker.name.lastName(),
      description: 'description'
  };
  const manager = {
    name: env.get('MANAGER_NAME').required().asString(),
    email: env.get('MANAGER_EMAIL').required().asString(),
    password: env.get('MANAGER_PASSWORD').required().asString(),
  };

  beforeAll(async function() {
    tokenManager = (await request(`${baseString}`)
    .get('/auth/login')
    .send(manager))
    .body.token;
  }, 10000);

  it('create/get/get all team(s)', async () => {

    const createTeam = (await request(`${baseString}`)
    .post('/team')
    .set('Authorization', `bearer ${tokenManager}`)
    .send(newTeam))
    .body;

    expect(createTeam).toMatchObject({
      id: expect.any(Number),
      ...newTeam,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });

    const getTeambyName = (await request(`${baseString}`)
    .get('/team/' + newTeam.name))
    .body;

    expect(getTeambyName).toMatchObject({
      id: expect.any(Number),
      ...newTeam,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });

    const allTeams = (await request(`${baseString}`)
    .get('/team'))
    .body;

    expect(allTeams).toBeDefined();
    expect(allTeams).not.toEqual([])
  });
});