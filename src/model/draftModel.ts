import type { DraftMode, DraftPick, LeagueSettings, Player, Position, PositionNeed, Recommendation, Team } from "../types";

const positionOrder: Position[] = ["QB", "RB", "WR", "TE", "K", "DEF"];

const modeWeights: Record<DraftMode, { floor: number; ceiling: number; risk: number; roster: number; scarcity: number; survive: number }> = {
  safe: { floor: 0.26, ceiling: 0.08, risk: 0.18, roster: 0.24, scarcity: 0.15, survive: 0.09 },
  balanced: { floor: 0.17, ceiling: 0.16, risk: 0.1, roster: 0.24, scarcity: 0.18, survive: 0.15 },
  aggressive: { floor: 0.08, ceiling: 0.27, risk: -0.02, roster: 0.18, scarcity: 0.2, survive: 0.29 },
};

export function enrichTeamsWithPicks(teams: Team[], picks: DraftPick[]): Team[] {
  return teams.map((team) => ({
    ...team,
    picks: picks.filter((pick) => pick.rosterId === team.rosterId).map((pick) => pick.playerId),
  }));
}

export function getCurrentPick(teams: number, picks: DraftPick[]) {
  const pickNo = picks.length + 1;
  const round = Math.ceil(pickNo / teams);
  const slot = getSlotForPick(pickNo, teams);
  return { pickNo, round, slot };
}

export function getSlotForPick(pickNo: number, teams: number) {
  const round = Math.ceil(pickNo / teams);
  const pickInRound = ((pickNo - 1) % teams) + 1;
  return round % 2 === 1 ? pickInRound : teams - pickInRound + 1;
}

export function getUpcomingPicksUntilMine(userSlot: number, teams: number, picks: DraftPick[]) {
  const current = getCurrentPick(teams, picks);
  const upcoming: number[] = [];

  for (let pickNo = current.pickNo; pickNo <= teams * 16; pickNo += 1) {
    const slot = getSlotForPick(pickNo, teams);
    if (pickNo !== current.pickNo && slot === userSlot) break;
    upcoming.push(pickNo);
  }

  return upcoming;
}

export function getAvailablePlayers(players: Player[], picks: DraftPick[]) {
  const drafted = new Set(picks.map((pick) => pick.playerId));
  return players.filter((player) => !drafted.has(player.id));
}

export function recommendPlayers(input: {
  players: Player[];
  teams: Team[];
  picks: DraftPick[];
  settings: LeagueSettings;
  userRosterId: number;
  mode: DraftMode;
}): Recommendation[] {
  const availablePlayers = getAvailablePlayers(input.players, input.picks);
  const userTeam = input.teams.find((team) => team.rosterId === input.userRosterId) ?? input.teams[0];
  const userNeeds = calculateTeamNeeds(userTeam, input.players, input.settings);
  const currentRound = getCurrentPick(input.settings.teams, input.picks).round;
  const upcomingPickNos = getUpcomingPicksUntilMine(userTeam.slot, input.settings.teams, input.picks);
  const upcomingTeams = upcomingPickNos
    .map((pickNo) => input.teams.find((team) => team.slot === getSlotForPick(pickNo, input.settings.teams)))
    .filter(Boolean) as Team[];

  return availablePlayers
    .map((player) => scorePlayer(player, availablePlayers, userNeeds, upcomingTeams, input.players, input.settings, input.mode, currentRound))
    .sort((a, b) => b.grade - a.grade)
    .slice(0, 18);
}

export function calculateTeamNeeds(team: Team, allPlayers: Player[], settings: LeagueSettings): PositionNeed[] {
  const counts = countPositions(team, allPlayers);

  return positionOrder.map((position) => {
    const starterNeed = settings.rosterSlots[position] ?? 0;
    const flexDemand = position === "RB" || position === "WR" || position === "TE" ? settings.rosterSlots.FLEX * 0.45 : 0;
    const benchDemand = position === "RB" || position === "WR" ? 1.2 : position === "TE" || position === "QB" ? 0.35 : 0;
    const target = starterNeed + flexDemand + benchDemand;
    const score = clamp(((target - counts[position]) / Math.max(1, target)) * 100, 0, 100);
    const label = score > 70 ? "urgent" : score > 38 ? "live" : "stable";
    return { position, score, label };
  });
}

export function forecastPositionRun(input: {
  player: Player;
  upcomingTeams: Team[];
  allPlayers: Player[];
  availablePlayers: Player[];
  settings: LeagueSettings;
  currentRound: number;
}) {
  const scarcity = calculateScarcity(input.player, input.availablePlayers);
  const draftPriority = getPositionDraftPriority(input.player.position, input.currentRound);
  const demand = input.upcomingTeams.reduce((sum, team) => {
    const needs = calculateTeamNeeds(team, input.allPlayers, input.settings);
    const need = needs.find((candidate) => candidate.position === input.player.position)?.score ?? 0;
    return sum + (need / 100) * draftPriority;
  }, 0);
  const teamsInWindow = Math.max(1, input.upcomingTeams.length);
  const pressure = clamp((demand / teamsInWindow) * 58 + scarcity * 0.42, 0, 100);

  return {
    pressure,
    survivalChance: clamp(100 - pressure, 3, 96),
  };
}

