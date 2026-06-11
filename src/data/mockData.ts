import type { DraftPick, LeagueSettings, Player, Team } from "../types";

export const leagueSettings: LeagueSettings = {
  teams: 12,
  rounds: 16,
  rosterSlots: {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    FLEX: 1,
    K: 1,
    DEF: 1,
    BN: 7,
  },
};

export const players: Player[] = [
  { id: "p1", name: "Christian McCaffrey", team: "SF", position: "RB", bye: 14, adp: 1.8, projection: 286, floor: 220, ceiling: 335, risk: 42, volatility: 28, age: 30, role: "bell cow", notes: "Elite weekly advantage when healthy." },
  { id: "p2", name: "CeeDee Lamb", team: "DAL", position: "WR", bye: 10, adp: 2.5, projection: 276, floor: 225, ceiling: 325, risk: 20, volatility: 19, age: 27, role: "target hog", notes: "Premium half-PPR profile with huge target share." },
  { id: "p3", name: "Ja'Marr Chase", team: "CIN", position: "WR", bye: 12, adp: 3.2, projection: 271, floor: 210, ceiling: 330, risk: 25, volatility: 24, age: 26, role: "alpha WR", notes: "Week-winning ceiling with stable route volume." },
  { id: "p4", name: "Bijan Robinson", team: "ATL", position: "RB", bye: 5, adp: 4.4, projection: 269, floor: 205, ceiling: 328, risk: 27, volatility: 22, age: 24, role: "feature back", notes: "Explosive dual-threat usage." },
  { id: "p5", name: "Justin Jefferson", team: "MIN", position: "WR", bye: 6, adp: 5.0, projection: 265, floor: 208, ceiling: 320, risk: 24, volatility: 22, age: 27, role: "alpha WR", notes: "Elite separator with massive target ceiling." },
  { id: "p6", name: "Breece Hall", team: "NYJ", position: "RB", bye: 9, adp: 6.6, projection: 258, floor: 195, ceiling: 318, risk: 31, volatility: 26, age: 25, role: "explosive RB1", notes: "Home-run runner with receiving outs." },
  { id: "p7", name: "Amon-Ra St. Brown", team: "DET", position: "WR", bye: 8, adp: 7.4, projection: 252, floor: 215, ceiling: 292, risk: 14, volatility: 14, age: 26, role: "slot engine", notes: "Safe reception volume translates to half-PPR floor." },
  { id: "p8", name: "A.J. Brown", team: "PHI", position: "WR", bye: 9, adp: 8.6, projection: 241, floor: 185, ceiling: 305, risk: 23, volatility: 27, age: 29, role: "alpha WR", notes: "Ceiling spikes when Eagles lean pass-heavy." },
  { id: "p9", name: "Saquon Barkley", team: "PHI", position: "RB", bye: 9, adp: 9.3, projection: 239, floor: 178, ceiling: 300, risk: 35, volatility: 25, age: 29, role: "feature back", notes: "Workload and offense create touchdown access." },
  { id: "p10", name: "Puka Nacua", team: "LAR", position: "WR", bye: 11, adp: 10.2, projection: 237, floor: 190, ceiling: 285, risk: 23, volatility: 20, age: 25, role: "volume WR", notes: "Strong route participation and YAC profile." },
  { id: "p11", name: "Jonathan Taylor", team: "IND", position: "RB", bye: 11, adp: 11.8, projection: 232, floor: 172, ceiling: 294, risk: 32, volatility: 26, age: 27, role: "early-down hammer", notes: "Touchdown and rushing volume bet." },
  { id: "p12", name: "Garrett Wilson", team: "NYJ", position: "WR", bye: 9, adp: 12.5, projection: 226, floor: 175, ceiling: 288, risk: 28, volatility: 25, age: 26, role: "alpha WR", notes: "Breakout path if passing efficiency rises." },
  { id: "p13", name: "Jahmyr Gibbs", team: "DET", position: "RB", bye: 8, adp: 13.2, projection: 226, floor: 171, ceiling: 285, risk: 29, volatility: 24, age: 24, role: "space back", notes: "Efficient touches and receiving juice." },
  { id: "p14", name: "Marvin Harrison Jr.", team: "ARI", position: "WR", bye: 8, adp: 15.1, projection: 214, floor: 160, ceiling: 286, risk: 38, volatility: 30, age: 24, role: "ascending WR1", notes: "Aggressive mode loves the ceiling profile." },
  { id: "p15", name: "Drake London", team: "ATL", position: "WR", bye: 5, adp: 18.0, projection: 210, floor: 158, ceiling: 275, risk: 32, volatility: 26, age: 25, role: "contested alpha", notes: "Target dominance bet with room for growth." },
  { id: "p16", name: "De'Von Achane", team: "MIA", position: "RB", bye: 12, adp: 20.5, projection: 205, floor: 130, ceiling: 292, risk: 48, volatility: 43, age: 24, role: "explosive committee", notes: "High variance but breaks weeks open." },
  { id: "p17", name: "Kyren Williams", team: "LAR", position: "RB", bye: 11, adp: 22.0, projection: 204, floor: 155, ceiling: 258, risk: 37, volatility: 23, age: 26, role: "volume RB", notes: "Usage-driven RB2/RB1 path." },
  { id: "p18", name: "Chris Olave", team: "NO", position: "WR", bye: 11, adp: 23.7, projection: 198, floor: 154, ceiling: 252, risk: 24, volatility: 21, age: 26, role: "field stretcher", notes: "Efficiency can swing weekly value." },
  { id: "p19", name: "Travis Etienne Jr.", team: "JAX", position: "RB", bye: 12, adp: 24.5, projection: 197, floor: 150, ceiling: 249, risk: 30, volatility: 22, age: 27, role: "workhorse RB", notes: "Solid pick when RB scarcity climbs." },
  { id: "p20", name: "Nico Collins", team: "HOU", position: "WR", bye: 14, adp: 26.0, projection: 196, floor: 148, ceiling: 265, risk: 29, volatility: 28, age: 27, role: "explosive WR", notes: "Strong aggressive target after early RB start." },
  { id: "p21", name: "Josh Allen", team: "BUF", position: "QB", bye: 7, adp: 28.5, projection: 328, floor: 285, ceiling: 382, risk: 13, volatility: 18, age: 30, role: "elite QB", notes: "Difference-maker if QB run starts." },
  { id: "p22", name: "Jalen Hurts", team: "PHI", position: "QB", bye: 9, adp: 31.0, projection: 319, floor: 274, ceiling: 370, risk: 16, volatility: 18, age: 28, role: "rushing QB", notes: "Rushing touchdowns preserve floor." },
  { id: "p23", name: "Sam LaPorta", team: "DET", position: "TE", bye: 8, adp: 33.5, projection: 190, floor: 145, ceiling: 240, risk: 20, volatility: 19, age: 25, role: "elite TE", notes: "Scarcity lever if TE tier is about to end." },
  { id: "p24", name: "Travis Kelce", team: "KC", position: "TE", bye: 10, adp: 35.2, projection: 184, floor: 138, ceiling: 230, risk: 34, volatility: 22, age: 36, role: "veteran TE1", notes: "Safe mode discounts age and durability." },
  { id: "p25", name: "Trey McBride", team: "ARI", position: "TE", bye: 8, adp: 44.0, projection: 177, floor: 132, ceiling: 228, risk: 25, volatility: 20, age: 26, role: "volume TE", notes: "Clean fit when WR/RB tiers are flat." },
  { id: "p26", name: "Lamar Jackson", team: "BAL", position: "QB", bye: 7, adp: 36.0, projection: 312, floor: 262, ceiling: 372, risk: 22, volatility: 22, age: 29, role: "rushing QB", notes: "Aggressive QB edge with weekly ceiling." },
  { id: "p27", name: "DK Metcalf", team: "SEA", position: "WR", bye: 10, adp: 41.5, projection: 181, floor: 134, ceiling: 244, risk: 28, volatility: 29, age: 28, role: "vertical WR", notes: "Best ball-style spike weeks, still usable in managed." },
  { id: "p28", name: "James Cook", team: "BUF", position: "RB", bye: 7, adp: 39.8, projection: 185, floor: 140, ceiling: 238, risk: 31, volatility: 21, age: 26, role: "receiving RB", notes: "Half-PPR value depends on touchdown share." },
  { id: "p29", name: "Tank Dell", team: "HOU", position: "WR", bye: 14, adp: 52.0, projection: 168, floor: 112, ceiling: 240, risk: 43, volatility: 37, age: 26, role: "field stretcher", notes: "Aggressive queue target when chasing upside." },
  { id: "p30", name: "Rachaad White", team: "TB", position: "RB", bye: 9, adp: 48.5, projection: 176, floor: 135, ceiling: 225, risk: 33, volatility: 20, age: 27, role: "volume RB", notes: "Safe volume if efficiency is priced in." },
  { id: "p31", name: "George Pickens", team: "PIT", position: "WR", bye: 5, adp: 55.5, projection: 165, floor: 108, ceiling: 238, risk: 41, volatility: 36, age: 25, role: "jump-ball WR", notes: "Ceiling pick with weekly volatility." },
  { id: "p32", name: "Zay Flowers", team: "BAL", position: "WR", bye: 7, adp: 50.0, projection: 171, floor: 130, ceiling: 220, risk: 27, volatility: 22, age: 25, role: "motion WR", notes: "Useful stabilizer after risky early picks." },
  { id: "p33", name: "Jayden Daniels", team: "WAS", position: "QB", bye: 12, adp: 63.0, projection: 292, floor: 224, ceiling: 360, risk: 40, volatility: 32, age: 25, role: "rushing QB", notes: "Aggressive model loves the rushing ceiling." },
  { id: "p34", name: "Brock Bowers", team: "LV", position: "TE", bye: 8, adp: 58.0, projection: 162, floor: 116, ceiling: 218, risk: 34, volatility: 25, age: 23, role: "hybrid TE", notes: "Upside TE once elite tier is gone." },
  { id: "p35", name: "Jordan Addison", team: "MIN", position: "WR", bye: 6, adp: 72.0, projection: 152, floor: 102, ceiling: 215, risk: 36, volatility: 31, age: 24, role: "WR2", notes: "Bench upside when starters are filled." },
  { id: "p36", name: "Brian Robinson Jr.", team: "WAS", position: "RB", bye: 12, adp: 68.0, projection: 158, floor: 118, ceiling: 204, risk: 28, volatility: 20, age: 27, role: "early-down RB", notes: "Floor back when RB room needs stability." }
];

