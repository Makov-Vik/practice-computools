import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";
import { ROLE } from "../../src/constants";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('role', [{
      id: ROLE.ADMIN,
      role: ROLE[ROLE.ADMIN],
      description: 'head of company'
    },
    {
      id: ROLE.MANAGER,
      role: ROLE[ROLE.MANAGER],
      description: 'master of manage',
    },
    {
      id: ROLE.PLAYER,
      role: ROLE[ROLE.PLAYER],
      description: 'plays with fire in his heart',
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: any) => {
  queryInterface.bulkDelete('role', {})
}

