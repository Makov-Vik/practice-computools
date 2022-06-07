import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";
import { RequestStatus } from "../../src/constants";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('requestStatus', [{
      id: RequestStatus.APPROVE,
      status: RequestStatus[RequestStatus.APPROVE],
    },
    {
      id: RequestStatus.CANCELED,
      status: RequestStatus[RequestStatus.CANCELED],
    },
    {
      id: RequestStatus.DECLINE,
      status: RequestStatus[RequestStatus.DECLINE],
    },
    {
      id: RequestStatus.PENDING,
      status: RequestStatus[RequestStatus.PENDING],
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  queryInterface.bulkDelete('requestStatus', {})
}

