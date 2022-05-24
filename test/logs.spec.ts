import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('log', () => {
  let tokenAdmin: string;

  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };


  beforeAll(async function() {
    tokenAdmin = (await request('http://localhost:3030').get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('post/get/getType/delete  log', async () => {

    const log = {
      message: 'some message',
      type: 'error',
      where: 'everywhere'
    }
    const createLog = (await request('http://localhost:3030')
    .post('/log')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send(log))
    .body;

    expect(createLog).toMatchObject(log);

    const getLogs = (await request('http://localhost:3030')
    .get('/log')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(getLogs).toBeDefined();
    expect(getLogs).not.toEqual([]);

    const getLogType = await request('http://localhost:3030')
    .get('/log/type')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .query({type: log.type})

    expect(getLogType).toBeDefined();
    expect(getLogType).not.toEqual([]);

    const checkDeleteLog = (await request('http://localhost:3030')
    .delete('/log/one')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({id: createLog._id}))
    .body


    expect(checkDeleteLog).toEqual({ deletedCount: 1 })
  });

});