// src/ai/flows/suggest-songs-from-mood.ts
'use server';

/**
 * @fileOverview 이 파일은 사용자의 기분에 따라 노래를 제안하는 Genkit flow를 정의합니다.
 *
 * 이 flow는 기분 설명을 입력으로 받아 제안된 노래 목록을 반환합니다.
 * OpenAI API를 사용하여 기분을 분석하고 노래 추천을 생성합니다.
 *
 * @exports {
 *   suggestSongsFromMood: (input: SuggestSongsFromMoodInput) => Promise<SuggestSongsFromMoodOutput>;
 *   SuggestSongsFromMoodInput: z.infer<typeof SuggestSongsFromMoodInputSchema>;
 *   SuggestSongsFromMoodOutput: z.infer<typeof SuggestSongsFromMoodOutputSchema>;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSongsFromMoodInputSchema = z.object({
  moodDescription: z.string().describe('사용자의 현재 기분에 대한 설명입니다.'),
});
export type SuggestSongsFromMoodInput = z.infer<typeof SuggestSongsFromMoodInputSchema>;

const SuggestSongsFromMoodOutputSchema = z.object({
  suggestedSongs: z
    .array(z.string())
    .describe('기분 설명에 기반한 노래 추천 목록입니다.'),
});
export type SuggestSongsFromMoodOutput = z.infer<typeof SuggestSongsFromMoodOutputSchema>;

export async function suggestSongsFromMood(input: SuggestSongsFromMoodInput): Promise<SuggestSongsFromMoodOutput> {
  return suggestSongsFromMoodFlow(input);
}

const suggestSongsFromMoodPrompt = ai.definePrompt({
  name: 'suggestSongsFromMoodPrompt',
  input: {schema: SuggestSongsFromMoodInputSchema},
  output: {schema: SuggestSongsFromMoodOutputSchema},
  prompt: `You are a music expert. The user will describe their mood in Korean. Based on this description, suggest 5 songs that would match their emotional state. Your response must be in Korean. Return the song suggestions as a list of strings, with each string in the format "노래 제목 by 아티스트".

Mood description: {{{moodDescription}}}`,
});

const suggestSongsFromMoodFlow = ai.defineFlow(
  {
    name: 'suggestSongsFromMoodFlow',
    inputSchema: SuggestSongsFromMoodInputSchema,
    outputSchema: SuggestSongsFromMoodOutputSchema,
  },
  async input => {
    const {output} = await suggestSongsFromMoodPrompt(input);
    return output!;
  }
);
