import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ElevenLabsService } from '../services/ElevenLabs.service';
import { ElevenLabsController } from '../controllers/ElevenLabs.controller';
import { RawBodyMiddleware } from 'src/middlewares/RawBodyMiddleware';
import { TextBodyMiddleware } from 'src/middlewares/TextBodyMiddleware';

@Module({
  imports: [],
  controllers: [ElevenLabsController],
  providers: [ElevenLabsService],
})
export class ElevenLabsModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/speech-to-text',
        method: RequestMethod.POST,
      })
      .apply(TextBodyMiddleware)
      .forRoutes({
        path: '/text-to-speech',
        method: RequestMethod.POST,
      })
      // .apply(JsonBodyMiddleware)
      // .forRoutes('*');
  }
}