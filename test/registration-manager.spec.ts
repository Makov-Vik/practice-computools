import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { RequestStatus, SUCCESS } from '../src/constants';


describe('registration manager', () => {
  let tokenAdmin: any;

  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '1234'
  }
  const newManager = {
    "name": faker.name.firstName(),
    "email": faker.internet.email(),
    "password": "1234"
  };

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

    const pendingNotification = checkAdminNotification.filter((item: any) => item.status === RequestStatus.pending)


    const acceptRegistration = (await request('http://localhost:3030')
    .post('/request/acceptRegistration')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ id: pendingNotification[0].id, from: pendingNotification[0].from, status: 1 }))
    .body;
  
    expect(acceptRegistration).toEqual(SUCCESS);

    const tokenManager = (await request('http://localhost:3030')
    .get('/auth/login')
    .send(newManager)).body;

    expect(tokenManager).toMatchObject({
      token: expect.any(String)
    });
  });

});
