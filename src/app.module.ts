import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.model';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.model';
import { TeamModule } from './team/team.module';
import { Team } from './team/team.model';
import { UserTeam } from './team/user-team.model';
import { AuthModule } from './auth/auth.module';
import * as env from 'env-var';
import { LogModule } from './log/log.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://user:password@localhost:27017/?authMechanism=DEFAULT&authSource=airsoft'),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.get('POSTGRES_HOST').required().asString(),
      port: env.get('POSTGRES_PORT').required().asIntPositive(),
      username: env.get('POSTGRES_USER').required().asString(),
      password: env.get('POSTGRES_PASSWORD').required().asString(),
      database: env.get('POSTGRES_DB').required().asString(),
      models: [User, Role, Team, UserTeam],
      autoLoadModels: true,
    }),
    UserModule,
    RoleModule,
    TeamModule,
    AuthModule,
    LogModule,
  ],
})
export class AppModule {}
