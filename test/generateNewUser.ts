import { faker } from '@faker-js/faker';

export const generateNewUser = () => ({
  "name": faker.name.firstName(),
  "email": faker.internet.email(),
  "password": "1234"
});