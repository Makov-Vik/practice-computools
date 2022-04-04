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

const MUST_BE_STR = { message: 'must be string' };
const RULE_PASS = { message: 'more than 4 but less than 22' };
const WRONG_EMAIL = { message: 'wrong email' };
export {
  PRIMARY_KEY,
  WRONG_EMAIL_OR_PASS,
  ENCODING_SALT,
  SAME_EMAIL,
  MUST_BE_STR,
  RULE_PASS,
  WRONG_EMAIL,
};
