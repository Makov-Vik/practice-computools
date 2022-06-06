import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";
import { RequestType } from "../../src/constants";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('requestType', [{
      id: RequestType.JOIN,
      type: RequestType[RequestType.JOIN],
    },
    {
      id: RequestType.LEAVE,
      type: RequestType[RequestType.LEAVE],
    },
    {
      id: RequestType.SIGNUP,
      type: RequestType[RequestType.SIGNUP],
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: any) => {
  queryInterface.bulkDelete('requestType', {})
}

