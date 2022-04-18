import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as env from 'env-var';

async function run() {
  const PORT = env.get('PORT').required().asIntPositive() || 3000;
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

run();
