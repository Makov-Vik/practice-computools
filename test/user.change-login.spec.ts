import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { generateNewUser } from './generateNewUser';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('user change login', () => {
  let tokenNewPlayer: string;
  const host = env.get('HOST').required().asString();
  const port = env.get('PORT').required().asString();
  
  const newPlayer = generateNewUser();

  beforeAll(async function() {
    const resRegistration = await request(`http://${host}:${port}`)
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request(`http://${host}:${port}`)
    .get('/auth/login')
    .send(newPlayer))
    .body.token;
  }, 10000);

  it('patch /user/changeLogin', async () => {
    const newEmail = faker.internet.email();
    
    const resError = (await request(`http://${host}:${port}`)
    .patch('/user/changeLogin')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({email: newPlayer.email}))
    .body;

    expect(resError).toEqual({ message: 'user with same email already exist' });

    const resAccept = (await request(`http://${host}:${port}`)
    .patch('/user/changeLogin')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ email: newEmail }))
    .body;
    
    expect(resAccept).toEqual({message: "operation success"});

    const checkChangeEmail = (await request(`http://${host}:${port}`)
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(checkChangeEmail.email).toBe(newEmail);
  });

});