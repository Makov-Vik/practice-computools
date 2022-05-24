import * as request from 'supertest';
import { RequestStatus, RequestType } from '../src/constants';
import * as Response from '../src/response.messages';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { generateNewUser } from './generateNewUser';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('palyer-team', () => {
  let tokenNewPlayer: string;
  let tokenManager: string;

  const manager = {
    name: env.get('MANAGER_NAME').required().asString(),
    email: env.get('MANAGER_EMAIL').required().asString(),
    password: env.get('MANAGER_PASSWORD').required().asString(),
  };
  const team = {
    "name": env.get('TEAM_NAME').required().asString(),
    "description": env.get('TEAM_DESCRIPTION').required().asString(),
  };
  const newPlayer = generateNewUser();

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
      type: RequestType.JOIN,
      status: RequestStatus.PENDING,
    })

    const acceptJoin = await request('http://localhost:3030')
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(Response.ACCESS_JOIN);
    

    const checkAcceptJoin = (await request('http://localhost:3030')
    .get('/user/byEmail')
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
      type: RequestType.LEAVE,
      status: RequestStatus.PENDING,
    });


    const acceptLeave = await request('http://localhost:3030')
    .post('/request/leave')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestLeavTeam.id, from: requestLeavTeam.from, description: requestLeavTeam.description });

    expect(acceptLeave.body).toEqual(Response.ACCESS_LEAVE);

    const checkAcceptLeave = (await request('http://localhost:3030')
    .get('/user/byEmail')
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
      type: RequestType.JOIN,
      status: RequestStatus.PENDING,
    })

    const acceptJoin = await request('http://localhost:3030')
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(Response.ACCESS_JOIN);

    const checkAcceptJoin = (await request('http://localhost:3030')
    .get('/user/byEmail')
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
    .send({ email: newPlayer.email }))
    .body;

    expect(checkDeletionPlayer.teams).toEqual([]);
  })
});