function scorePlayer(
  player: Player,
  availablePlayers: Player[],
  userNeeds: PositionNeed[],
  upcomingTeams: Team[],
  allPlayers: Player[],
  settings: LeagueSettings,
  mode: DraftMode,
  currentRound: number,
): Recommendation {
  const weights = modeWeights[mode];
  const rosterNeed = userNeeds.find((need) => need.position === player.position)?.score ?? 0;
  const draftPriority = getPositionDraftPriority(player.position, currentRound);
  const rosterFit = rosterNeed * draftPriority;
  const bounds = getPositionBounds(player.position);
  const upside = normalize(player.ceiling, bounds.floorMin, bounds.ceilingMax);
  const floor = normalize(player.floor, bounds.floorMin, bounds.floorMax);
  const riskScore = 100 - player.risk;
  const scarcity = calculateScarcity(player, availablePlayers);
  const replacementValue = calculateReplacementValue(player, availablePlayers);
  const byeImpact = calculateByeImpact(player, allPlayers);
  const { pressure, survivalChance } = forecastPositionRun({ player, upcomingTeams, allPlayers, availablePlayers, settings, currentRound });
  const modeAdjustment = mode === "aggressive" ? player.volatility * 0.18 : mode === "safe" ? (100 - player.volatility) * 0.12 : 8;

  const grade = clamp(
    floor * weights.floor +
      upside * weights.ceiling +
      riskScore * weights.risk +
      rosterFit * weights.roster +
      scarcity * weights.scarcity +
      (100 - survivalChance) * weights.survive +
      replacementValue * 0.16 +
      byeImpact * 0.06 +
      modeAdjustment,
    0,
    99,
  );

  return {
    player,
    grade: Math.round(grade),
    rosterFit: Math.round(rosterFit),
    upside: Math.round(upside),
    riskScore: Math.round(riskScore),
    scarcity: Math.round(scarcity),
    byeImpact: Math.round(byeImpact),
    replacementValue: Math.round(replacementValue),
    survivalChance: Math.round(survivalChance),
    action: getAction(grade, survivalChance, pressure),
    reasons: buildReasons(player, rosterFit, scarcity, survivalChance, mode, pressure),
  };
}

function calculateScarcity(player: Player, availablePlayers: Player[]) {
  const samePosition = availablePlayers
    .filter((candidate) => candidate.position === player.position)
    .sort((a, b) => b.projection - a.projection);
  const rank = samePosition.findIndex((candidate) => candidate.id === player.id) + 1;
  const tierSize = player.position === "TE" || player.position === "QB" ? 4 : 8;
  return clamp(96 - (rank - 1) * (72 / tierSize), 12, 96);
}

function calculateReplacementValue(player: Player, availablePlayers: Player[]) {
  const samePosition = availablePlayers
    .filter((candidate) => candidate.position === player.position)
    .sort((a, b) => b.projection - a.projection);
  const replacementIndex = player.position === "QB" || player.position === "TE" ? 8 : 18;
  const replacement = samePosition[Math.min(replacementIndex, samePosition.length - 1)]?.projection ?? player.projection - 30;
  return clamp((player.projection - replacement + 10) * 2.1, 0, 100);
}

function calculateByeImpact(player: Player, allPlayers: Player[]) {
  const sameTeamByeStars = allPlayers.filter((candidate) => candidate.bye === player.bye && candidate.adp < 36).length;
  return clamp(88 - sameTeamByeStars * 7, 40, 92);
}

function countPositions(team: Team, allPlayers: Player[]) {
  const counts = Object.fromEntries(positionOrder.map((position) => [position, 0])) as Record<Position, number>;
  team.picks.forEach((playerId) => {
    const player = allPlayers.find((candidate) => candidate.id === playerId);
    if (player) counts[player.position] += 1;
  });
  return counts;
}

function getAction(grade: number, survivalChance: number, pressure: number) {
  if (grade > 73 && survivalChance < 48) return "Draft now";
  if (grade > 68 || pressure > 70) return "Queue";
  if (grade < 35) return "Avoid";
  return "Wait";
}

function buildReasons(player: Player, rosterFit: number, scarcity: number, survivalChance: number, mode: DraftMode, pressure: number) {
  const reasons = [];
  if (rosterFit > 65) reasons.push(`${player.position} is a major roster need.`);
  if (scarcity > 72) reasons.push(`${player.position} tier is getting thin.`);
  if (survivalChance < 45) reasons.push(`Only ${Math.round(survivalChance)}% chance he reaches your next pick.`);
  if (pressure > 62) reasons.push(`Teams ahead project to attack ${player.position}.`);
  if (mode === "safe" && player.risk < 30) reasons.push("Safe mode rewards the stable role.");
  if (mode === "aggressive" && player.ceiling - player.floor > 95) reasons.push("Aggressive mode rewards the ceiling gap.");
  if (reasons.length === 0) reasons.push(player.notes);
  return reasons.slice(0, 3);
}

function getPositionDraftPriority(position: Position, round: number) {
  if (position === "RB" || position === "WR") return 1;
  if (position === "TE") return round <= 3 ? 0.74 : round <= 6 ? 0.9 : 1;
  if (position === "QB") return round <= 3 ? 0.5 : round <= 6 ? 0.72 : 1;
  return round <= 12 ? 0.05 : 0.35;
}

function getPositionBounds(position: Position) {
  switch (position) {
    case "QB":
      return { floorMin: 190, floorMax: 315, ceilingMax: 390 };
    case "RB":
      return { floorMin: 95, floorMax: 230, ceilingMax: 340 };
    case "WR":
      return { floorMin: 95, floorMax: 230, ceilingMax: 335 };
    case "TE":
      return { floorMin: 75, floorMax: 165, ceilingMax: 245 };
    default:
      return { floorMin: 50, floorMax: 150, ceilingMax: 220 };
  }
}

function normalize(value: number, min: number, max: number) {
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
