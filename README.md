# AirSoft

## What is it ?
Your attention is presented to the development of backend software for the organization of airsoft teams. This includes CRUD operations for the team and users, an interface for the manager and administrator, the ability to register and receive notifications, and much more, which is described below.

### Migration
To run a create table migration, use:
```
npx sequelize-cli db:migrate
```
to drop all tables, use:
```
npx sequelize-cli db:migrate:undo:all
```

To populate the table of roles, run
```
npx sequelize-cli db:seed:all
```
to clear the table of roles:
```
npx sequelize-cli db:seed:undo:all
```

### Test 
Before running the tests, you must create 2 databases named **airsoft_test** in postgresql and mongodb.
Specify the correct connection data in the **.env** file. 

Next, create an admin, manager, player and one team in the postgresql database. This is necessary because this data is used to make requests. Also, in the **constants.ts** file, you must specify the correct admin id. After that, you can run the ```npm run test``` command
Data to create:
```
  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '1234'
  };
  const manager = {
    "name": "manager",
    "email": "manager@gmail.com",
    "password": "1234",
  };
  const player = {
    "name": "player",
    "email": "player@gmail.com",
    "password": "1234",
  };
  const team = {
    "name": "team",
    "description": "team"
  };
```