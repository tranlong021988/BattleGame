#!/usr/bin/env python3
"""Random-search balance lab for the tier-1 battle roster.

This tool is intentionally outside the Cocos runtime. It imports the
wave-level simulator, mutates a copy of the current scene stats, runs many
matches, and scores whole-system balance instead of chasing one noisy symptom.
"""

from __future__ import annotations

import argparse
import copy
import math
import random
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Sequence, Tuple

from balance_wave_simulator import (
    FAMILY_IDS,
    FAMILY_NAMES,
    SceneConfig,
    UnitEntry,
    WaveSimulator,
    clamp01,
    load_scene_config,
    run_direct_duel,
)


ACTIVE = ("Axeman", "Cavalry", "Sword", "Spear", "Monk", "Archer")
RANGED = {"Monk", "Archer"}
MELEE = {"Axeman", "Cavalry", "Sword", "Spear"}


@dataclass
class CandidateScore:
    score: float
    win_penalty: float
    economy_penalty: float
    spawn_penalty: float
    counter_penalty: float
    matchup_penalty: float
    notes: List[str]


@dataclass
class MicroDuelResult:
    winner: str
    hp_left_ratio: float
    units_left: int
    duration: float
    damage: Dict[str, float]
    pre_contact_damage: Dict[str, float]


@dataclass
class MicroUnit:
    x: float
    z: float
    hp: float
    cooldown: float


def unique_entries(config: SceneConfig) -> Dict[str, UnitEntry]:
    entries: Dict[str, UnitEntry] = {}
    for entry in config.entries_by_team[0]:
        if entry.family_name in ACTIVE:
            entries[entry.family_name] = entry
    return entries


def family_from_spawn_key(key: object) -> str:
    if isinstance(key, tuple) and len(key) >= 2:
        raw = str(key[1])
    else:
        raw = str(key)
    lowered = raw.lower()
    for family in ACTIVE:
        if family.lower() in lowered:
            return family
    return raw


def formation(count: int, team: int, start_z: float, radius: float) -> List[MicroUnit]:
    per_row = min(5, max(1, count))
    spacing = radius * 2.25
    units: List[MicroUnit] = []
    direction = 1.0 if team == 0 else -1.0
    for i in range(count):
        row = i // per_row
        col = i % per_row
        row_count = min(per_row, count - row * per_row)
        x = (col - (row_count - 1) * 0.5) * spacing
        z = start_z - direction * row * spacing
        units.append(MicroUnit(x=x, z=z, hp=1.0, cooldown=0.0))
    return units


