import { Rank, getXPProgress, getRankTierColor, RANKS } from "@/lib/ranks";
import { Progress } from "@/components/ui/progress";

interface RankProgressProps {
  rank: Rank;
  xp: number;
  showLabels?: boolean;
}

export function RankProgress({ rank, xp, showLabels = true }: RankProgressProps) {
  const progress = getXPProgress(xp);
  const nextRank = RANKS.find(r => r.id === rank.id + 1);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">
            {xp} XP
          </span>
          {nextRank && (
            <span className="text-xs text-muted-foreground">
              {nextRank.minXP} XP
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <Progress 
          value={progress.percentage} 
          className="h-2 bg-secondary"
        />
        <div 
          className={`absolute inset-0 h-2 rounded-full bg-gradient-to-r ${getRankTierColor(rank.tier)} opacity-80`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      {showLabels && nextRank && (
        <p className="text-xs text-center text-muted-foreground mt-1">
          {progress.needed - progress.current} XP para {nextRank.name}
        </p>
      )}
    </div>
  );
}
