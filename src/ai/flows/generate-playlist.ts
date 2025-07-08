// src/ai/flows/generate-playlist.ts
'use server';
/**
 * @fileOverview A flow that generates a playlist based on mood and/or genre.
 *
 * - generatePlaylist - A function that handles the playlist generation process.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaylistInputSchema = z.object({
  mood: z.string().describe('The mood for the playlist (e.g., happy, sad, chill).').optional(),
  genre: z.string().describe('The genre for the playlist (e.g., pop, rock, jazz).').optional(),
});
export type GeneratePlaylistInput = z.infer<typeof GeneratePlaylistInputSchema>;

const GeneratePlaylistOutputSchema = z.object({
  playlistDescription: z.string().describe('A description of the generated playlist.'),
  songSuggestions: z.array(z.string()).describe('A list of song suggestions for the playlist.'),
});
export type GeneratePlaylistOutput = z.infer<typeof GeneratePlaylistOutputSchema>;

export async function generatePlaylist(input: GeneratePlaylistInput): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

const generatePlaylistPrompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: GeneratePlaylistOutputSchema},
  prompt: `You are a playlist generation expert. You will generate a playlist description and song suggestions based on the mood and genre provided.

  Mood: {{{mood}}}
  Genre: {{{genre}}}

  Description:
  {{ playlistDescription }}

  Songs:
  {{#each songSuggestions}}
  - {{this}}
  {{/each}}`,
});

const generatePlaylistFlow = ai.defineFlow(
  {
    name: 'generatePlaylistFlow',
    inputSchema: GeneratePlaylistInputSchema,
    outputSchema: GeneratePlaylistOutputSchema,
  },
  async input => {
    const {output} = await generatePlaylistPrompt(input);
    return output!;
  }
);
