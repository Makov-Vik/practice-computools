import { Sequelize_migration } from "../util/inteface";
import {QueryInterface} from "sequelize";
import { ENCODING_SALT, ROLE } from "../../src/constants";
import * as bcrypt from 'bcryptjs';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.test.env`});

const preparePassword = async (inputPassword: string) => {
  return await bcrypt.hash(inputPassword, ENCODING_SALT);
}

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('user', [{
      name: env.get('ADMIN_NAME').required().asString(),
      email: env.get('ADMIN_EMAIL').required().asString(),
      password: await preparePassword(env.get('ADMIN_PASSWORD').required().asString()),
      roleId: ROLE.ADMIN,
      registered: true,
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: any) => {
  queryInterface.bulkDelete('user', {})
}

