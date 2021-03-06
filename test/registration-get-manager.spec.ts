import * as request from 'supertest';
import { RequestStatus, RequestType } from '../src/constants';
import * as Response from '../src/response.messages';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { generateNewUser } from './generateNewUser';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});
import { baseString } from './createRequestString';
import * as io from 'socket.io-client'
import { Request } from '../src/request/request.model';
import { DefaultEventsMap } from '@socket.io/component-emitter';

describe('registration manager', () => {
  type ResponseEvent = {
    [key: string]: string
  };

  let tokenAdmin: string;
  let arrAdminResponse: ResponseEvent[] = [];
  let socketAdmin: io.Socket<DefaultEventsMap, DefaultEventsMap>;

  const admin = {
    name: env.get('ADMIN_NAME').required().asString(),
    email: env.get('ADMIN_EMAIL').required().asString(),
    password: env.get('ADMIN_PASSWORD').required().asString(),
  };

  const newManager = generateNewUser();

  beforeAll(async function() {
    tokenAdmin = (await request(`${baseString}`).get('/auth/login').send(admin)).body.token;
    socketAdmin = io.connect('http://localhost:3030', {
      extraHeaders: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    });

    socketAdmin.on('connection', function(_data) {});

    socketAdmin.on('forAdmin', function(data) {
      arrAdminResponse.push(data) ;

      expect(data).toMatchObject({ 
        from: expect.any(Number),
        description: expect.any(String),
        });
    });

  }, 10000);

  it('registration manager. getManagers', async () => {

    const registrManager = (await request(`${baseString}`)
    .post('/auth/registrationManager')
    .send(newManager)).body;

    const checkAdminNotification = (await request(`${baseString}`)
    .get('/user/myNotifications')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(checkAdminNotification).toBeDefined();
    expect(checkAdminNotification).not.toEqual([]);

    const pendingNotification = checkAdminNotification.filter((item: Request) => item.status === RequestStatus.PENDING)


    const acceptRegistration = (await request(`${baseString}`)
    .post('/request/acceptRegistration')
    .set('Authorization', `bearer ${tokenAdmin}`)
    .send({ id: pendingNotification[pendingNotification.length - 1].id, from: pendingNotification[0].from, status: RequestStatus.APPROVE }))
    .body;
  
    expect(acceptRegistration).toEqual(Response.SUCCESS);

    const tokenManager = (await request(`${baseString}`)
    .get('/auth/login')
    .send(newManager)).body;

    expect(tokenManager).toMatchObject({
      token: expect.any(String)
    });

    //check get managers
    const managers = (await request(`${baseString}`)
    .get('/user/getManagers')
    .set('Authorization', `bearer ${tokenAdmin}`))
    .body;

    expect(managers).toBeDefined();
    expect(managers).not.toEqual([]);

    expect(arrAdminResponse).toMatchObject([
      {
        type: RequestType[RequestType.SIGNUP],
        status: RequestStatus[RequestStatus.PENDING],
        from: expect.any(Number),
        to: expect.any(Number),
        description: expect.any(String)
      }
    ])
  });

});
