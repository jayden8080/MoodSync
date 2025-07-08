"use client";
import { useApp } from '@/contexts/app-context';
import { Home, History, Music, Heart, Disc, Radar, Shuffle, Mic } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


export default function AppSidebar() {
  const { currentView, setCurrentView } = useApp();
  const { toast } = useToast();

  const handleNavigation = (view: 'home' | 'chat') => {
      // For now, only 'home' is a real view. 'chat' is activated by sending a message.
      if (view === 'home') {
        setCurrentView(view);
      }
  };
  
  const showComingSoon = (feature: string) => {
    toast({
        title: "Coming Soon!",
        description: `${feature} feature will be available soon.`,
      })
  }

  const sidebarItems = [
    { name: 'Home', icon: Home, action: () => handleNavigation('home'), active: currentView === 'home' },
    { name: 'History', icon: History, action: () => showComingSoon('History') },
    { name: 'Your Playlists', icon: Music, action: () => showComingSoon('Playlists') },
    { name: 'Liked Songs', icon: Heart, action: () => showComingSoon('Liked Songs') },
  ];

  const recentlyPlayed = [
      { name: 'Chill Vibes', icon: Disc },
      { name: 'Rock Classics', icon: Disc },
      { name: 'Jazz Essentials', icon: Disc },
      { name: 'Pop Hits', icon: Disc },
  ];

  const madeForYou = [
      { name: 'Discover Weekly', icon: Radar },
      { name: 'Release Radar', icon: Radar },
      { name: 'Daily Mix 1', icon: Shuffle },
      { name: 'Mood Sync Mix', icon: Mic },
  ];

  const SidebarItem = ({ item, active }: { item: { name: string; icon: React.ElementType; action?: () => void}, active?: boolean}) => (
    <div
      onClick={item.action}
      className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors ${
        active ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground hover:text-white'
      }`}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{item.name}</span>
    </div>
  );

  return (
    <aside className="w-64 bg-[#000000] p-4 flex-col gap-8 border-r border-white/10 shrink-0 h-full overflow-y-auto hidden md:flex">
      <nav className='flex flex-col gap-6'>
        <section>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 px-2">Your Library</h3>
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.name} item={item} active={item.active} />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 px-2">Recently Played</h3>
          <div className="flex flex-col gap-1">
            {recentlyPlayed.map((item) => (
              <SidebarItem key={item.name} item={{...item, action: () => showComingSoon(item.name)}} />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 px-2">Made for you</h3>
          <div className="flex flex-col gap-1">
            {madeForYou.map((item) => (
              <SidebarItem key={item.name} item={{...item, action: () => showComingSoon(item.name)}} />
            ))}
          </div>
        </section>
      </nav>
    </aside>
  );
}
