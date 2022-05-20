import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { ACCESS_APPROVE, RequestStatus, RequestType } from '../src/constants';


describe('palyer-team', () => {
  let tokenNewPlayer: any;
  let tokenManager: any;

  const manager = {
    "name": "manager",
    "email": "manager@gmail.com",
    "password": "1234",
  };
  const team = {
    "name": "team",
    "description": "team"
  };
  const newPlayer = {
    "name": faker.name.firstName(),
    "email": faker.internet.email(),
    "password": "1234"
  };

  beforeAll(async function() {

    const resRegistration = await request('http://localhost:3030')
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request('http://localhost:3030')
    .get('/auth/login')
    .send(newPlayer))
    .body.token;

    tokenManager = (await request('http://localhost:3030').get('/auth/login').send(manager)).body.token;
  }, 10000);

  it('create, accept request for join, leave team. get team by name', async () => {

    const teamDB = (await request('http://localhost:3030')
    .get('/team')
    .query({ name: `${team.name}` }))
    .body[0];

    expect(teamDB).toMatchObject({
      "id": expect.any(Number),
      "name": team.name,
      "headManager": expect.any(Number),
    });


    const requestJoinTeam = (await request('http://localhost:3030')
    .post('/user/joinTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestJoinTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.join,
      status: RequestStatus.pending,
    })

    const acceptJoin = await request('http://localhost:3030')
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(ACCESS_APPROVE);
    

    const checkAcceptJoin = (await request('http://localhost:3030')
    .get('/user/byEmail')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptJoin.teams).toBeDefined();
    expect(checkAcceptJoin.teams).not.toBeNull();

    
    // leave operations
    const requestLeavTeam = (await request('http://localhost:3030')
    .post('/user/leaveTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestLeavTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.leave,
      status: RequestStatus.pending,
    });


    const acceptLeave = await request('http://localhost:3030')
    .post('/request/leave')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestLeavTeam.id, from: requestLeavTeam.from, description: requestLeavTeam.description });


    const checkAcceptLeave = (await request('http://localhost:3030')
    .get('/user/byEmail')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptLeave.teams).toEqual([]);
  });

  it('forced deletion of a user. post /request/delete', async () => {

    const teamDB = (await request('http://localhost:3030')
    .get('/team')
    .query({ name: `${team.name}` }))
    .body[0];

    expect(teamDB).toMatchObject({
      "id": expect.any(Number),
      "name": team.name,
      "headManager": expect.any(Number),
    });

    const requestJoinTeam = (await request('http://localhost:3030')
    .post('/user/joinTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestJoinTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.join,
      status: RequestStatus.pending,
    })

    const acceptJoin = await request('http://localhost:3030')
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(ACCESS_APPROVE);

    const checkAcceptJoin = (await request('http://localhost:3030')
    .get('/user/byEmail')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptJoin.teams).toBeDefined();
    expect(checkAcceptJoin.teams).not.toBeNull();


    // forced deletion of a user
    const deletionPlayer = await request('http://localhost:3030')
    .post('/request/delete')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ team: teamDB.name, player: requestJoinTeam.from });

    const checkDeletionPlayer = (await request('http://localhost:3030')
    .get('/user/byEmail')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ email: newPlayer.email }))
    .body;

    expect(checkDeletionPlayer.teams).toEqual([]);
  })
});