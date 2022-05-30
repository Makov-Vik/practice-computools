import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import * as Response from '../src/response.messages';
import { RequestStatus } from '../src/constants';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';

describe.skip('prepare to start test', () => {
  let tokenManager: string;
  let tokenAdmin: string;

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
    name: env.get('TEAM_NAME').required().asString(),
    description: env.get('TEAM_DESCRIPTION').required().asString(),
  };



  beforeAll(async function() {
    tokenAdmin = (await request(`${baseString}`).get('/auth/login').send(admin)).body.token;    
  });

  it('registration manager', async () => {
    const registrManager = (await request(`${baseString}`)
    .post('/auth/registrationManager')
    .send(manager)).body

    const checkAdminNotification = (await request(`${baseString}`)
    .get('/user/myNotifications')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(checkAdminNotification).toBeDefined();
    expect(checkAdminNotification).not.toEqual([]);

    const pendingNotification = checkAdminNotification.filter((item: any) => item.status === RequestStatus.PENDING)

    const acceptRegistration = (await request(`${baseString}`)
    .post('/request/acceptRegistration')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ id: pendingNotification[0].id, from: pendingNotification[0].from, status: RequestStatus.APPROVE }))
    .body;

    expect(acceptRegistration).toEqual(Response.SUCCESS);
  })


  it('create team', async() => {
    tokenManager = (await request(`${baseString}`)
    .get('/auth/login')
    .send(manager)).body.token;

    const createTeam = (await request(`${baseString}`)
    .post('/team')
    .set('Authorization', `bearer ${tokenManager}`)
    .send(team))
    .body;

    expect(createTeam).toMatchObject({
      id: expect.any(Number),
      ...team,
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    });
  });
});

