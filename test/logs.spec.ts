import * as request from 'supertest';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

describe('log', () => {
  let tokenAdmin: string;
  const host = env.get('HOST').required().asString();
  const port = env.get('PORT').required().asString();
  
  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };


  beforeAll(async function() {
    tokenAdmin = (await request(`http://${host}:${port}`).get('/auth/login').send(admin)).body.token;
  }, 10000);

  it('post/get/getType/delete  log', async () => {

    const log = {
      message: 'some message',
      type: 'error',
      where: 'everywhere'
    }
    const createLog = (await request(`http://${host}:${port}`)
    .post('/log')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send(log))
    .body;

    expect(createLog).toMatchObject(log);

    const getLogs = (await request(`http://${host}:${port}`)
    .get('/log')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(getLogs).toBeDefined();
    expect(getLogs).not.toEqual([]);

    const getLogType = await request(`http://${host}:${port}`)
    .get('/log/type')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .query({type: log.type})

    expect(getLogType).toBeDefined();
    expect(getLogType).not.toEqual([]);

    const checkDeleteLog = (await request(`http://${host}:${port}`)
    .delete('/log/one')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({id: createLog._id}))
    .body


    expect(checkDeleteLog).toEqual({ deletedCount: 1 })
  });

});