import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function run() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

run();
