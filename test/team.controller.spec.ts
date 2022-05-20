import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('TeamController', () => {
  let tokenManager: any;
  const newTeam = {
      name: faker.name.lastName(),
      description: 'description'
  };
  const manager = {
    "name": "manager",
    "email": "manager@gmail.com",
    "password": "1234",
  };

  beforeAll(async function() {
    tokenManager = (await request('http://localhost:3030')
    .get('/auth/login')
    .send(manager))
    .body.token;
  }, 10000);

  it('create/get/get all team(s)', async () => {

    const createTeam = (await request('http://localhost:3030')
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

    const getTeambyName = (await request('http://localhost:3030')
    .get('/team/' + newTeam.name))
    .body;

    expect(getTeambyName).toMatchObject({
      id: expect.any(Number),
      ...newTeam,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });

    const allTeams = (await request('http://localhost:3030')
    .get('/team'))
    .body;

    expect(allTeams).toBeDefined();
    expect(allTeams).not.toEqual([])
  });
});