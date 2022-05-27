import * as request from 'supertest';
import * as Response from '../src/response.messages';
import * as path from 'path'
import { generateNewUser } from './generateNewUser';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('upload-get image', () => {
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

  it('post /user/image', async () => {

    const newImage = (await request(`http://${host}:${port}`)
    .post('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .attach('image', path.resolve(__dirname, './okay.jpg')))
    .body;

    expect(newImage).toEqual(Response.SUCCESS);

    const newPlayerFromDB = (await request(`http://${host}:${port}`)
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(newPlayerFromDB.pathPhoto).toBeDefined();
    expect(newPlayerFromDB.pathPhoto).not.toBeNull;

    
    const getImage = (await request(`http://${host}:${port}`)
    .get('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`));

    expect(getImage.body).not.toBeNull();
  });

});