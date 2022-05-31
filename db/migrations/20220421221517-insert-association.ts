import {Sequelize_migration} from "../util/inteface";
import {QueryInterface} from "sequelize";

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
  // await queryInterface.changeColumn('user', 'teams', {
  // type: Sequelize.INTEGER,
  //   references: {
  //     model: 'user-team',
  //     key: 'id'
  //   },
  // });

  await queryInterface.addConstraint('user', {
    fields: ['teams'],
    type: 'foreign key',
    name: 'custom_fkey_constraint_name',
    references: { //Required field
      table: 'user-team',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  await queryInterface.addConstraint('team', {
    fields: ['users'],
    type: 'foreign key',
    name: 'custom_fkey_constraint_name',
    references: { //Required field
      table: 'user-team',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  // await queryInterface.changeColumn('team', 'users', {
  // type: Sequelize.INTEGER,
  //   references: {
  //     model: 'user-team',
  //     key: 'id'
  //   },
  // });
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {

  await queryInterface.dropTable('team', {});
  await queryInterface.dropTable('user', {});
}