def micro_duel(
    config: SceneConfig,
    a: UnitEntry,
    b: UnitEntry,
    dt: float = 0.05,
    max_time: float = 80.0,
    radius: float = 0.5,
    start_gap: float = 12.0,
) -> MicroDuelResult:
    """Simple unit-level duel to catch range/speed/count/focus-fire effects."""
    units = {
        a.family_name: formation(a.count, 0, 0.0, radius),
        b.family_name: formation(b.count, 1, start_gap, radius),
    }
    entries = {a.family_name: a, b.family_name: b}
    teams = {a.family_name: 0, b.family_name: 1}
    damage = {a.family_name: 0.0, b.family_name: 0.0}
    pre_contact = {a.family_name: 0.0, b.family_name: 0.0}

    for unit in units[a.family_name]:
        unit.hp = a.health
    for unit in units[b.family_name]:
        unit.hp = b.health

    def alive(name: str) -> List[MicroUnit]:
        return [unit for unit in units[name] if unit.hp > 0]

    def dist2(u: MicroUnit, v: MicroUnit) -> float:
        dx = v.x - u.x
        dz = v.z - u.z
        return dx * dx + dz * dz

    def any_melee_contact() -> bool:
        for au in alive(a.family_name):
            for bu in alive(b.family_name):
                if dist2(au, bu) <= (radius * 2.25) ** 2:
                    return True
        return False

    time = 0.0
    while time < max_time and alive(a.family_name) and alive(b.family_name):
        contact = any_melee_contact()
        attacks: List[Tuple[str, MicroUnit, MicroUnit]] = []
        moves: List[Tuple[MicroUnit, float, float]] = []
        for name, other in ((a.family_name, b.family_name), (b.family_name, a.family_name)):
            entry = entries[name]
            enemies = alive(other)
            if not enemies:
                continue
            for unit in alive(name):
                unit.cooldown = max(0.0, unit.cooldown - dt)
                target = min(enemies, key=lambda enemy: dist2(unit, enemy))
                distance = math.sqrt(max(0.0, dist2(unit, target)))
                attack_distance = entry.attack_range + radius * 2.0
                if distance <= attack_distance:
                    if unit.cooldown <= 0.0:
                        attacks.append((name, unit, target))
                        unit.cooldown = max(0.05, entry.attack_interval)
                    continue
                if entry.attack_range > 2.0:
                    # Ranged units kite less in the real game; they mostly hold
                    # their line and shoot once in range.
                    desired = max(0.0, distance - attack_distance)
                else:
                    desired = distance
                if desired <= 0:
                    continue
                step = min(desired, entry.speed * dt)
                dx = (target.x - unit.x) / max(0.001, distance)
                dz = (target.z - unit.z) / max(0.001, distance)
                moves.append((unit, dx * step, dz * step))

        for unit, dx, dz in moves:
            unit.x += dx
            unit.z += dz

        for name, unit, target in attacks:
            if unit.hp <= 0 or target.hp <= 0:
                continue
            entry = entries[name]
            other_name = b.family_name if name == a.family_name else a.family_name
            defender = entries[other_name]
            amount = max(1.0, entry.damage - defender.defense)
            amount *= config.counters.get((entry.family, defender.family), 1.0)
            applied = min(target.hp, amount)
            target.hp -= amount
            damage[name] += applied
            if not contact:
                pre_contact[name] += applied

            if entry.damage_radius > 0:
                effective_radius = radius + entry.damage_radius + radius
                for secondary in alive(other_name):
                    if secondary is target or secondary.hp <= 0:
                        continue
                    if dist2(target, secondary) > effective_radius * effective_radius:
                        continue
                    applied = min(secondary.hp, amount)
                    secondary.hp -= amount
                    damage[name] += applied
                    if not contact:
                        pre_contact[name] += applied

        time += dt

    a_alive = alive(a.family_name)
    b_alive = alive(b.family_name)
    if a_alive and not b_alive:
        hp_left = sum(unit.hp for unit in a_alive) / max(1.0, a.health * a.count)
        return MicroDuelResult(a.family_name, hp_left, len(a_alive), time, damage, pre_contact)
    if b_alive and not a_alive:
        hp_left = sum(unit.hp for unit in b_alive) / max(1.0, b.health * b.count)
        return MicroDuelResult(b.family_name, hp_left, len(b_alive), time, damage, pre_contact)
    a_hp = sum(unit.hp for unit in a_alive) / max(1.0, a.health * a.count)
    b_hp = sum(unit.hp for unit in b_alive) / max(1.0, b.health * b.count)
    winner = a.family_name if a_hp >= b_hp else b.family_name
    return MicroDuelResult(winner, max(a_hp, b_hp), len(a_alive if a_hp >= b_hp else b_alive), time, damage, pre_contact)


def sync_team_entries(config: SceneConfig) -> None:
    by_name = {entry.name: entry for entry in config.entries_by_team[0]}
    for entry in config.entries_by_team[1]:
        src = by_name.get(entry.name)
        if not src:
            continue
        entry.count = src.count
        entry.cost = src.cost
        entry.health = src.health
        entry.damage = src.damage
        entry.defense = src.defense
        entry.speed = src.speed
        entry.attack_range = src.attack_range
        entry.damage_radius = src.damage_radius
        entry.attack_interval = src.attack_interval


def set_stat(config: SceneConfig, family: str, **values: float) -> None:
    for entries in config.entries_by_team:
        for entry in entries:
            if entry.family_name != family:
                continue
            for key, value in values.items():
                if key == "count":
                    setattr(entry, key, int(round(value)))
                else:
                    setattr(entry, key, float(value))


