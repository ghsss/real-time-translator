import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ElevenLabsService } from '../services/ElevenLabs.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ElevenLabsController {
  constructor(private readonly elevenLabsService: ElevenLabsService) {}

  @Post('/text-to-speech')
  async textToSpeech(@Body() body: string): Promise<string> {
    console.log('textToSpeech body:\n\n', body);
    return await this.elevenLabsService.textToSpeech(body);
  }

  @Post('/speech-to-text')
  @UseInterceptors(FileInterceptor('file'))
  async speechToText(@Body() body: any): Promise<string> {
    console.log('body:\n\n', body);
    const response = await this.elevenLabsService.speechToText(body);
    console.log('response: ', response);
    return response;
  }

}