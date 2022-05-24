import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { generateNewUser } from './generateNewUser';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('registration . login', () => {
  let tokenAdmin: string;

  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };

  beforeAll(async function() {
    tokenAdmin = (await request('http://localhost:3030').get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('registration and login', async () => {
    const newPlayer = generateNewUser()

    const resRegistration = await request('http://localhost:3030')
    .post('/auth/registration')
    .send(newPlayer);

    const checkUser = await request('http://localhost:3030')
    .get('/user/byEmail')
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
