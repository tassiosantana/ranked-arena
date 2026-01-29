import { Rank, getRankTierColor, getRankTierGlow } from "@/lib/ranks";
import { Shield, Star, Crown, Gem } from "lucide-react";

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function RankBadge({ rank, size = "md", showName = false }: RankBadgeProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  const getTierIcon = () => {
    switch (rank.tier) {
      case 'silver':
        return <Shield size={iconSize[size]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />;
      case 'gold':
        return <Star size={iconSize[size]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />;
      case 'guardian':
        return <Shield size={iconSize[size]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />;
      case 'eagle':
        return <Gem size={iconSize[size]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />;
      case 'supreme':
      case 'global':
        return <Crown size={iconSize[size]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          relative flex items-center justify-center
          ${sizeClasses[size]}
          bg-gradient-to-br ${getRankTierColor(rank.tier)}
          shadow-lg ${getRankTierGlow(rank.tier)}
          font-display font-bold text-black
          transition-all duration-300 hover:scale-110
        `}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
        title={rank.name}
      >
        {getTierIcon()}
        <span className="relative z-10">{rank.shortName}</span>
      </div>
      {showName && (
        <span className="font-semibold text-sm">{rank.name}</span>
      )}
    </div>
  );
}
