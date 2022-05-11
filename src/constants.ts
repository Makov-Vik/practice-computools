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
const SAME_TEAM = { message: 'team with same name already exist' };

const MUST_BE_STR = { message: 'must be string' };
const WRONG_EMAIL = { message: 'wrong email' };
const MORE4LESS22 = { message: 'more than 4 but less than 22' };
const VALIDATION = { message: 'validation error' };

const NOT_FOUND = { message: 'page not found'};
const USER_NOT_FOUND = { message: 'user not found'};
const ROLE_USER_NOT_FOUND = { message: "there isn't user role"};
const REQUEST_NOT_FOUND = { message: "there isn't this request"};
const RECIPIENT_NOT_FOUND = { message: 'recipient not found'};
const NOT_AUTHORIZED = { message: 'user is not authorized' };
const RESENDING = { message: 'retry send request' };
const REQUEST_CANCELED = { message: 'request has been canceled' };
const REQUEST_WAS_APPROVED = { message: 'the request has already been approved'};
const REQUEST_WAS_DECLINE = { message: 'the request has already been decline'};
const ACCESS_CANCELED = { message: 'access canceled'};
const ACCESS_LEAVE = { message: 'access leave'};
const ACCESS_APPROVE = { message: 'access approve'};
const NO_ACCESS = { message: 'no access'};
const NO_SUCH_REQ = { message: 'no such request'};
const NO_SUCH_TEAM = { message: 'no such team'};
const SUCCESS = { message: 'operation success'};
const FAILED = { message: "operation failed"};
const FAIL_WRITE_DB = { message: 'failed write to database'};
const BAN = { message: "you got banned"};
const AUTHENTICATED_ERROR = {message: "you have not been authenticated yet"};
const ADMIN_ID = 1;

const LOG_USER_CREATE = { message: "created user: "};

enum ROLE {
  admin = 1,
  player = 2,
  manager = 3,
};

enum RequestStatus {
  approve = 1,
  decline = 2,
  pending = 3,
  canceled = 4
};
enum RequestType {
  join = 1,
  leave = 2,
  signup = 3,
};

const REQUEST_JOIN = {
  type: RequestType.join,
  status: RequestStatus.pending,
}
const REQUEST_LEAVE = {
  type: RequestType.leave,
  status: RequestStatus.pending,
}

export {
  PRIMARY_KEY,
  WRONG_EMAIL_OR_PASS,
  ENCODING_SALT,
  SAME_EMAIL,
  MUST_BE_STR,
  WRONG_EMAIL,
  NOT_FOUND,
  NOT_AUTHORIZED,
  MORE4LESS22,
  USER_NOT_FOUND,
  ROLE_USER_NOT_FOUND,
  NO_ACCESS,
  LOG_USER_CREATE,
  SAME_TEAM,
  RECIPIENT_NOT_FOUND,
  RESENDING,
  REQUEST_CANCELED,
  REQUEST_NOT_FOUND,
  REQUEST_WAS_APPROVED,
  ACCESS_CANCELED,
  ACCESS_LEAVE,
  ACCESS_APPROVE,
  REQUEST_WAS_DECLINE,
  VALIDATION,
  NO_SUCH_REQ,
  NO_SUCH_TEAM,
  SUCCESS,
  FAIL_WRITE_DB,
  FAILED,
  ROLE,
  RequestStatus,
  RequestType,
  REQUEST_JOIN,
  REQUEST_LEAVE,
  BAN,
  AUTHENTICATED_ERROR,
  ADMIN_ID
};
