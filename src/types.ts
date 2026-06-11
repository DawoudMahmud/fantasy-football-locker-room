export type Position = "QB" | "RB" | "WR" | "TE" | "K" | "DEF";

export type DraftMode = "safe" | "balanced" | "aggressive";

export type DraftAction = "Draft now" | "Queue" | "Wait" | "Avoid";

export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  bye: number;
  adp: number;
  projection: number;
  floor: number;
  ceiling: number;
  risk: number;
  volatility: number;
  age: number;
  role: string;
  notes: string;
}

export interface Team {
  rosterId: number;
  slot: number;
  name: string;
  manager: string;
  picks: string[];
}

export interface DraftPick {
  pickNo: number;
  round: number;
  draftSlot: number;
  rosterId: number;
  playerId: string;
  playerName?: string;
  position?: Position;
}

export interface LeagueSettings {
  teams: number;
  rounds: number;
  rosterSlots: Record<Position | "FLEX" | "BN", number>;
}

export interface Recommendation {
  player: Player;
  grade: number;
  rosterFit: number;
  upside: number;
  riskScore: number;
  scarcity: number;
  byeImpact: number;
  replacementValue: number;
  survivalChance: number;
  action: DraftAction;
  reasons: string[];
}

export interface PositionNeed {
  position: Position;
  score: number;
  label: string;
}
