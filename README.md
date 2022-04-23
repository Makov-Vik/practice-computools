# AirSoft

## What is it ?
Your attention is presented to the development of backend software for the organization of airsoft teams. This includes CRUD operations for the team and users, an interface for the manager and administrator, the ability to register and receive notifications, and much more, which is described below.

### Magration
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