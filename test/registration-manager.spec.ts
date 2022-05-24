import * as request from 'supertest';
import { RequestStatus } from '../src/constants';
import * as Response from '../src/response.messages';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { generateNewUser } from './generateNewUser';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('registration manager', () => {
  let tokenAdmin: string;

  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };

  const newManager = generateNewUser();

  beforeAll(async function() {
    tokenAdmin = (await request('http://localhost:3030').get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('registration manager', async () => {

    const registrManager = (await request('http://localhost:3030')
    .post('/auth/registrationManager')
    .send(newManager)).body

    const checkAdminNotification = (await request('http://localhost:3030')
    .get('/user/myNotifications')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(checkAdminNotification).toBeDefined();
    expect(checkAdminNotification).not.toEqual([]);

    const pendingNotification = checkAdminNotification.filter((item: any) => item.status === RequestStatus.PENDING)


    const acceptRegistration = (await request('http://localhost:3030')
    .post('/request/acceptRegistration')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ id: pendingNotification[0].id, from: pendingNotification[0].from, status: 1 }))
    .body;
  
    expect(acceptRegistration).toEqual(Response.SUCCESS);

    const tokenManager = (await request('http://localhost:3030')
    .get('/auth/login')
    .send(newManager)).body;

    expect(tokenManager).toMatchObject({
      token: expect.any(String)
    });
  });

});
