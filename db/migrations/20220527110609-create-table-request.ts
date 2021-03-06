import {QueryInterface} from "sequelize";
import {Sequelize_migration} from "../util/inteface";


export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
    await queryInterface.createTable('request', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      from: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
      },
      to: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
      },
      status: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requestStatus',
          key: 'id'
        },
      },
      type: {
        type:  Sequelize.INTEGER,
        references: {
          model: 'requestType',
          key: 'id'
        },
      },
      description: {
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
  await queryInterface.dropTable('request', {});
}
