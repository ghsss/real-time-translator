import { config } from 'dotenv';
import * as translator from 'free-translate';
import * as fs from 'fs';
import * as path from 'path';

config();

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

import { Injectable } from '@nestjs/common';
import { ElevenLabsClient } from 'elevenlabs';
import { randomUUID } from 'crypto';

@Injectable()
export class ElevenLabsService {

  private _AIModelInstance: ElevenLabsClient;
  public get AIModelInstance(): ElevenLabsClient {
    return this._AIModelInstance;
  }
  public set AIModelInstance(value: ElevenLabsClient) {
    this._AIModelInstance = value;
  }

  wakeUpAI() {

    if (!this.AIModelInstance) {
      this.AIModelInstance = new ElevenLabsClient({
        apiKey: ELEVEN_LABS_API_KEY
      });
      console.log('AI is wake up!');
    }

  }

  async textToSpeech(incomingMessage: string): Promise<string> {

    this.wakeUpAI();

    const translatedText = await translator.translate(incomingMessage, { to: 'en' });

    console.log('translatedText: ', translatedText);

    const audio = await this.AIModelInstance.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      model_id: 'eleven_multilingual_v2',
      text: translatedText,
      output_format: 'mp3_44100_128',
      // Optional voice settings that allow you to customize the output
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
        use_speaker_boost: true,
        speed: 1.0,
      },
    });

    const audioArrayBufferPromise = new Promise<any>((resolve, reject) => {

      const fileName = `${randomUUID()}.mp3`;
      const filePath = path.resolve(__dirname, fileName);
      const fileStream = fs.createWriteStream(filePath);
      audio.pipe(fileStream);
  
      fileStream.on('finish', () => resolve(filePath)); // Resolve with the fileName
      fileStream.on('error', err => reject(err));

    });
    
    const audioArrayBuffer = await Promise.all([audioArrayBufferPromise]);

    const responseData = fs.readFileSync(audioArrayBuffer[0], { encoding: 'binary' });

    fs.unlinkSync(audioArrayBuffer[0]);

    return responseData;

  }

  async speechToText(incomingMessage: ArrayBuffer): Promise<string> {

    this.wakeUpAI();
    const audioBlob = new Blob([incomingMessage], { type: "audio/mp3" });
    const transcription = await this.AIModelInstance.speechToText.convert({
      file: audioBlob,
      model_id: "scribe_v1",
    });
    const translatedText = await translator.translate(transcription.text, { to: 'en' });

    console.log('translatedText: ', translatedText);
    
    return translatedText;

  }

}