export const initialTeams: Team[] = [
  { rosterId: 1, slot: 1, name: "Goal Line Guild", manager: "Ari", picks: ["p2", "p20"] },
  { rosterId: 2, slot: 2, name: "Fourth & Forever", manager: "Mina", picks: ["p4", "p13"] },
  { rosterId: 3, slot: 3, name: "The Motion Men", manager: "Theo", picks: ["p3", "p21"] },
  { rosterId: 4, slot: 4, name: "Hashmark Heroes", manager: "Cam", picks: ["p6", "p18"] },
  { rosterId: 5, slot: 5, name: "Red Zone Royalty", manager: "Jules", picks: ["p5", "p17"] },
  { rosterId: 6, slot: 6, name: "Blitz Bureau", manager: "Noah", picks: ["p7", "p19"] },
  { rosterId: 7, slot: 7, name: "Sunday Syndicate", manager: "Kai", picks: ["p9", "p12"] },
  { rosterId: 8, slot: 8, name: "Your War Room", manager: "You", picks: ["p1", "p15"] },
  { rosterId: 9, slot: 9, name: "Stack Attack", manager: "Liv", picks: ["p11", "p16"] },
  { rosterId: 10, slot: 10, name: "Route Technicians", manager: "Sam", picks: ["p10", "p14"] },
  { rosterId: 11, slot: 11, name: "Pocket Presence", manager: "Ezra", picks: ["p8", "p22"] },
  { rosterId: 12, slot: 12, name: "Waiver Wolves", manager: "Remy", picks: ["p23", "p28"] }
];

export const initialPicks: DraftPick[] = initialTeams.flatMap((team) =>
  team.picks.map((playerId, index) => {
    const player = players.find((candidate) => candidate.id === playerId);
    const round = index + 1;
    const pickNo = round % 2 === 1
      ? (round - 1) * leagueSettings.teams + team.slot
      : round * leagueSettings.teams - team.slot + 1;

    return {
      pickNo,
      round,
      draftSlot: team.slot,
      rosterId: team.rosterId,
      playerId,
      playerName: player?.name,
      position: player?.position,
    };
  }),
).sort((a, b) => a.pickNo - b.pickNo);
