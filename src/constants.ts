import { DataType } from 'sequelize-typescript';

const PRIMARY_KEY = {
  type: DataType.INTEGER,
  unique: true,
  autoIncrement: true,
  primaryKey: true,
};

const WRONG_EMAIL_OR_PASS = { message: 'wrong email or passord' };

const ENCODING_SALT = 7;

const SAME_EMAIL = { message: 'user with same email already exist' };

export { PRIMARY_KEY, WRONG_EMAIL_OR_PASS, ENCODING_SALT, SAME_EMAIL };
