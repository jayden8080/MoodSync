"use client";

import { useApp } from '@/contexts/app-context';

interface MoodCardProps {
  emoji: string;
  name: string;
  description: string;
  moodKey: string;
}

const MoodCard: React.FC<MoodCardProps> = ({ emoji, name, description, moodKey }) => {
    const { suggestMood } = useApp();
    return (
        <div
            onClick={() => suggestMood(moodKey)}
            className="bg-gradient-to-br from-[#282828] to-[#1a1a1a] p-5 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary hover:shadow-lg hover:shadow-primary/20"
        >
            <div className="text-4xl mb-3" aria-hidden="true">{emoji}</div>
            <div className="font-bold text-lg text-white mb-1">{name}</div>
            <div className="text-muted-foreground text-sm">{description}</div>
        </div>
    );
};

export default function WelcomeScreen() {
    const moodCardsData: MoodCardProps[] = [
        { emoji: '😊', name: 'Happy', description: 'Upbeat and energetic tracks', moodKey: 'happy' },
        { emoji: '😌', name: 'Chill', description: 'Relaxing and mellow vibes', moodKey: 'chill' },
        { emoji: '🎯', name: 'Focused', description: 'Perfect for work and study', moodKey: 'focused' },
        { emoji: '🌅', name: 'Nostalgic', description: 'Throwback classics', moodKey: 'nostalgic' },
        { emoji: '⚡', name: 'Energetic', description: 'High-energy workout music', moodKey: 'energetic' },
        { emoji: '💕', name: 'Romantic', description: 'Love songs and ballads', moodKey: 'romantic' },
    ];

  return (
    <div className="text-center max-w-4xl mx-auto">
      <header className="my-12 sm:my-24">
        <h2 className="text-5xl md:text-6xl font-headline font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">Welcome to VibeSync</h2>
        <p className="text-muted-foreground text-lg">Tell me how you're feeling and I'll find the perfect music for you</p>
      </header>

      <main className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {moodCardsData.map((card) => (
          <MoodCard key={card.moodKey} {...card} />
        ))}
      </main>
    </div>
  );
}