def set_rule(config: SceneConfig, attacker: str, defender: str, multiplier: float) -> None:
    config.counters[(FAMILY_IDS[attacker], FAMILY_IDS[defender])] = float(multiplier)


def apply_runtime_baseline(config: SceneConfig) -> None:
    """Start from a sane soft-counter shape, then let random search perturb it."""
    # Melee unit counts stay mass-like. Cavalry may vary during search, but
    # starts at 10 because the runtime problem is it dies before value.
    set_stat(config, "Axeman", count=10, cost=28, health=140, damage=22, defense=3, speed=3.0, attack_range=0.35, damage_radius=0.0, attack_interval=0.40)
    set_stat(config, "Cavalry", count=10, cost=42, health=130, damage=28, defense=8, speed=6.0, attack_range=0.35, damage_radius=0.0, attack_interval=0.40)
    set_stat(config, "Sword", count=10, cost=50, health=160, damage=20, defense=8, speed=3.5, attack_range=0.35, damage_radius=0.0, attack_interval=0.40)
    set_stat(config, "Spear", count=10, cost=34, health=190, damage=19, defense=10, speed=3.0, attack_range=1.00, damage_radius=0.0, attack_interval=0.40)
    set_stat(config, "Monk", count=2, cost=36, health=160, damage=34, defense=0, speed=3.0, attack_range=5.50, damage_radius=0.10, attack_interval=1.80)
    set_stat(config, "Archer", count=4, cost=40, health=90, damage=24, defense=0, speed=3.0, attack_range=6.00, damage_radius=0.0, attack_interval=1.50)

    set_rule(config, "Spear", "Cavalry", 1.50)
    set_rule(config, "Cavalry", "Archer", 4.00)
    set_rule(config, "Cavalry", "Monk", 4.00)
    set_rule(config, "Archer", "Spear", 2.50)
    set_rule(config, "Archer", "Monk", 2.00)
    set_rule(config, "Monk", "Axeman", 3.00)
    set_rule(config, "Axeman", "Sword", 2.50)
    set_rule(config, "Sword", "Spear", 2.50)
    sync_team_entries(config)


def perturb(config: SceneConfig, rng: random.Random, strength: float = 1.0) -> None:
    """Generate one candidate around the baseline with role-aware ranges."""
    # Costs are searched too because damage/CP is a stated target.
    ranges = {
        "Axeman": dict(cost=(24, 36), health=(120, 170), damage=(18, 28), defense=(1, 6), speed=(2.8, 3.4), interval=(0.35, 0.50)),
        "Cavalry": dict(cost=(36, 52), health=(120, 180), damage=(24, 36), defense=(6, 14), speed=(5.5, 7.0), count=(9, 10), interval=(0.35, 0.50)),
        "Sword": dict(cost=(36, 54), health=(145, 210), damage=(18, 29), defense=(6, 14), speed=(3.2, 4.0), interval=(0.35, 0.50)),
        "Spear": dict(cost=(30, 46), health=(145, 210), damage=(14, 24), defense=(5, 12), speed=(2.8, 3.4), attack_range=(0.70, 1.05), interval=(0.35, 0.50)),
        "Monk": dict(cost=(34, 52), health=(120, 180), damage=(20, 38), defense=(0, 3), speed=(2.8, 3.4), attack_range=(4.2, 5.8), damage_radius=(0.0, 0.25), count=(2, 3), interval=(1.65, 2.60)),
        "Archer": dict(cost=(34, 52), health=(70, 120), damage=(16, 30), defense=(0, 3), speed=(2.8, 3.4), attack_range=(4.8, 6.2), count=(3, 5), interval=(1.45, 2.40)),
    }
    for family, spec in ranges.items():
        values = {}
        if "count" in spec:
            values["count"] = rng.randint(*spec["count"])
        else:
            values["count"] = 10
        for field, bounds in spec.items():
            if field == "count":
                continue
            attr = "attack_interval" if field == "interval" else field
            if field == "attack_range":
                attr = "attack_range"
            low, high = bounds
            values[attr] = rng.uniform(low, high)
        # Hard constraints requested by user.
        if family in MELEE and family != "Cavalry":
            values["count"] = 10
        if family in RANGED:
            values["count"] = min(5, int(values["count"]))
        set_stat(config, family, **values)

    rule_ranges = {
        ("Spear", "Cavalry"): (1.40, 4.00),
        ("Cavalry", "Archer"): (2.00, 4.50),
        ("Cavalry", "Monk"): (2.00, 4.50),
        ("Archer", "Spear"): (1.80, 5.00),
        ("Archer", "Monk"): (1.20, 3.00),
        ("Monk", "Axeman"): (2.00, 5.00),
        ("Axeman", "Sword"): (2.00, 5.00),
        ("Sword", "Spear"): (1.80, 4.50),
    }
    for (attacker, defender), (low, high) in rule_ranges.items():
        set_rule(config, attacker, defender, rng.uniform(low, high))
    sync_team_entries(config)


