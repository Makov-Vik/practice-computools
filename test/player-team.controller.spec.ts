import * as request from 'supertest';
import { RequestStatus, RequestType } from '../src/constants';
import * as Response from '../src/response.messages';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { generateNewUser } from './generateNewUser';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';
import * as io from 'socket.io-client'

describe('palyer-team', () => {
  type ResponseEvent = Record<string, string>

  let tokenNewPlayer: string;
  let tokenManager: string;
  let tokenAdmin: string;
  let arrAdminResponse: ResponseEvent[] = [];
  let arrManagerResponse: ResponseEvent[] = [];
  let arrPlayerResponse: ResponseEvent[] = [];

  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };
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

    const resRegistration = await request(`${baseString}`)
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request(`${baseString}`)
    .get('/auth/login')
    .send(newPlayer))
    .body.token;

    tokenManager = (await request(`${baseString}`).get('/auth/login').send(manager)).body.token;
    tokenAdmin = (await request(`${baseString}`).get('/auth/login').send(admin)).body.token;

    const socketAdmin = io.connect('http://localhost:3030', {
      extraHeaders: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    });
    const socketManager = io.connect('http://localhost:3030', {
      extraHeaders: {
        Authorization: `Bearer ${tokenManager}`
      }
    });
    const socketPlayer = io.connect('http://localhost:3030', {
      extraHeaders: {
        Authorization: `Bearer ${tokenNewPlayer}`
      }
    });

    socketAdmin.on('connection', function(data) {
      console.log('connect Admin: ', data);
    });
    socketManager.on('connection', function(data) {
      console.log('connect Manager: ', data);
    });
    socketPlayer.on('connection', function(data) {
      console.log('connect Player: ', data);
    });

    socketAdmin.on('forAdmin', async function(data) {
      arrAdminResponse.push(data) ;
      expect(data).toMatchObject({
        from: expect.any(Number),
        type: expect.any(String)
      });
    });
    socketPlayer.on('forPlayer', async function(data) {
      arrPlayerResponse.push(data) ;
      expect(data).toMatchObject({
        from: expect.any(Number),
        type: expect.any(String)
      });
    });
    socketManager.on('forManager', async function(data) {
      arrManagerResponse.push(data) ;
      expect(data).toMatchObject({
        from: expect.any(Number),
        type: expect.any(String)
      });
    });

  }, 10000);

  it('create, accept request for join, leave team. get team by name', async () => {

    const teamDB = (await request(`${baseString}`)
    .get('/team')
    .query({ name: `${team.name}` }))
    .body[0];

    expect(teamDB).toMatchObject({
      "id": expect.any(Number),
      "name": team.name,
      "headManager": expect.any(Number),
    });


    const requestJoinTeam = (await request(`${baseString}`)
    .post('/user/joinTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestJoinTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.JOIN,
      status: RequestStatus.PENDING,
    })

    const acceptJoin = await request(`${baseString}`)
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(Response.ACCESS_JOIN);
    

    const checkAcceptJoin = (await request(`${baseString}`)
    .get('/user/byEmail')
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptJoin.teams).toBeDefined();
    expect(checkAcceptJoin.teams).not.toBeNull();

    
    // leave operations
    const requestLeavTeam = (await request(`${baseString}`)
    .post('/user/leaveTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestLeavTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.LEAVE,
      status: RequestStatus.PENDING,
    });


    const acceptLeave = await request(`${baseString}`)
    .post('/request/leave')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestLeavTeam.id, from: requestLeavTeam.from, description: requestLeavTeam.description });

    expect(acceptLeave.body).toEqual(Response.ACCESS_LEAVE);

    const checkAcceptLeave = (await request(`${baseString}`)
    .get('/user/byEmail')
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptLeave.teams).toEqual([]);

    expect(arrAdminResponse).toMatchObject([
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.JOIN]
      },
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.JOIN],
        status: RequestStatus[RequestStatus.APPROVE]
      },
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.LEAVE]
      },
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.LEAVE],
        status: RequestStatus[RequestStatus.APPROVE]
      }
    ]);

    expect(arrManagerResponse).toMatchObject([
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.JOIN]
      },
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.LEAVE]
      }
    ]);

    expect(arrPlayerResponse).toMatchObject([
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.JOIN],
        status: RequestStatus[RequestStatus.APPROVE]
      },
      {
        from: expect.any(Number),
        description: expect.any(String),
        type: RequestType[RequestType.LEAVE],
        status: RequestStatus[RequestStatus.APPROVE]
      }
    ]);
  });

  it('forced deletion of a user. post /request/delete', async () => {

    const teamDB = (await request(`${baseString}`)
    .get('/team')
    .query({ name: `${team.name}` }))
    .body[0];

    expect(teamDB).toMatchObject({
      "id": expect.any(Number),
      "name": team.name,
      "headManager": expect.any(Number),
    });

    const requestJoinTeam = (await request(`${baseString}`)
    .post('/user/joinTeam')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ to: teamDB.headManager, team: team.name }))
    .body;

    expect(requestJoinTeam).toMatchObject({
      id: expect.any(Number),
      type: RequestType.JOIN,
      status: RequestStatus.PENDING,
    })

    const acceptJoin = await request(`${baseString}`)
    .post('/request/join')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ id: requestJoinTeam.id, from: requestJoinTeam.from, description: requestJoinTeam.description });

    expect(acceptJoin.body).toEqual(Response.ACCESS_JOIN);

    const checkAcceptJoin = (await request(`${baseString}`)
    .get('/user/byEmail')
    .send({ email: newPlayer.email }))
    .body;

    expect(checkAcceptJoin.teams).toBeDefined();
    expect(checkAcceptJoin.teams).not.toBeNull();


    // forced deletion of a user
    const deletionPlayer = await request(`${baseString}`)
    .post('/request/delete')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({ team: teamDB.name, player: requestJoinTeam.from });

    const checkDeletionPlayer = (await request(`${baseString}`)
    .get('/user/byEmail')
    .send({ email: newPlayer.email }))
    .body;

    expect(checkDeletionPlayer.teams).toEqual([]);
  })
});