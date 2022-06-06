import * as request from 'supertest';
import * as Response from '../src/response.messages';
import { generateNewUser } from './generateNewUser'
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';


describe('user change login', () => {
  let tokenNewPlayer: string;
  let tokenManager: string;

  const manager = {
    name: env.get('MANAGER_NAME').required().asString(),
    email: env.get('MANAGER_EMAIL').required().asString(),
    password: env.get('MANAGER_PASSWORD').required().asString(),
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

  it('patch /user/ban', async () => {


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

    const banReason = 'said the earth is flat';

    const resBan = (await request(`${baseString}`)
    .patch('/user/ban')
    .set('Authorization', `bearer ${tokenManager}`)
    .send({
      userId: player.id,
      ban: true,
      banReason: banReason
    }))
    .body;
    
    expect(resBan).toEqual(Response.SUCCESS);
    
    tokenNewPlayer = (await request(`${baseString}`)
    .get('/auth/login')
    .send(newPlayer))
    .body.token;

    const playerAfterBan = (await request(`${baseString}`)
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(playerAfterBan).toMatchObject({
      message: 'you got banned',
      banReason: banReason,
    });
  });

});