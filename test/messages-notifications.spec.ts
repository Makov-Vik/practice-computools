import * as request from 'supertest';
import { RequestStatus, RequestType } from '../src/constants';
import { generateNewUser } from './generateNewUser';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';

describe('messages . notifications', () => {
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
    const resRegistration = await request(`${baseString}`)
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request(`${baseString}`)
    .get('/auth/login')
    .send(newPlayer))
    .body.token;

    tokenManager = (await request(`${baseString}`).get('/auth/login').send(manager)).body.token;
  }, 10000);

  it('get /user/me', async () => {

    const player = (await request(`${baseString}`)
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

    const { body: [teamDB] } = (await request(`${baseString}`)
    .get('/team')
    .query({ name: `${team.name}` }))
    //.body[0];

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


    const canceledRequest = (await request(`${baseString}`)
    .post('/user/cancelRequest')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ id: requestJoinTeam.id }))
    .body;

    expect(canceledRequest).toEqual({ message: "access canceled" });
    

    const checkcanceledRequest = (await request(`${baseString}`)
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


    const checkManagerNotification = (await request(`${baseString}`)
    .get('/user/myNotifications')
    .set('Authorization', `bearer ${tokenManager}`))
    .body;

    expect(checkManagerNotification).toBeDefined();
    expect(checkManagerNotification).not.toEqual([]);
  });
});