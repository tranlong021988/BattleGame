#!/usr/bin/env python3
"""Audit real battle telemetry against the intended unit strength ladder.

This tool is intentionally report-driven. The older wave simulator is useful
for quick screening, but it can drift from the current BattleArmyBrain and
freehunt/ranged-support logic. This script reads real telemetry JSON exports
and reports whether runtime damage/CP follows the design ladder.
"""

from __future__ import annotations

import argparse
import json
import math
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, Iterable, List


DEFAULT_LADDER = [
    "Cavalry",
    "Axeman",
    "Sword",
    "Spear",
    "Archer",
    "Monk",
]


def iter_reports(paths: Iterable[str]):
    for raw in paths:
        path = Path(raw)
        if path.is_dir():
            for child in sorted(path.glob("battle-telemetry-*.json")):
                yield child, json.loads(child.read_text(encoding="utf-8"))
            continue
        yield path, json.loads(path.read_text(encoding="utf-8"))


def get_team0_stats(report: dict) -> Dict[str, dict]:
    result: Dict[str, dict] = {}
    for item in report.get("config", {}).get("unitStats", []):
        if int(item.get("team", -1)) != 0:
            continue
        family = item.get("familyName", "")
        if not family:
            continue
        result[family] = item
    return result


def stat_power(item: dict) -> float:
    count = max(1.0, float(item.get("unitCount", 1)))
    cost = max(1.0, float(item.get("cost", 1)))
    health = max(1.0, float(item.get("health", 1)))
    attack = max(1.0, float(item.get("attack", 1)))
    defense = max(0.0, float(item.get("defense", 0)))
    speed = max(0.0, float(item.get("speed", 0)))
    attack_range = max(0.0, float(item.get("range", 0)))
    damage_radius = max(0.0, float(item.get("damageRadius", 0)))
    interval = (
        max(0.05, float(item.get("attackIntervalMin", 1))) +
        max(0.05, float(item.get("attackIntervalMax", 1)))
    ) * 0.5

    ehp = count * health * (1.0 + defense * 0.045)
    dps = count * attack / interval
    splash = 1.0 + min(0.75, damage_radius * 0.5)
    tempo = 1.0 + min(0.45, speed * 0.045) + min(0.35, max(0.0, attack_range - 0.35) * 0.04)
    return math.sqrt(ehp) * dps * splash * tempo / cost


def aggregate_reports(reports: Iterable[dict]):
    aggregate = defaultdict(Counter)
    winners = Counter()
    reasons = Counter()
    final_cp = defaultdict(list)
    final_alive = defaultdict(list)

    for report in reports:
        result = report.get("result", {})
        winners[result.get("winnerTeam")] += 1
        reasons[result.get("reason", "")] += 1
        for team in report.get("teams", []):
            team_id = int(team.get("team", -1))
            final_cp[team_id].append(float(team.get("combatPoint", 0)))
            final_alive[team_id].append(float(team.get("aliveCount", 0)))

        for unit in report.get("unitTypes", []):
            family = unit.get("familyName", "")
            if not family:
                continue
            bucket = aggregate[family]
            bucket["waves"] += float(unit.get("waveSpawnCount", 0))
            bucket["units"] += float(unit.get("spawnedCount", 0))
            bucket["cp"] += float(unit.get("totalCombatPointSpent", 0))
            bucket["damage"] += float(unit.get("totalDamageDealt", 0))
            bucket["kills"] += float(unit.get("totalKills", 0))
            bucket["deaths"] += float(unit.get("totalDeaths", 0))
            bucket["counterKills"] += float(unit.get("totalCounterKills", 0))
            bucket["aliveEnd"] += float(unit.get("aliveAtEnd", 0))

    return aggregate, winners, reasons, final_cp, final_alive


def print_order(title: str, values: Dict[str, float], ladder: List[str]) -> None:
    print(f"\n{title}:")
    for family in ladder:
        print(f"  {family:8s} {values.get(family, 0.0):8.2f}")

    violations = []
    for left, right in zip(ladder, ladder[1:]):
        if values.get(left, 0.0) <= values.get(right, 0.0):
            violations.append(f"{left}<={right}")
    if violations:
        print("  ORDER FAIL:", ", ".join(violations))
    else:
        print("  order OK")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("reports", nargs="+")
    parser.add_argument(
        "--ladder",
        default=",".join(DEFAULT_LADDER),
        help="Comma-separated intended ladder, strongest to weakest.",
    )
    args = parser.parse_args()

    loaded = list(iter_reports(args.reports))
    if not loaded:
        raise SystemExit("No telemetry reports found.")

    ladder = [item.strip() for item in args.ladder.split(",") if item.strip()]
    reports = [report for _, report in loaded]
    stats = get_team0_stats(reports[-1])
    aggregate, winners, reasons, final_cp, final_alive = aggregate_reports(reports)

    print(f"reports: {len(reports)}")
    print(f"winners: {dict(winners)}")
    print(f"end reasons: {dict(reasons)}")
    for team in sorted(final_cp):
        cp = final_cp[team]
        alive = final_alive[team]
        print(
            f"team {team} final avg: cp={sum(cp)/max(1,len(cp)):.1f}, "
            f"alive={sum(alive)/max(1,len(alive)):.1f}"
        )

    costs = {family: float(stats.get(family, {}).get("cost", 0)) for family in ladder}
    powers = {family: stat_power(stats[family]) for family in ladder if family in stats}
    damage_cp = {
        family: aggregate[family]["damage"] / max(1.0, aggregate[family]["cp"])
        for family in ladder
    }
    spawn_waves = {family: aggregate[family]["waves"] for family in ladder}

    print_order("cost ladder", costs, ladder)
    print_order("stat power/CP ladder", powers, ladder)
    print_order("runtime damage/CP ladder", damage_cp, ladder)

    print("\nruntime detail:")
    print("  Family      waves   units       CP     damage   dmg/CP  kills deaths cKills")
    for family in ladder:
        row = aggregate[family]
        print(
            f"  {family:8s} "
            f"{row['waves']:7.0f} {row['units']:7.0f} {row['cp']:8.0f} "
            f"{row['damage']:10.0f} {damage_cp[family]:8.2f} "
            f"{row['kills']:6.0f} {row['deaths']:6.0f} {row['counterKills']:6.0f}"
        )

    print("\nspawn share:")
    total_waves = sum(spawn_waves.values())
    for family in ladder:
        share = spawn_waves[family] / max(1.0, total_waves) * 100.0
        print(f"  {family:8s} {share:6.2f}%")


if __name__ == "__main__":
    main()
