
'use server';
/**
 * @fileOverview A flow for generating meditation audio from text.
 *
 * - generateMeditationAudio - A function that converts text to speech.
 * - GenerateMeditationAudioInput - The input type for the generateMeditationAudio function.
 * - GenerateMeditationAudioOutput - The return type for the generateMeditationAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateMeditationAudioInputSchema = z.string();
export type GenerateMeditationAudioInput = z.infer<
  typeof GenerateMeditationAudioInputSchema
>;

const GenerateMeditationAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type GenerateMeditationAudioOutput = z.infer<
  typeof GenerateMeditationAudioOutputSchema
>;

export async function generateMeditationAudio(
  input: GenerateMeditationAudioInput
): Promise<GenerateMeditationAudioOutput> {
  return generateMeditationAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateMeditationAudioFlow = ai.defineFlow(
  {
    name: 'generateMeditationAudioFlow',
    inputSchema: GenerateMeditationAudioInputSchema,
    outputSchema: GenerateMeditationAudioOutputSchema,
  },
  async (query) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

    