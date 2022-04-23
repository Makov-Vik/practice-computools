import {QueryInterface} from "sequelize";
import {Sequelize_migration} from "../util/inteface";

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
  await queryInterface.createTable('user-team', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      // references: {
      //   model: 'user',
      //   key: 'id'
      // },
    },
    teamId: {
      type: Sequelize.INTEGER,
      // references: {
      //   model: 'team',
      //   key: 'id'
      // },
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
};

export const down = async (queryInterface: QueryInterface, _Sequelize: any) => {
  await queryInterface.dropTable('user-team', {});
}
