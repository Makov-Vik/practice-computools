import {Sequelize_migration} from "../util/inteface";
import {QueryInterface} from "sequelize";

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
  await queryInterface.addConstraint('user', {
    fields: ['teams'],
    type: 'foreign key',
    name: 'custom_fkey_constraint_name',
    references: {
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
    references: {
      table: 'user-team',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {

  await queryInterface.dropTable('team', {});
  await queryInterface.dropTable('user', {});
}

