import { Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type SongCardProps = {
  title: string;
};

export function SongCard({ title }: SongCardProps) {
  const parts = title.split(' by ');
  const songTitle = parts[0] || "Unknown Title";
  const artist = parts[1] || "Unknown Artist";

  return (
    <Card className="p-4 flex items-center justify-between transition-colors hover:bg-secondary/50">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-lg">
                <Music2 className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="font-semibold text-foreground">{songTitle}</p>
                <p className="text-sm text-muted-foreground">{artist}</p>
            </div>
        </div>
    </Card>
  );
}
