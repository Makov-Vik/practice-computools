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
const NOT_FOUND = { message: 'page not found'};
const NOT_AUTHORIZED = { message: 'user is not authorized' }
const MORE4LESS22 = { message: 'more than 4 but less than 22' }
const USER_NOT_FOUND = { message: 'user not found'}
const ROLE_USER_NOT_FOUND = { message: "there isn't user role"}
enum ROLE {
  admin = 1,
  player = 2,
  manager = 3,
}
export {
  PRIMARY_KEY,
  WRONG_EMAIL_OR_PASS,
  ENCODING_SALT,
  SAME_EMAIL,
  MUST_BE_STR,
  RULE_PASS,
  WRONG_EMAIL,
  NOT_FOUND,
  NOT_AUTHORIZED,
  MORE4LESS22,
  USER_NOT_FOUND,
  ROLE_USER_NOT_FOUND,
  ROLE
};
