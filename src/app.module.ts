import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
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

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.get('POSTGRES_HOST').asString(),
      port: env.get('POSTGRES_PORT').required().asIntPositive(),
      username: env.get('POSTGRES_USER').asString(),
      password: env.get('POSTGRES_PASSWORD').asString(),
      database: env.get('POSTGRES_DB').asString(),
      models: [User, Role, Team, UserTeam],
      autoLoadModels: true,
    }),
    UserModule,
    RoleModule,
    TeamModule,
    AuthModule,
  ],
})
export class AppModule {}
