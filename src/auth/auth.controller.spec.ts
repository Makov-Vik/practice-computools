import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
//import assert = require("assert");
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as env from 'env-var';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Role } from '../role/role.model';
import { Team } from '../team/team.model';
import { UserTeam } from '../team/user-team.model';
import { INestApplication } from '@nestjs/common';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';


chai.use(chaiHttp);
const assert = chai.assert;

const mockUserService = {
  findOne(id: string) {
    return "some value";
  }
};

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  beforeEach(async function() {
    this.timeout(10000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        //forwardRef(() => UserModule),
        UserModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        JwtModule.register({
          secret: env.get('PRIVATE_KEY').default('SOME_MSG').required().asString(),
          signOptions: {
            expiresIn: '24h',
          },
        }),
        MongooseModule.forRoot(env.get('MONGO_URI').required().asString()),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: env.get('POSTGRES_HOST').required().asString(),
          port: env.get('POSTGRES_PORT').required().asIntPositive(),
          username: env.get('POSTGRES_USER').required().asString(),
          password: env.get('POSTGRES_PASSWORD').required().asString(),
          database: env.get('POSTGRES_DB').required().asString(),
          models: [User, Role, Team, UserTeam],
          autoLoadModels: true,
          synchronize: true,
        })
      ],
      controllers: [AuthController],
      providers: [AuthService, {
        provide: getModelToken(User),
        useValue: mockUserService,
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    await app.init();
  });


  afterEach(async () => {
    await app.close();
  });


  // it('should be true', () => {
  //   assert.equal(true, true);
  // });

  it('post /auth/registration', async () => {
    const res = await chai.request(app.getHttpServer()).post('/auth/registration').send({
      "name": "num",
      "email": "another@gmail.com",
      "password": "1234"
    });
    assert.isString(res.body.token, 'token string');
  });

});
