import { DataType } from 'sequelize-typescript';

const PRIMARY_KEY = {
  type: DataType.INTEGER,
  unique: true,
  autoIncrement: true,
  primaryKey: true,
};

const ENCODING_SALT = 7;

enum ROLE {
  ADMIN = 1,
  PLAYER = 2,
  MANAGER = 3,
};

enum RequestStatus {
  APPROVE = 1,
  DECLINE = 2,
  PENDING = 3,
  CANCELED = 4
};
enum RequestType {
  JOIN = 1,
  LEAVE = 2,
  SIGNUP = 3,
};

enum LogType {
  CREATE = 1,
  UPDATE = 2,
  ERROR = 3,
};

const REQUEST_JOIN = {
  type: RequestType.JOIN,
  status: RequestStatus.PENDING,
}
const REQUEST_LEAVE = {
  type: RequestType.LEAVE,
  status: RequestStatus.PENDING,
}

export {
  PRIMARY_KEY,
  ENCODING_SALT,
  ROLE,
  RequestStatus,
  RequestType,
  LogType,
  REQUEST_JOIN,
  REQUEST_LEAVE,
};
