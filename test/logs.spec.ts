import * as request from 'supertest';

describe('log', () => {
  let tokenAdmin: any

  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '1234'
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

    const checkdeleteLog = (await request('http://localhost:3030')
    .delete('/log/one')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({id: createLog._id}))
    .body


    expect(checkdeleteLog).toEqual({ deletedCount: 1 })
  });

});