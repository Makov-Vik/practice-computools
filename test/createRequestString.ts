import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

const host = env.get('HOST').required().asString();
const port = env.get('PORT').required().asString();


export const baseString = `http://${host}:${port}`;