import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";
import { ROLE } from "../../src/constants";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('role', [{
      id: ROLE.admin,
      role: ROLE[ROLE.admin],
      description: 'head of company'
    },
    {
      id: ROLE.manager,
      role: ROLE[ROLE.manager],
      description: 'master of manage',
    },
    {
      id: ROLE.player,
      role: ROLE[ROLE.player],
      description: 'plays with fire in his heart',
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: any) => {
  queryInterface.bulkDelete('role', {})
}

