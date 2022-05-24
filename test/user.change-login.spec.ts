import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { generateNewUser } from './generateNewUser';

describe('user change login', () => {
  let tokenNewPlayer: string;
  
  const newPlayer = generateNewUser();

  beforeAll(async function() {
    const resRegistration = await request('http://localhost:3030')
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request('http://localhost:3030')
    .get('/auth/login')
    .send(newPlayer))
    .body.token;
  }, 10000);

  it('patch /user/changeLogin', async () => {
    const newEmail = faker.internet.email();
    
    const resError = (await request('http://localhost:3030')
    .patch('/user/changeLogin')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({email: newPlayer.email}))
    .body;

    expect(resError).toEqual({ message: 'user with same email already exist' });

    const resAccept = (await request('http://localhost:3030')
    .patch('/user/changeLogin')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .send({ email: newEmail }))
    .body;
    
    expect(resAccept).toEqual({message: "operation success"});

    const checkChangeEmail = (await request('http://localhost:3030')
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(checkChangeEmail.email).toBe(newEmail);
  });

});