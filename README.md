# AirSoft

## What is it ?
Your attention is presented to the development of backend software for the organization of airsoft teams. This includes CRUD operations for the team and users, an interface for the manager and administrator, the ability to register and receive notifications, and much more, which is described below.

### Migration
The administrator is created before starting the server. So define correct admin details in **.development.env** file
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
Before running the tests, you must create 2 databases named **airsoft_test** in postgresql and mongodb. Make migrations and seeds, like previuse usecase, but use **airsoft_test** database in **./config/database.json** file.
Specify the correct data in the **.test.env** file. 
Also change the env file search to ```dotenv.config({path: `.test.env`});``` in **db\seeders\20220524142200-add-admin.ts** file.

Next, should create manager and one team in the postgresql database. This is necessary because this data is used to make requests.
(All configuration for admin, manager and team are **.test.env** file)
So, for this run server with ```npm run start:for-test```, and then run one test with ```jest prepareToTest.spec.ts```.

After succesfuly passed you should delete **prepareToTest.spec.ts** file and run real test with ```npm run test``` command.