def run_matches(config: SceneConfig, matches: int, seed: int, dt: float, max_time: float):
    results = []
    for index in range(matches):
        sim = WaveSimulator(
            config=config,
            rng=random.Random(seed + index),
            dt=dt,
            max_time=max_time,
            unit_radius=0.5,
            normal_lane_jump=True,
            melee_shield_blocks=True,
        )
        results.append(sim.run())
    return results


def summarize_results(results) -> Dict[str, object]:
    winners = Counter(r.winner for r in results)
    damage = Counter()
    cp = Counter()
    spawns = Counter()
    kill_pairs = Counter()
    reasons = Counter()
    for result in results:
        damage.update(result.damage_by_family)
        cp.update(result.cp_spent_by_family)
        for key, count in result.spawn_counts.items():
            spawns[family_from_spawn_key(key)] += count
        kill_pairs.update(result.kill_pairs)
        reasons.update(result.spawn_reasons)
    global_ratio = sum(damage.values()) / max(1.0, sum(cp.values()))
    dmg_cp = {
        family: damage[family] / max(1.0, cp[family])
        for family in ACTIVE
    }
    return {
        "winners": winners,
        "damage": damage,
        "cp": cp,
        "spawns": spawns,
        "kill_pairs": kill_pairs,
        "reasons": reasons,
        "global_ratio": global_ratio,
        "dmg_cp": dmg_cp,
    }


