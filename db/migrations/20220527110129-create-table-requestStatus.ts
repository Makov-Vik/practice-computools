import {QueryInterface} from "sequelize";
import {Sequelize_migration} from "../util/inteface";


export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
    await queryInterface.createTable('requestStatus', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    })

  }
export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.dropTable('requestStatus', {});
}
