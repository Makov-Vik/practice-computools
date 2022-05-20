import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { RequestStatus, RequestType } from '../src/constants';

describe('messages . notifications', () => {
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

  it('get /user/me', async () => {

    const player = (await request('http://localhost:3030')
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(player).toMatchObject({
      name: newPlayer.name,
      email: newPlayer.email,
      pathPhoto: null,
      roleId: 2,
      ban: false,
      banReason: '',
      teams: []
    });
  });

  it('cancelRequest . get myMessages . get myNotifications', async () => {

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


    const canceledRequest = (await request('http://localhost:3030')
    .post('/user/cancelRequest')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ id: requestJoinTeam.id }))
    .body;

    expect(canceledRequest).toEqual({ message: "access canceled" });
    

    const checkcanceledRequest = (await request('http://localhost:3030')
    .get('/user/myMessages')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(checkcanceledRequest).toBeDefined();
    expect(checkcanceledRequest).not.toEqual([]);
    expect(checkcanceledRequest).toMatchObject([{
      id: expect.any(Number),
      type: 1,
      status: 4,
    }]);


    const checkManagerNotification = (await request('http://localhost:3030')
    .get('/user/myNotifications')
    .set('Authorization', `bearer ${tokenManager}`))
    .body;

    expect(checkManagerNotification).toBeDefined();
    expect(checkManagerNotification).not.toEqual([]);
  });
});