def score_candidate(config: SceneConfig, results, dt: float, max_time: float) -> CandidateScore:
    summary = summarize_results(results)
    global_ratio = summary["global_ratio"]
    dmg_cp: Dict[str, float] = summary["dmg_cp"]
    cp: Counter = summary["cp"]
    spawns: Counter = summary["spawns"]
    winners: Counter = summary["winners"]
    kill_pairs: Counter = summary["kill_pairs"]

    notes: List[str] = []
    # Economy: target role-adjusted damage/CP bands. Ranged can be lower than
    # melee because range creates tactical tempo and safer survival.
    target_rel = {
        "Axeman": 1.00,
        "Cavalry": 1.00,
        "Sword": 0.95,
        "Spear": 1.00,
        "Monk": 0.75,
        "Archer": 0.75,
    }
    economy_penalty = 0.0
    for family in ACTIVE:
        if cp[family] <= 0:
            economy_penalty += 4.0
            notes.append(f"{family} never spent")
            continue
        rel = dmg_cp[family] / max(0.001, global_ratio)
        target = target_rel[family]
        economy_penalty += abs(math.log(max(0.05, rel / target))) * (1.4 if family in RANGED else 1.0)
        if rel > target * 1.65:
            economy_penalty += (rel - target * 1.65) * 2.0
            notes.append(f"{family} too profitable {rel:.0%}")
        if rel < target * 0.45:
            economy_penalty += (target * 0.45 - rel) * 2.0
            notes.append(f"{family} dead value {rel:.0%}")

    # Spawn mix: no family should own the meta when both brains are symmetric.
    total_spawns = sum(spawns.values())
    spawn_penalty = 0.0
    if total_spawns:
        for family in ACTIVE:
            share = spawns[family] / total_spawns
            if share > 0.26:
                spawn_penalty += (share - 0.26) * 12.0
                notes.append(f"{family} spawn-dominant {share:.0%}")
            if share < 0.05:
                spawn_penalty += (0.05 - share) * 8.0
                notes.append(f"{family} rarely spawned {share:.0%}")

    # Symmetric AI should not strongly prefer one team.
    p0 = winners[0] / max(1, len(results))
    win_penalty = abs(p0 - 0.5) * 4.0

    # Micro counter duels: counter must win, but not with excessive survival.
    # This catches unit count, speed, attack range, pre-contact ranged damage,
    # and full AoE hits more realistically than aggregate wave HP.
    counter_penalty = 0.0
    entries = unique_entries(config)
    for (attacker_id, defender_id), multiplier in config.counters.items():
        attacker_name = FAMILY_NAMES.get(attacker_id, str(attacker_id))
        defender_name = FAMILY_NAMES.get(defender_id, str(defender_id))
        if attacker_name not in entries or defender_name not in entries:
            continue
        duel = micro_duel(
            config,
            entries[attacker_name],
            entries[defender_name],
            dt=min(0.05, dt),
            max_time=max_time,
        )
        if duel.winner != attacker_name:
            counter_penalty += 3.5
            notes.append(f"{attacker_name}>{defender_name} duel fails")
        elif duel.hp_left_ratio > 0.70:
            counter_penalty += (duel.hp_left_ratio - 0.70) * 2.5
            notes.append(f"{attacker_name}>{defender_name} too clean {duel.hp_left_ratio:.0%}")
        elif duel.hp_left_ratio < 0.03:
            counter_penalty += (0.03 - duel.hp_left_ratio) * 1.5

        # Ranged countering melee is allowed, but if the target loses most of a
        # wave before any body contact, runtime will feel like "ranged mass wins".
        if attacker_name in RANGED and defender_name in MELEE:
            target_hp = entries[defender_name].health * entries[defender_name].count
            pre = duel.pre_contact_damage.get(attacker_name, 0.0) / max(1.0, target_hp)
            if pre > 0.45:
                counter_penalty += (pre - 0.45) * 3.0
                notes.append(f"{attacker_name}>{defender_name} pre-contact {pre:.0%}")

    # Non-counter sanity: no non-counter pair should hard-delete its supposed
    # predator. This is where "ranged first always wins" usually shows up.
    for a_name, a_entry in entries.items():
        for b_name, b_entry in entries.items():
            if a_name == b_name:
                continue
            if config.counters.get((a_entry.family, b_entry.family), 1.0) > 1.0001:
                continue
            duel = micro_duel(config, a_entry, b_entry, dt=min(0.05, dt), max_time=max_time)
            if a_name in RANGED and b_name == "Cavalry" and duel.winner == a_name:
                counter_penalty += 2.5
                notes.append(f"{a_name} beats Cavalry without counter")
            if a_name == "Spear" and b_name == "Cavalry" and duel.winner == a_name:
                # Spear is a counter, so this branch is normally skipped. Keep
                # the intent here for future rule changes.
                pass

    # In-match counter domination: a counter should not be 5x the reverse in
    # common pairings. This catches Spear deleting Cavalry and Monk deleting Axe.
    matchup_penalty = 0.0
    for (attacker_id, defender_id), _ in config.counters.items():
        attacker = FAMILY_NAMES.get(attacker_id, str(attacker_id))
        defender = FAMILY_NAMES.get(defender_id, str(defender_id))
        forward = kill_pairs[(attacker, defender)]
        reverse = kill_pairs[(defender, attacker)]
        total = forward + reverse
        if total < max(8, len(results) // 2):
            continue
        dominance = forward / max(1, reverse)
        if dominance > 3.5:
            matchup_penalty += math.log(dominance / 3.5) * 1.5
            notes.append(f"{attacker}>{defender} kill dominance {dominance:.1f}x")
        if dominance < 1.2:
            matchup_penalty += (1.2 - dominance) * 1.2
            notes.append(f"{attacker}>{defender} weak in-match {dominance:.1f}x")

    score = (
        economy_penalty * 2.2
        + spawn_penalty * 1.2
        + counter_penalty * 1.8
        + matchup_penalty * 1.5
        + win_penalty
    )
    return CandidateScore(
        score=score,
        win_penalty=win_penalty,
        economy_penalty=economy_penalty,
        spawn_penalty=spawn_penalty,
        counter_penalty=counter_penalty,
        matchup_penalty=matchup_penalty,
        notes=notes[:8],
    )


def format_candidate(config: SceneConfig, score: CandidateScore, results) -> str:
    summary = summarize_results(results)
    entries = unique_entries(config)
    lines = [
        f"score={score.score:.3f} win={dict(summary['winners'])} "
        f"globalDmgCP={summary['global_ratio']:.2f} "
        f"penalties(econ={score.economy_penalty:.2f}, spawn={score.spawn_penalty:.2f}, "
        f"counter={score.counter_penalty:.2f}, matchup={score.matchup_penalty:.2f}, win={score.win_penalty:.2f})"
    ]
    if score.notes:
        lines.append("notes: " + "; ".join(score.notes))
    for family in ACTIVE:
        entry = entries[family]
        rel = summary["dmg_cp"][family] / max(0.001, summary["global_ratio"])
        lines.append(
            f"  {family:8s} count={entry.count:2d} cost={entry.cost:5.1f} "
            f"hp={entry.health:5.1f} dmg={entry.damage:5.1f} def={entry.defense:4.1f} "
            f"spd={entry.speed:3.1f} rng={entry.attack_range:3.1f} "
            f"rad={entry.damage_radius:3.2f} int={entry.attack_interval:3.2f} "
            f"dmgCP={summary['dmg_cp'][family]:5.1f} rel={rel:5.0%}"
        )
    rule_text = []
    for (a, b), mult in sorted(config.counters.items()):
        an = FAMILY_NAMES.get(a, str(a))
        bn = FAMILY_NAMES.get(b, str(b))
        if an in ACTIVE and bn in ACTIVE:
            rule_text.append(f"{an}>{bn}:{mult:.2f}")
    lines.append("  rules: " + ", ".join(rule_text))
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Search tier-1 battle stats as a whole system.")
    parser.add_argument("--scene", default="assets/Test.scene")
    parser.add_argument("--candidates", type=int, default=250)
    parser.add_argument("--matches", type=int, default=80)
    parser.add_argument("--final-matches", type=int, default=400)
    parser.add_argument("--seed", type=int, default=20260717)
    parser.add_argument("--dt", type=float, default=0.2)
    parser.add_argument("--max-time", type=float, default=180.0)
    parser.add_argument("--top", type=int, default=8)
    args = parser.parse_args()

    base = load_scene_config(Path(args.scene))
    apply_runtime_baseline(base)

    rng = random.Random(args.seed)
    best: List[Tuple[CandidateScore, SceneConfig, object]] = []

    # Include the baseline explicitly.
    candidates: List[SceneConfig] = [copy.deepcopy(base)]
    for _ in range(args.candidates):
        config = copy.deepcopy(base)
        perturb(config, rng)
        candidates.append(config)

    for index, config in enumerate(candidates):
        results = run_matches(config, args.matches, args.seed + index * 1009, args.dt, args.max_time)
        score = score_candidate(config, results, args.dt, args.max_time)
        best.append((score, config, results))
        best.sort(key=lambda item: item[0].score)
        best = best[: args.top]
        if (index + 1) % 50 == 0:
            print(f"searched {index + 1}/{len(candidates)} best={best[0][0].score:.3f}")

    print("\n=== rough top candidates ===")
    for rank, (score, config, results) in enumerate(best, 1):
        print(f"\n--- rough #{rank} ---")
        print(format_candidate(config, score, results))

    print("\n=== final validation ===")
    final = []
    for rank, (_, config, _) in enumerate(best, 1):
        results = run_matches(config, args.final_matches, args.seed + 900000 + rank * 1009, args.dt, args.max_time)
        score = score_candidate(config, results, args.dt, args.max_time)
        final.append((score, config, results))
    final.sort(key=lambda item: item[0].score)

    for rank, (score, config, results) in enumerate(final, 1):
        print(f"\n--- final #{rank} ---")
        print(format_candidate(config, score, results))


if __name__ == "__main__":
    main()
