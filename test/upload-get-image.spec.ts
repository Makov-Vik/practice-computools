import * as request from 'supertest';
import * as Response from '../src/response.messages';
import * as path from 'path'
import { generateNewUser } from './generateNewUser';

describe('upload-get image', () => {
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

  it('post /user/image', async () => {

    const newImage = (await request('http://localhost:3030')
    .post('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`)
    .attach('image', path.resolve(__dirname, './okay.jpg')))
    .body;

    expect(newImage).toEqual(Response.SUCCESS);

    const newPlayerFromDB = (await request('http://localhost:3030')
    .get('/user/me')
    .set('Authorization', `bearer ${tokenNewPlayer}`))
    .body;

    expect(newPlayerFromDB.pathPhoto).toBeDefined();
    expect(newPlayerFromDB.pathPhoto).not.toBeNull;

    
    const getImage = (await request('http://localhost:3030')
    .get('/user/image')
    .set('Authorization', `bearer ${tokenNewPlayer}`));

    expect(getImage.body).not.toBeNull();
  });

});