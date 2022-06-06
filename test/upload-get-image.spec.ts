import * as request from 'supertest';
import * as Response from '../src/response.messages';
import * as path from 'path'
import { generateNewUser } from './generateNewUser';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';

describe('upload-get image', () => {
  let tokenNewPlayer: string;
  
  const newPlayer = generateNewUser();

  beforeAll(async function() {
    const resRegistration = await request(`${baseString}`)
    .post('/auth/registration')
    .send(newPlayer);

    tokenNewPlayer = (await request(`${baseString}`)
    .get('/auth/login')
    .send(newPlayer))
    .body.token;

  }, 10000);

  it('post /user/image', async () => {

    const newImage = (await request(`${baseString}`)
    .post('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .attach('image', path.resolve(__dirname, './okay.jpg')))
    .body;

    expect(newImage).toEqual(Response.SUCCESS);

    const newPlayerFromDB = (await request(`${baseString}`)
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(newPlayerFromDB.pathPhoto).toBeDefined();
    expect(newPlayerFromDB.pathPhoto).not.toBeNull;

    
    const getImage = (await request(`${baseString}`)
    .get('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`));

    expect(getImage.body).not.toBeNull();
  });

});