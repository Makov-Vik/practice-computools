import { faker } from '@faker-js/faker';

const generateNewUser = () => {
  const newPlayer = {
  "name": faker.name.firstName(),
  "email": faker.internet.email(),
  "password": "1234"
  }

  return newPlayer;
};

export { generateNewUser }