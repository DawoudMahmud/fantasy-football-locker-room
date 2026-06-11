import { Bot, Check, ChevronDown, Clock, Cloud, Crosshair, ListFilter, RefreshCw, Search, Shield, Swords, Target, Trophy, Wifi, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { initialPicks, initialTeams, leagueSettings, players } from "./data/mockData";
import { calculateTeamNeeds, enrichTeamsWithPicks, getAvailablePlayers, getCurrentPick, getSlotForPick, getUpcomingPicksUntilMine, recommendPlayers } from "./model/draftModel";
import { fetchDraftPicks, loadSleeperDraftContext } from "./services/sleeper";
import type { DraftMode, DraftPick, Position, Recommendation, Team } from "./types";

const modeCopy: Record<DraftMode, { title: string; icon: LucideIcon; description: string }> = {
  safe: { title: "Safe", icon: Shield, description: "Floor, role stability, lower volatility" },
  balanced: { title: "Intermediate", icon: Target, description: "Need, value, scarcity, upside" },
  aggressive: { title: "Aggressive", icon: Swords, description: "Ceiling, runs, and market pressure" },
};

const positions: Array<Position | "ALL"> = ["ALL", "QB", "RB", "WR", "TE"];
const userRosterId = 8;

export function App() {
  const [mode, setMode] = useState<DraftMode>("balanced");
  const [picks, setPicks] = useState<DraftPick[]>(initialPicks);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position | "ALL">("ALL");
  const [leagueId, setLeagueId] = useState("");
  const [draftId, setDraftId] = useState("");
  const [syncState, setSyncState] = useState<"mock" | "syncing" | "live" | "error">("mock");
  const [syncMessage, setSyncMessage] = useState("Mock draft loaded");

  const hydratedTeams = useMemo(() => enrichTeamsWithPicks(teams, picks), [teams, picks]);
  const currentPick = useMemo(() => getCurrentPick(leagueSettings.teams, picks), [picks]);
  const available = useMemo(() => getAvailablePlayers(players, picks), [picks]);
  const recommendations = useMemo(() => recommendPlayers({
    players,
    teams: hydratedTeams,
    picks,
    settings: leagueSettings,
    userRosterId,
    mode,
  }), [hydratedTeams, mode, picks]);

  const userTeam = hydratedTeams.find((team) => team.rosterId === userRosterId) ?? hydratedTeams[0];
  const currentSlot = getSlotForPick(currentPick.pickNo, leagueSettings.teams);
  const upcomingPickNos = getUpcomingPicksUntilMine(userTeam.slot, leagueSettings.teams, picks);
  const teamNeeds = calculateTeamNeeds(userTeam, players, leagueSettings);
  const filteredPlayers = available
    .filter((player) => position === "ALL" || player.position === position)
    .filter((player) => `${player.name} ${player.team} ${player.position}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.adp - b.adp)
    .slice(0, 16);

  useEffect(() => {
    if (!draftId || syncState !== "live") return;

    const interval = window.setInterval(async () => {
      try {
        const nextPicks = await fetchDraftPicks(draftId);
        setPicks(mergeSleeperPicks(nextPicks));
        setSyncMessage(`Live sync updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
      } catch (error) {
        setSyncState("error");
        setSyncMessage(error instanceof Error ? error.message : "Sleeper sync failed");
      }
    }, 8000);

    return () => window.clearInterval(interval);
  }, [draftId, syncState]);

  async function connectSleeperDraft() {
    if (!leagueId.trim()) {
      setSyncState("error");
      setSyncMessage("Enter a Sleeper league ID to connect.");
      return;
    }

    try {
      setSyncState("syncing");
      setSyncMessage("Finding the latest Sleeper draft...");
      const context = await loadSleeperDraftContext(leagueId.trim());
      setDraftId(context.draft.draft_id);
      setTeams(context.teams.length ? context.teams : initialTeams);
      setPicks(mergeSleeperPicks(context.picks));
      setSyncState("live");
      setSyncMessage(`Connected to draft ${context.draft.draft_id}`);
    } catch (error) {
      setSyncState("error");
      setSyncMessage(error instanceof Error ? error.message : "Could not connect to Sleeper.");
    }
  }

  function draftMockPlayer(playerId: string) {
    const player = players.find((candidate) => candidate.id === playerId);
    if (!player || picks.some((pick) => pick.playerId === playerId)) return;

    const nextPick = getCurrentPick(leagueSettings.teams, picks);
    const roster = hydratedTeams.find((team) => team.slot === nextPick.slot);
    setPicks((current) => [...current, {
      pickNo: nextPick.pickNo,
      round: nextPick.round,
      draftSlot: nextPick.slot,
      rosterId: roster?.rosterId ?? nextPick.slot,
      playerId: player.id,
      playerName: player.name,
      position: player.position,
    }]);
  }

  function resetMockDraft() {
    setPicks(initialPicks);
    setTeams(initialTeams);
    setDraftId("");
    setSyncState("mock");
    setSyncMessage("Mock draft loaded");
  }

  return (
    <main className="appShell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Fantasy GM Draft Dashboard</p>
          <h1>Draft War Room</h1>
        </div>
        <div className={`syncPill ${syncState}`}>
          <Wifi size={16} />
          <span>{syncMessage}</span>
        </div>
      </section>

      <section className="commandBand">
        <div className="draftStatus">
          <div className="statusTile">
            <span>On Clock</span>
            <strong>Pick {currentPick.pickNo}</strong>
            <small>Round {currentPick.round}, slot {currentSlot}</small>
          </div>
          <div className="statusTile">
            <span>Your Next Window</span>
            <strong>{upcomingPickNos.length} picks</strong>
            <small>{upcomingPickNos.slice(0, 5).map((pick) => `#${pick}`).join(" ")}</small>
          </div>
          <div className="statusTile">
            <span>Available Pool</span>
            <strong>{available.length}</strong>
            <small>Players after drafted filter</small>
          </div>
        </div>

        <div className="sleeperPanel">
          <label htmlFor="leagueId">Sleeper league ID</label>
          <div>
            <input id="leagueId" value={leagueId} onChange={(event) => setLeagueId(event.target.value)} placeholder="Example: 112233445566" />
            <button type="button" onClick={connectSleeperDraft} disabled={syncState === "syncing"}>
              <Cloud size={16} />
              {syncState === "syncing" ? "Syncing" : "Connect"}
            </button>
            <button type="button" className="ghostButton" onClick={resetMockDraft}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="modeStrip" aria-label="Draft mode">
        {Object.entries(modeCopy).map(([key, item]) => {
          const Icon = item.icon;
          return (
            <button key={key} type="button" className={mode === key ? "active" : ""} onClick={() => setMode(key as DraftMode)}>
              <Icon size={18} />
              <span>{item.title}</span>
              <small>{item.description}</small>
            </button>
          );
        })}
      </section>

      <section className="layoutGrid">
        <aside className="leftRail">
          <PanelTitle icon={Trophy} title="Your Build" />
          <RosterStack team={userTeam} />
          <div className="needList">
            {teamNeeds.filter((need) => ["QB", "RB", "WR", "TE"].includes(need.position)).map((need) => (
              <div key={need.position} className="needRow">
                <span>{need.position}</span>
                <div className="meter"><i style={{ width: `${need.score}%` }} /></div>
                <strong>{need.label}</strong>
              </div>
            ))}
          </div>

          <PanelTitle icon={Clock} title="Teams Before You" />
          <div className="teamQueue">
            {upcomingPickNos.slice(0, 8).map((pickNo) => {
              const slot = getSlotForPick(pickNo, leagueSettings.teams);
              const team = hydratedTeams.find((candidate) => candidate.slot === slot);
              const needs = team ? calculateTeamNeeds(team, players, leagueSettings).filter((need) => ["RB", "WR", "QB", "TE"].includes(need.position)).sort((a, b) => b.score - a.score).slice(0, 2) : [];
              return (
                <div key={pickNo} className={slot === userTeam.slot ? "queueRow mine" : "queueRow"}>
                  <span>#{pickNo}</span>
                  <strong>{team?.name ?? `Slot ${slot}`}</strong>
                  <small>{needs.map((need) => need.position).join(" / ") || "balanced"}</small>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="recommendationColumn">
          <PanelTitle icon={Bot} title="Draft Strategy AI" />
          <div className="recommendationList">
            {recommendations.slice(0, 7).map((recommendation) => (
              <RecommendationCard key={recommendation.player.id} recommendation={recommendation} onDraft={draftMockPlayer} syncState={syncState} />
            ))}
          </div>
        </section>

        <section className="boardColumn">
          <div className="boardHeader">
            <PanelTitle icon={ListFilter} title="Available Draft Board" />
            <div className="filters">
              <div className="searchBox">
                <Search size={16} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search player, team, position" />
              </div>
              <select value={position} onChange={(event) => setPosition(event.target.value as Position | "ALL")}>
                {positions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <div className="draftTable">
            <div className="tableHead">
              <span>Player</span>
              <span>Pos</span>
              <span>ADP</span>
              <span>Proj</span>
              <span>Risk</span>
            </div>
            {filteredPlayers.map((player) => (
              <button key={player.id} className="playerRow" type="button" onClick={() => draftMockPlayer(player.id)} disabled={syncState === "live"}>
                <span>
                  <strong>{player.name}</strong>
                  <small>{player.team} · bye {player.bye} · {player.role}</small>
                </span>
                <b className={`pos ${player.position}`}>{player.position}</b>
                <span>{player.adp.toFixed(1)}</span>
                <span>{player.projection}</span>
                <span>{player.risk}</span>
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function RecommendationCard({ recommendation, onDraft, syncState }: { recommendation: Recommendation; onDraft: (playerId: string) => void; syncState: string }) {
  return (
    <article className="recCard">
      <div className="recTop">
        <div>
          <p>{recommendation.action}</p>
          <h2>{recommendation.player.name}</h2>
          <small>{recommendation.player.team} · {recommendation.player.position} · bye {recommendation.player.bye}</small>
        </div>
        <div className="grade">{recommendation.grade}</div>
      </div>
      <div className="scoreGrid">
        <Score label="Fit" value={recommendation.rosterFit} />
        <Score label="Upside" value={recommendation.upside} />
        <Score label="Risk" value={recommendation.riskScore} />
        <Score label="Scarcity" value={recommendation.scarcity} />
        <Score label="Survive" value={recommendation.survivalChance} />
        <Score label="Replace" value={recommendation.replacementValue} />
      </div>
      <ul>
        {recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
      <button type="button" onClick={() => onDraft(recommendation.player.id)} disabled={syncState === "live"}>
        <Check size={16} />
        Mock draft pick
      </button>
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RosterStack({ team }: { team: Team }) {
  const rosterPlayers = team.picks.map((id) => players.find((player) => player.id === id)).filter(Boolean);

  return (
    <div className="rosterStack">
      <h2>{team.name}</h2>
      {rosterPlayers.map((player) => (
        <div key={player!.id} className="rosterPlayer">
          <b className={`pos ${player!.position}`}>{player!.position}</b>
          <span>{player!.name}</span>
        </div>
      ))}
    </div>
  );
}

function PanelTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="panelTitle">
      <Icon size={17} />
      <h2>{title}</h2>
      <ChevronDown size={15} />
    </div>
  );
}

function mergeSleeperPicks(sleeperPicks: DraftPick[]) {
  const mapped = sleeperPicks.map((pick) => {
    const localPlayer = players.find((player) => player.id === pick.playerId || player.name === pick.playerName);
    return {
      ...pick,
      playerId: localPlayer?.id ?? pick.playerId,
      playerName: localPlayer?.name ?? pick.playerName,
      position: localPlayer?.position ?? pick.position,
    };
  });

  return mapped.sort((a, b) => a.pickNo - b.pickNo);
}
