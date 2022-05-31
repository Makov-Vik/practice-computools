FROM node:16.13.2

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
COPY ./dist ./dist

# RUN npx sequelize-cli db:migrate
# RUN npx sequelize-cli db:seed:all

CMD ["npm", "run", "start:dev"]