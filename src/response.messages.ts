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
const ACCESS_JOIN = { message: 'access join'};
const ACCESS_APPROVE = { message: 'access approve'};
const NO_ACCESS = { message: 'no access'};
const NO_SUCH_REQ = { message: 'no such request'};
const NO_SUCH_TEAM = { message: 'no such team'};
const SUCCESS = { message: 'operation success'};
const FAILED = { message: "operation failed"};
const FAILED_CHANGE_REQ = { message: "failed to change request type"};
const FAIL_WRITE_DB = { message: 'failed write to database'};
const BAN = { message: "you got banned"};
const AUTHENTICATED_ERROR = {message: "you have not been authenticated yet"};

const LOG_USER_CREATE = { message: "created user: "};

const WRONG_EMAIL_OR_PASS = { message: 'wrong email or passord' };


export {
  WRONG_EMAIL_OR_PASS,
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
  BAN,
  AUTHENTICATED_ERROR,
  FAILED_CHANGE_REQ,
  ACCESS_JOIN
};
