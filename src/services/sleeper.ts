import type { DraftPick, Position, Team } from "../types";

const SLEEPER_BASE_URL = "https://api.sleeper.app/v1";

interface SleeperDraft {
  draft_id: string;
  status: string;
  type: string;
  settings: {
    teams?: number;
    rounds?: number;
    slots_qb?: number;
    slots_rb?: number;
    slots_wr?: number;
    slots_te?: number;
    slots_flex?: number;
    slots_bn?: number;
    slots_k?: number;
    slots_def?: number;
  };
  draft_order?: Record<string, number>;
  slot_to_roster_id?: Record<string, number>;
}

interface SleeperPick {
  player_id: string;
  roster_id?: string | number;
  round: number;
  draft_slot: number;
  pick_no: number;
  metadata?: {
    first_name?: string;
    last_name?: string;
    position?: Position;
    team?: string;
  };
}

interface SleeperUser {
  user_id: string;
  display_name?: string;
  username?: string;
  metadata?: {
    team_name?: string;
  };
}

export async function fetchLeagueDrafts(leagueId: string): Promise<SleeperDraft[]> {
  return fetchJson(`${SLEEPER_BASE_URL}/league/${leagueId}/drafts`);
}

export async function fetchDraft(draftId: string): Promise<SleeperDraft> {
  return fetchJson(`${SLEEPER_BASE_URL}/draft/${draftId}`);
}

export async function fetchDraftPicks(draftId: string): Promise<DraftPick[]> {
  const picks = await fetchJson<SleeperPick[]>(`${SLEEPER_BASE_URL}/draft/${draftId}/picks`);

  return picks.map((pick) => ({
    pickNo: pick.pick_no,
    round: pick.round,
    draftSlot: pick.draft_slot,
    rosterId: Number(pick.roster_id ?? pick.draft_slot),
    playerId: pick.player_id,
    playerName: [pick.metadata?.first_name, pick.metadata?.last_name].filter(Boolean).join(" "),
    position: pick.metadata?.position,
  }));
}

export async function fetchLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
  return fetchJson(`${SLEEPER_BASE_URL}/league/${leagueId}/users`);
}

export async function loadSleeperDraftContext(leagueId: string) {
  const drafts = await fetchLeagueDrafts(leagueId);
  const draft = drafts[0];

  if (!draft) {
    throw new Error("No Sleeper drafts found for that league.");
  }

  const [draftDetails, picks, users] = await Promise.all([
    fetchDraft(draft.draft_id),
    fetchDraftPicks(draft.draft_id),
    fetchLeagueUsers(leagueId),
  ]);

  const teams = buildTeamsFromSleeper(draftDetails, users, picks);
  return { draft: draftDetails, picks, teams };
}

function buildTeamsFromSleeper(draft: SleeperDraft, users: SleeperUser[], picks: DraftPick[]): Team[] {
  const slotEntries = Object.entries(draft.slot_to_roster_id ?? {});
  const userBySlot = new Map(
    Object.entries(draft.draft_order ?? {}).map(([userId, slot]) => [slot, users.find((user) => user.user_id === userId)]),
  );

  return slotEntries.map(([slotKey, rosterId]) => {
    const slot = Number(slotKey);
    const user = userBySlot.get(slot);

    return {
      rosterId: Number(rosterId),
      slot,
      name: user?.metadata?.team_name || user?.display_name || `Slot ${slot}`,
      manager: user?.display_name || user?.username || "Sleeper manager",
      picks: picks.filter((pick) => pick.rosterId === Number(rosterId)).map((pick) => pick.playerId),
    };
  }).sort((a, b) => a.slot - b.slot);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Sleeper request failed: ${response.status}`);
  }

  return response.json();
}
