export type RankTier = 'silver' | 'gold' | 'guardian' | 'eagle' | 'supreme' | 'global';

export interface Rank {
  id: number;
  name: string;
  shortName: string;
  tier: RankTier;
  minXP: number;
  maxXP: number;
}

export const RANKS: Rank[] = [
  { id: 1, name: "Prata I", shortName: "S1", tier: "silver", minXP: 0, maxXP: 99 },
  { id: 2, name: "Prata II", shortName: "S2", tier: "silver", minXP: 100, maxXP: 249 },
  { id: 3, name: "Prata III", shortName: "S3", tier: "silver", minXP: 250, maxXP: 449 },
  { id: 4, name: "Prata IV", shortName: "S4", tier: "silver", minXP: 450, maxXP: 699 },
  { id: 5, name: "Prata Elite", shortName: "SE", tier: "silver", minXP: 700, maxXP: 999 },
  { id: 6, name: "Prata Elite Mestre", shortName: "SEM", tier: "silver", minXP: 1000, maxXP: 1399 },
  { id: 7, name: "Ouro I", shortName: "G1", tier: "gold", minXP: 1400, maxXP: 1899 },
  { id: 8, name: "Ouro II", shortName: "G2", tier: "gold", minXP: 1900, maxXP: 2499 },
  { id: 9, name: "Ouro III", shortName: "G3", tier: "gold", minXP: 2500, maxXP: 3199 },
  { id: 10, name: "Ouro Mestre", shortName: "GM", tier: "gold", minXP: 3200, maxXP: 3999 },
  { id: 11, name: "Guardião I", shortName: "MG1", tier: "guardian", minXP: 4000, maxXP: 4999 },
  { id: 12, name: "Guardião II", shortName: "MG2", tier: "guardian", minXP: 5000, maxXP: 6199 },
  { id: 13, name: "Guardião Mestre", shortName: "MGE", tier: "guardian", minXP: 6200, maxXP: 7599 },
  { id: 14, name: "Águia I", shortName: "DMG", tier: "eagle", minXP: 7600, maxXP: 9199 },
  { id: 15, name: "Águia II", shortName: "LE", tier: "eagle", minXP: 9200, maxXP: 10999 },
  { id: 16, name: "Águia Mestre", shortName: "LEM", tier: "eagle", minXP: 11000, maxXP: 12999 },
  { id: 17, name: "Supremo", shortName: "SMFC", tier: "supreme", minXP: 13000, maxXP: 15499 },
  { id: 18, name: "Global Elite", shortName: "GE", tier: "global", minXP: 15500, maxXP: Infinity },
];

export function getRankByXP(xp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const rank = getRankByXP(xp);
  const nextRank = RANKS.find(r => r.id === rank.id + 1);
  
  if (!nextRank) {
    return { current: xp - rank.minXP, needed: 0, percentage: 100 };
  }
  
  const current = xp - rank.minXP;
  const needed = nextRank.minXP - rank.minXP;
  const percentage = Math.min((current / needed) * 100, 100);
  
  return { current, needed, percentage };
}

export function getRankTierColor(tier: RankTier): string {
  switch (tier) {
    case 'silver':
      return 'from-slate-400 to-slate-300';
    case 'gold':
      return 'from-yellow-500 to-amber-400';
    case 'guardian':
      return 'from-blue-500 to-cyan-400';
    case 'eagle':
      return 'from-purple-500 to-pink-400';
    case 'supreme':
      return 'from-red-500 to-orange-400';
    case 'global':
      return 'from-yellow-300 via-yellow-500 to-yellow-300';
    default:
      return 'from-slate-400 to-slate-300';
  }
}

export function getRankTierGlow(tier: RankTier): string {
  switch (tier) {
    case 'silver':
      return 'shadow-slate-400/50';
    case 'gold':
      return 'shadow-yellow-500/50';
    case 'guardian':
      return 'shadow-blue-500/50';
    case 'eagle':
      return 'shadow-purple-500/50';
    case 'supreme':
      return 'shadow-red-500/50';
    case 'global':
      return 'shadow-yellow-400/70';
    default:
      return 'shadow-slate-400/50';
  }
}
