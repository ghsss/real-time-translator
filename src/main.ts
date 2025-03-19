import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { ElevenLabsModule } from './modules/ElevenLabs.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(ElevenLabsModule, { bodyParser: true });
  app.use(bodyParser.text({ limit: '20mb' }));
  app.use(bodyParser.raw({ limit: '20mb' }));
  app.use(bodyParser.json({ limit: '10mb' }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
