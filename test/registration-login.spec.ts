import * as request from 'supertest';
import { faker } from '@faker-js/faker';


describe('registration . login', () => {
  let tokenAdmin: any;

  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '1234'
  }

  beforeAll(async function() {
    tokenAdmin = (await request('http://localhost:3030').get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('registration and login', async () => {
    const newPlayer = {
      "name": faker.name.firstName(),
      "email": faker.internet.email(),
      "password": "1234"
    };

    const resRegistration = await request('http://localhost:3030')
    .post('/auth/registration')
    .send(newPlayer);

    const checkUser = await request('http://localhost:3030')
    .get('/user/byEmail')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ email: newPlayer.email });

    expect(resRegistration.body).toMatchObject({
        token: expect.any(String)
    });
    expect(checkUser.body.email).toBe(newPlayer.email);

    const resLogin = await request('http://localhost:3030')
    .get('/auth/login')
    .send(newPlayer);

    expect(resLogin.body).toMatchObject({
      token: expect.any(String)
  });
  });

});
