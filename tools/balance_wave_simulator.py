#!/usr/bin/env python3
"""Wave-level balance simulator for fast design discussions.

This is intentionally not part of the Cocos runtime. It reads the serialized
scene for current inspector values, then runs an approximate wave-level model:
lanes, z movement, speed, attack range, frontline shielding, counter rules,
SmartArmyBrain-like spawn decisions, and battle economy.

The goal is fast directional signal, not a deterministic reproduction of the
game's unit-level RVO/collision/targeting.
"""

from __future__ import annotations

import argparse
import json
import math
import random
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple


FAMILY_NAMES = {
    0: "Spear",
    1: "Sword",
    2: "Archer",
    3: "Skirmisher",
    4: "Cavalry",
    5: "Axeman",
    6: "Monk",
}

FAMILY_IDS = {name: family for family, name in FAMILY_NAMES.items()}


@dataclass
class UnitEntry:
    name: str
    family: int
    family_name: str
    tier: int
    count: int
    cost: float
    health: float
    damage: float
    defense: float
    speed: float
    attack_range: float
    damage_radius: float
    attack_interval: float


@dataclass
class BrainSettings:
    min_spawn_interval: float = 2.5
    max_spawn_interval: float = 3.0
    max_alive_waves: int = 7
    decision_accuracy: float = 1.0
    attack_counter_coverage_ratio: float = 0.7
    ignore_nearly_dead_wave_ratio: float = 0.2
    aggressive_forward_chance: float = 0.25
    aggressive_fastest_entry_chance: float = 0.5
    flank_strike_ratio: float = 0.5
    fast_react_counter_chance: float = 0.5
    spawn_opening_wave_if_no_enemy_wave: bool = True


@dataclass
class SceneConfig:
    lane_count: int
    battle_min_x: float
    battle_max_x: float
    team_spawn_z: Tuple[float, float]
    initial_cp: Tuple[float, float]
    entries_by_team: Tuple[List[UnitEntry], List[UnitEntry]]
    counters: Dict[Tuple[int, int], float]
    brain_by_team: Tuple[BrainSettings, BrainSettings]

    def lane_width(self) -> float:
        return (self.battle_max_x - self.battle_min_x) / max(1, self.lane_count)


@dataclass
class Wave:
    id: int
    team: int
    entry: UnitEntry
    lane: int
    z: float
    aggressive: bool
    spawn_time: float
    target_wave_id: int = -1
    response_reason: str = ""
    hp: float = 0.0
    first_attack_time: Optional[float] = None
    dealt_damage: float = 0.0
    kills: int = 0
    lane_jumps: int = 0
    blocked_ticks: int = 0
    shielded_attacks: int = 0

    def __post_init__(self) -> None:
        self.hp = self.entry.health * self.entry.count

    @property
    def direction(self) -> float:
        return 1.0 if self.team == 0 else -1.0

    @property
    def alive(self) -> bool:
        return self.hp > 0

    @property
    def max_hp(self) -> float:
        return self.entry.health * self.entry.count

    @property
    def alive_ratio(self) -> float:
        if self.max_hp <= 0:
            return 0.0
        return max(0.0, self.hp / self.max_hp)

    @property
    def alive_units(self) -> int:
        return max(0, math.ceil(self.alive_ratio * self.entry.count))

    @property
    def value(self) -> float:
        return self.entry.cost * self.alive_ratio


@dataclass
class CounterAttempt:
    team: int
    wave_id: int
    target_wave_id: int
    attacker_family: str
    target_family: str
    reason: str
    target_destroyed_by_counter: bool = False
    target_destroyed_by_anyone: bool = False
    counter_hit_target: bool = False


@dataclass
class MatchResult:
    winner: int
    expected_p0: float
    duration: float
    cp: Tuple[float, float]
    units: Tuple[int, int]
    waves: Tuple[int, int]
    spawn_counts: Counter = field(default_factory=Counter)
    spawn_reasons: Counter = field(default_factory=Counter)
    kill_pairs: Counter = field(default_factory=Counter)
    lane_engagements: Counter = field(default_factory=Counter)
    counter_attempts: List[CounterAttempt] = field(default_factory=list)
    lane_jumps: int = 0
    blocked_ticks: int = 0
    shielded_attacks: int = 0


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def load_scene_config(scene_path: Path) -> SceneConfig:
    data = json.loads(scene_path.read_text(encoding="utf-8"))

    game_manager = next(
        obj for obj in data
        if isinstance(obj, dict)
        and "teamASpawnZ" in obj
        and "teamBSpawnZ" in obj
        and "laneCount" in obj
    )
    unit_database = next(
        obj for obj in data
        if isinstance(obj, dict)
        and "teamAInitialCombatPoint" in obj
        and "teamBInitialCombatPoint" in obj
        and "teamAUnits" in obj
        and "teamBUnits" in obj
    )
    counter_settings = next(
        obj for obj in data
        if isinstance(obj, dict)
        and "rules" in obj
        and "autoCreateDefaultRules" in obj
    )

    def entry_from_id(ref: dict) -> UnitEntry:
        obj = data[ref["__id__"]]
        family = int(obj["family"])
        return UnitEntry(
            name=obj["name"],
            family=family,
            family_name=FAMILY_NAMES.get(family, str(family)),
            tier=int(obj.get("tier", 1)),
            count=int(obj.get("unitCount", 1)),
            cost=float(obj.get("combatPointCost", 0)),
            health=float(obj.get("health", 1)),
            damage=float(obj.get("damage", 1)),
            defense=float(obj.get("defense", 0)),
            speed=float(obj.get("maxSpeed", 1)),
            attack_range=float(obj.get("attackRange", 1)),
            damage_radius=float(obj.get("damageRadius", 0)),
            attack_interval=(
                float(obj.get("attackIntervalMin", 1))
                + float(obj.get("attackIntervalMax", 1))
            ) * 0.5,
        )

    entries_by_team = (
        [entry_from_id(ref) for ref in unit_database["teamAUnits"]],
        [entry_from_id(ref) for ref in unit_database["teamBUnits"]],
    )

    counters: Dict[Tuple[int, int], float] = {}
    for ref in counter_settings["rules"]:
        rule = data[ref["__id__"]]
        counters[
            (int(rule["attackerFamily"]), int(rule["defenderFamily"]))
        ] = float(rule.get("damageMultiplier", 1.0))

    brains = [BrainSettings(), BrainSettings()]
    for obj in data:
        if not isinstance(obj, dict):
            continue
        if "decisionAccuracy" not in obj or "maxAliveWaves" not in obj:
            continue
        if "minSpawnInterval" not in obj or "team" not in obj:
            continue
        team = int(obj.get("team", 1))
        if team not in (0, 1):
            continue
        brains[team] = BrainSettings(
            min_spawn_interval=float(obj.get("minSpawnInterval", 2.5)),
            max_spawn_interval=float(obj.get("maxSpawnInterval", 3.0)),
            max_alive_waves=int(obj.get("maxAliveWaves", 7)),
            decision_accuracy=float(obj.get("decisionAccuracy", 1.0)),
            attack_counter_coverage_ratio=float(
                obj.get("attackCounterCoverageRatio", 0.7)
            ),
            ignore_nearly_dead_wave_ratio=float(
                obj.get("ignoreNearlyDeadWaveRatio", 0.2)
            ),
            aggressive_forward_chance=float(obj.get("aggressiveForwardChance", 0.25)),
            aggressive_fastest_entry_chance=float(
                obj.get("aggressiveFastestEntryChance", 0.5)
            ),
            flank_strike_ratio=float(obj.get("flankStrikeRatio", 0.5)),
            fast_react_counter_chance=float(
                obj.get("fastReactCounterChance", 0.5)
            ),
            spawn_opening_wave_if_no_enemy_wave=bool(
                obj.get("spawnOpeningWaveIfNoEnemyWave", True)
            ),
        )

    return SceneConfig(
        lane_count=int(game_manager.get("laneCount", 3)),
        battle_min_x=float(game_manager.get("battleMinX", -8)),
        battle_max_x=float(game_manager.get("battleMaxX", 8)),
        team_spawn_z=(
            float(game_manager.get("teamASpawnZ", -18)),
            float(game_manager.get("teamBSpawnZ", 18)),
        ),
        initial_cp=(
            float(unit_database.get("teamAInitialCombatPoint", 500)),
            float(unit_database.get("teamBInitialCombatPoint", 500)),
        ),
        entries_by_team=entries_by_team,
        counters=counters,
        brain_by_team=(brains[0], brains[1]),
    )


class WaveSimulator:
    def __init__(
        self,
        config: SceneConfig,
        rng: random.Random,
        dt: float,
        max_time: float,
        unit_radius: float,
        normal_lane_jump: bool,
        melee_shield_blocks: bool,
    ) -> None:
        self.config = config
        self.rng = rng
        self.dt = dt
        self.max_time = max_time
        self.unit_radius = unit_radius
        self.normal_lane_jump = normal_lane_jump
        self.melee_shield_blocks = melee_shield_blocks
        self.time = 0.0
        self.next_wave_id = 1
        self.waves: List[Wave] = []
        self.cp = [config.initial_cp[0], config.initial_cp[1]]
        self.has_reached_max = [False, False]
        self.next_think = [
            self.random_interval(0),
            self.random_interval(1),
        ]
        self.spawn_counts: Counter = Counter()
        self.spawn_reasons: Counter = Counter()
        self.kill_pairs: Counter = Counter()
        self.lane_engagements: Counter = Counter()
        self.counter_attempts: Dict[int, CounterAttempt] = {}
        self.lane_jumps = 0
        self.blocked_ticks = 0
        self.shielded_attacks = 0

    def random_interval(self, team: int) -> float:
        brain = self.config.brain_by_team[team]
        return self.rng.uniform(brain.min_spawn_interval, brain.max_spawn_interval)

    def alive_waves(self, team: int) -> List[Wave]:
        return [wave for wave in self.waves if wave.alive and wave.team == team]

    def enemy_waves(self, team: int) -> List[Wave]:
        return [wave for wave in self.waves if wave.alive and wave.team != team]

    def affordable_entries(self, team: int) -> List[UnitEntry]:
        cp = self.cp[team]
        return [entry for entry in self.config.entries_by_team[team] if entry.cost <= cp]

    def can_afford_any(self, team: int) -> bool:
        return bool(self.affordable_entries(team))

    def is_counter(self, attacker: int, defender: int) -> bool:
        return self.config.counters.get((attacker, defender), 1.0) > 1.0001

    def counter_multiplier(self, attacker: int, defender: int) -> float:
        return self.config.counters.get((attacker, defender), 1.0)

    def get_counter_entries(self, team: int, target: Wave) -> List[UnitEntry]:
        entries = self.affordable_entries(team)
        hard = [
            entry for entry in entries
            if self.is_counter(entry.family, target.entry.family)
        ]
        return hard

    def choose_response_entry(self, team: int, target: Wave) -> Optional[UnitEntry]:
        counters = self.get_counter_entries(team, target)
        if counters:
            return self.rng.choice(counters)
        entries = self.affordable_entries(team)
        return self.rng.choice(entries) if entries else None

    def get_progress_to_enemy_base(self, wave: Wave) -> float:
        own = self.config.team_spawn_z[wave.team]
        enemy = self.config.team_spawn_z[1 - wave.team]
        span = abs(enemy - own)
        if span <= 0:
            return 0.0
        return clamp01(((wave.z - own) * wave.direction) / span)

    def has_ally_ahead(self, wave: Wave, max_gap: float = 2.5) -> bool:
        for ally in self.alive_waves(wave.team):
            if ally is wave or ally.lane != wave.lane:
                continue
            forward_dist = (ally.z - wave.z) * wave.direction
            if 0.0 < forward_dist <= max_gap:
                return True
        return False

    def ally_blockers_from_spawn(self, team: int, target: Wave) -> int:
        own_spawn = self.config.team_spawn_z[team]
        direction = 1.0 if team == 0 else -1.0
        target_dist = (target.z - own_spawn) * direction
        if target_dist <= 0:
            return 0
        blockers = 0
        for ally in self.alive_waves(team):
            if ally.lane != target.lane:
                continue
            dist = (ally.z - own_spawn) * direction
            if 0.0 < dist < target_dist:
                blockers += 1
        return blockers

    def coverage_for_target(self, team: int, target: Wave) -> float:
        target_units = max(1, target.alive_units)
        counter_units = 0
        for ally in self.alive_waves(team):
            if ally.lane != target.lane:
                continue
            if self.is_counter(ally.entry.family, target.entry.family):
                counter_units += ally.alive_units
        return counter_units / target_units

    def find_response_target(self, team: int) -> Optional[Tuple[Wave, int]]:
        brain = self.config.brain_by_team[team]
        best: Optional[Tuple[float, Wave, int]] = None
        for enemy in self.enemy_waves(team):
            if enemy.alive_ratio < brain.ignore_nearly_dead_wave_ratio:
                continue
            if not self.choose_response_entry(team, enemy):
                continue
            coverage = self.coverage_for_target(team, enemy)
            if coverage >= brain.attack_counter_coverage_ratio:
                continue
            blockers = self.ally_blockers_from_spawn(team, enemy)
            path_priority = 2 if blockers <= 0 else 1 if blockers == 1 else 0
            progress = 1.0 - self.get_progress_to_enemy_base(enemy)
            threat = (
                progress * 3.0
                + enemy.alive_ratio * 1.2
                + (1.0 - coverage) * 1.5
                + path_priority * 0.6
                + self.rng.random() * 0.001
            )
            score = path_priority * 100.0 + threat
            if best is None or score > best[0]:
                best = (score, enemy, blockers)
        return (best[1], best[2]) if best else None

    def get_empty_lane(self) -> int:
        lanes = list(range(self.config.lane_count))
        self.rng.shuffle(lanes)
        for lane in lanes:
            if not any(wave.alive and wave.lane == lane for wave in self.waves):
                return lane
        return -1

    def spawn_wave(
        self,
        team: int,
        entry: UnitEntry,
        lane: int,
        aggressive: bool,
        reason: str,
        target: Optional[Wave] = None,
    ) -> Optional[Wave]:
        if self.cp[team] < entry.cost:
            return None
        if lane < 0:
            lane = self.rng.randrange(self.config.lane_count)
        self.cp[team] -= entry.cost
        wave = Wave(
            id=self.next_wave_id,
            team=team,
            entry=entry,
            lane=max(0, min(self.config.lane_count - 1, lane)),
            z=self.config.team_spawn_z[team],
            aggressive=aggressive,
            spawn_time=self.time,
            target_wave_id=target.id if target else -1,
            response_reason=reason,
        )
        self.next_wave_id += 1
        self.waves.append(wave)
        self.spawn_counts[(team, entry.name)] += 1
        self.spawn_reasons[reason] += 1
        if target is not None:
            self.counter_attempts[wave.id] = CounterAttempt(
                team=team,
                wave_id=wave.id,
                target_wave_id=target.id,
                attacker_family=entry.family_name,
                target_family=target.entry.family_name,
                reason=reason,
            )
        return wave

    def should_spawn_aggressive(self, team: int, blockers: int, target_lane: int) -> bool:
        if not self.has_reached_max[team]:
            return True
        if blockers > 0:
            return True
        if not any(wave.alive and wave.team == team and wave.lane == target_lane for wave in self.waves):
            roll = self.rng.random()
            return roll >= self.config.brain_by_team[team].flank_strike_ratio
        return False

    def think(self, team: int, forced_target: Optional[Wave] = None, reason: str = "response") -> bool:
        brain = self.config.brain_by_team[team]
        alive = len(self.alive_waves(team))
        if alive >= brain.max_alive_waves:
            self.has_reached_max[team] = True
            return False
        if not self.can_afford_any(team):
            return False

        accurate = self.rng.random() < clamp01(brain.decision_accuracy)
        if not accurate:
            entry = self.rng.choice(self.affordable_entries(team))
            lane = self.rng.randrange(self.config.lane_count)
            aggressive = self.rng.random() < brain.aggressive_forward_chance
            return self.spawn_wave(team, entry, lane, aggressive, "naive") is not None

        target_info: Optional[Tuple[Wave, int]]
        if forced_target and forced_target.alive:
            target_info = (forced_target, self.ally_blockers_from_spawn(team, forced_target))
        else:
            target_info = self.find_response_target(team)

        if target_info:
            target, blockers = target_info
            entry = self.choose_response_entry(team, target)
            if not entry:
                return False
            aggressive = self.should_spawn_aggressive(team, blockers, target.lane)
            return self.spawn_wave(team, entry, target.lane, aggressive, reason, target) is not None

        if self.rng.random() < brain.aggressive_forward_chance:
            lane = self.get_empty_lane()
            if lane >= 0:
                entries = self.affordable_entries(team)
                if self.rng.random() < brain.aggressive_fastest_entry_chance:
                    entry = max(entries, key=lambda item: (item.speed, -item.cost))
                else:
                    entry = self.rng.choice(entries)
                return self.spawn_wave(team, entry, lane, True, "aggressive-empty-lane") is not None

        if brain.spawn_opening_wave_if_no_enemy_wave and not self.enemy_waves(team):
            entry = self.rng.choice(self.affordable_entries(team))
            return self.spawn_wave(
                team,
                entry,
                -1,
                not self.has_reached_max[team],
                "opening",
            ) is not None

        return False

    def maybe_fast_react(self, spawned: Wave) -> None:
        team = 1 - spawned.team
        brain = self.config.brain_by_team[team]
        if self.rng.random() >= clamp01(brain.fast_react_counter_chance):
            return
        if self.time < self.next_think[team] - brain.min_spawn_interval:
            return
        if self.think(team, spawned, "fast-react-response"):
            self.next_think[team] = self.time + self.random_interval(team)

    def effective_attack_range(self, attacker: Wave, defender: Wave) -> float:
        return attacker.entry.attack_range + self.unit_radius * 2.0

    def forward_distance(self, attacker: Wave, defender: Wave) -> float:
        return (defender.z - attacker.z) * attacker.direction

    def select_attack_target(self, wave: Wave) -> Tuple[Optional[Wave], bool]:
        enemies = self.enemy_waves(wave.team)
        if not enemies:
            return None, False

        same_lane = [enemy for enemy in enemies if enemy.lane == wave.lane]
        same_lane.sort(key=lambda enemy: self.forward_distance(wave, enemy))

        for enemy in same_lane:
            dist = self.forward_distance(wave, enemy)
            if dist < -self.effective_attack_range(wave, enemy):
                continue
            if abs(dist) <= self.effective_attack_range(wave, enemy):
                shielded = self.has_ally_ahead(wave) and wave.entry.attack_range > 2.0
                return enemy, shielded

        if same_lane and wave.entry.attack_range > 2.0:
            enemy = min(same_lane, key=lambda item: abs(self.forward_distance(wave, item)))
            dist = self.forward_distance(wave, enemy)
            if 0 <= dist <= self.effective_attack_range(wave, enemy) + 3.0:
                if self.has_ally_ahead(wave):
                    return enemy, True

        if not wave.aggressive and self.normal_lane_jump:
            adjacent = [
                enemy for enemy in enemies
                if abs(enemy.lane - wave.lane) == 1
                and self.forward_distance(wave, enemy) < -0.25
            ]
            if adjacent:
                target = min(adjacent, key=lambda item: abs(self.forward_distance(wave, item)))
                old_lane = wave.lane
                wave.lane = target.lane
                wave.lane_jumps += 1
                self.lane_jumps += 1
                self.lane_engagements[("lane-jump", old_lane, target.lane)] += 1

        return None, False

    def damage_per_second(self, attacker: Wave, defender: Wave) -> float:
        base = max(1.0, attacker.entry.damage - defender.entry.defense)
        multiplier = self.counter_multiplier(attacker.entry.family, defender.entry.family)
        interval = max(0.05, attacker.entry.attack_interval)
        return attacker.alive_units * base * multiplier / interval

    def splash_ratio(self, attacker: Wave) -> float:
        radius = max(0.0, attacker.entry.damage_radius)
        if radius <= 0:
            return 0.0
        # The game measures area around the primary target body. This maps the
        # radius into expected extra wave damage, not exact unit overlap.
        return min(0.75, radius / 2.0)

    def apply_combat(self) -> None:
        damage_events: List[Tuple[Wave, float, Wave, bool]] = []
        for wave in list(self.waves):
            if not wave.alive:
                continue
            target, shielded = self.select_attack_target(wave)
            if not target:
                continue
            if wave.first_attack_time is None:
                wave.first_attack_time = self.time
            if shielded:
                wave.shielded_attacks += 1
                self.shielded_attacks += 1
            dps = self.damage_per_second(wave, target)
            damage_events.append((target, dps * self.dt, wave, False))
            self.lane_engagements[(wave.entry.family_name, target.entry.family_name, wave.lane)] += 1

            splash = self.splash_ratio(wave)
            if splash > 0:
                nearby = [
                    enemy for enemy in self.enemy_waves(wave.team)
                    if enemy is not target and enemy.lane == target.lane
                    and abs(enemy.z - target.z) <= self.unit_radius * 2.0 + wave.entry.damage_radius + 0.75
                ]
                for enemy in nearby[:2]:
                    damage_events.append((enemy, dps * splash * self.dt, wave, True))

        for target, amount, source, is_splash in damage_events:
            if not target.alive:
                continue
            actual = min(target.hp, max(0.0, amount))
            target.hp -= amount
            source.dealt_damage += actual
            attempt = self.counter_attempts.get(source.id)
            if attempt and attempt.target_wave_id == target.id:
                attempt.counter_hit_target = True
            if target.hp <= 0:
                source.kills += 1
                self.kill_pairs[(source.entry.family_name, target.entry.family_name)] += 1
                if attempt and attempt.target_wave_id == target.id:
                    attempt.target_destroyed_by_counter = True
                for other in self.counter_attempts.values():
                    if other.target_wave_id == target.id:
                        other.target_destroyed_by_anyone = True

    def is_blocked_by_ally(self, wave: Wave) -> bool:
        if not self.melee_shield_blocks:
            return False
        if wave.entry.attack_range > 2.0:
            return False
        for ally in self.alive_waves(wave.team):
            if ally is wave or ally.lane != wave.lane:
                continue
            dist = (ally.z - wave.z) * wave.direction
            if 0.0 < dist < 1.8:
                enemies = [
                    enemy for enemy in self.enemy_waves(wave.team)
                    if enemy.lane == ally.lane
                    and abs((enemy.z - ally.z) * ally.direction) <= self.effective_attack_range(ally, enemy) + 0.5
                ]
                if enemies:
                    return True
        return False

    def move_waves(self) -> None:
        for wave in self.waves:
            if not wave.alive:
                continue
            target, _ = self.select_attack_target(wave)
            if target:
                continue
            speed = wave.entry.speed
            if self.is_blocked_by_ally(wave):
                wave.blocked_ticks += 1
                self.blocked_ticks += 1
                speed *= 0.15
            wave.z += wave.direction * speed * self.dt

    def cleanup_dead(self) -> None:
        self.waves = [wave for wave in self.waves if wave.alive]

    def estimate_winner(self) -> Tuple[int, float]:
        scores = [0.0, 0.0]
        for team in (0, 1):
            scores[team] = sum(wave.value for wave in self.alive_waves(team))
        for a in self.alive_waves(0):
            for b in self.alive_waves(1):
                if self.is_counter(a.entry.family, b.entry.family):
                    scores[0] += a.value * (0.75 if a.lane == b.lane else 0.15)
                if self.is_counter(b.entry.family, a.entry.family):
                    scores[1] += b.value * (0.75 if a.lane == b.lane else 0.15)
        total = max(1.0, scores[0] + scores[1])
        p0 = 1.0 / (1.0 + math.exp(-6.0 * ((scores[0] - scores[1]) / total)))
        winner = 0 if p0 >= 0.55 else 1 if p0 <= 0.45 else -1
        return winner, p0

    def run(self) -> MatchResult:
        while self.time < self.max_time:
            for team in (0, 1):
                if self.time >= self.next_think[team]:
                    before = len(self.waves)
                    self.think(team)
                    if len(self.waves) > before:
                        self.maybe_fast_react(self.waves[-1])
                    self.next_think[team] = self.time + self.random_interval(team)

            self.apply_combat()
            self.cleanup_dead()
            self.move_waves()
            self.cleanup_dead()

            lost = [
                len(self.alive_waves(team)) == 0 and not self.can_afford_any(team)
                for team in (0, 1)
            ]
            if any(lost):
                winner = -1 if all(lost) else 1 if lost[0] else 0
                _, p0 = self.estimate_winner()
                return self.build_result(winner, p0)

            self.time += self.dt

        winner, p0 = self.estimate_winner()
        return self.build_result(winner, p0)

    def build_result(self, winner: int, p0: float) -> MatchResult:
        for attempt in self.counter_attempts.values():
            if any(wave.id == attempt.target_wave_id and wave.alive for wave in self.waves):
                continue
            attempt.target_destroyed_by_anyone = True

        return MatchResult(
            winner=winner,
            expected_p0=p0,
            duration=self.time,
            cp=(self.cp[0], self.cp[1]),
            units=(
                sum(wave.alive_units for wave in self.alive_waves(0)),
                sum(wave.alive_units for wave in self.alive_waves(1)),
            ),
            waves=(len(self.alive_waves(0)), len(self.alive_waves(1))),
            spawn_counts=self.spawn_counts.copy(),
            spawn_reasons=self.spawn_reasons.copy(),
            kill_pairs=self.kill_pairs.copy(),
            lane_engagements=self.lane_engagements.copy(),
            counter_attempts=list(self.counter_attempts.values()),
            lane_jumps=self.lane_jumps,
            blocked_ticks=self.blocked_ticks,
            shielded_attacks=self.shielded_attacks,
        )


def summarize(results: Sequence[MatchResult]) -> None:
    total = len(results)
    winner_counts = Counter(result.winner for result in results)
    spawn_counts: Counter = Counter()
    spawn_reasons: Counter = Counter()
    kill_pairs: Counter = Counter()
    lane_engagements: Counter = Counter()
    attempts: List[CounterAttempt] = []

    for result in results:
        spawn_counts.update(result.spawn_counts)
        spawn_reasons.update(result.spawn_reasons)
        kill_pairs.update(result.kill_pairs)
        lane_engagements.update(result.lane_engagements)
        attempts.extend(result.counter_attempts)

    total_spawns = sum(spawn_counts.values())
    expected_team0 = sum(result.expected_p0 for result in results)

    print(f"matches: {total}")
    print(f"winners: {dict(winner_counts)}")
    print(f"expected wins: team0={expected_team0:.1f}, team1={total - expected_team0:.1f}")
    print(
        "avg duration: "
        f"{sum(r.duration for r in results) / total:.2f}s; "
        f"avg spawns/match: {total_spawns / total:.2f}"
    )
    print(
        "avg final cp: "
        f"{sum(r.cp[0] for r in results) / total:.2f}/"
        f"{sum(r.cp[1] for r in results) / total:.2f}; "
        "avg final units: "
        f"{sum(r.units[0] for r in results) / total:.2f}/"
        f"{sum(r.units[1] for r in results) / total:.2f}; "
        "avg final waves: "
        f"{sum(r.waves[0] for r in results) / total:.2f}/"
        f"{sum(r.waves[1] for r in results) / total:.2f}"
    )
    print(
        "movement: "
        f"lane_jumps={sum(r.lane_jumps for r in results)}, "
        f"blocked_ticks={sum(r.blocked_ticks for r in results)}, "
        f"shielded_ranged_attacks={sum(r.shielded_attacks for r in results)}"
    )

    print("\nspawn reasons:")
    for reason, count in spawn_reasons.most_common():
        print(f"  {reason:24s} {count:6d} {count / max(1, total_spawns) * 100:6.2f}%")

    print("\nspawn units:")
    for (team, name), count in spawn_counts.most_common():
        print(f"  team{team} {name:16s} {count:6d} {count / max(1, total_spawns) * 100:6.2f}%")

    print("\nkill pairs:")
    for (attacker, defender), count in kill_pairs.most_common(12):
        print(f"  {attacker:8s} > {defender:8s} {count:6d}")

    print("\nlane engagements:")
    shown = 0
    for key, count in lane_engagements.most_common():
        if key and key[0] == "lane-jump":
            continue
        attacker, defender, lane = key
        print(f"  lane{lane} {attacker:8s} > {defender:8s} {count:7d}")
        shown += 1
        if shown >= 12:
            break

    if attempts:
        print("\ncounter attempts:")
        pair_counts: Counter = Counter()
        pair_hit: Counter = Counter()
        pair_kill: Counter = Counter()
        pair_destroyed: Counter = Counter()
        for attempt in attempts:
            pair = (attempt.attacker_family, attempt.target_family)
            pair_counts[pair] += 1
            if attempt.counter_hit_target:
                pair_hit[pair] += 1
            if attempt.target_destroyed_by_counter:
                pair_kill[pair] += 1
            if attempt.target_destroyed_by_anyone:
                pair_destroyed[pair] += 1
        for pair, count in pair_counts.most_common():
            hit = pair_hit[pair]
            kill = pair_kill[pair]
            destroyed = pair_destroyed[pair]
            print(
                f"  {pair[0]:8s}>{pair[1]:8s} attempts={count:5d} "
                f"hit={hit / count * 100:5.1f}% "
                f"lastKill={kill / count * 100:5.1f}% "
                f"targetGone={destroyed / count * 100:5.1f}%"
            )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run wave-level balance simulation.")
    parser.add_argument("--scene", default="assets/Test.scene", help="Path to Cocos scene JSON.")
    parser.add_argument("--matches", type=int, default=1000)
    parser.add_argument("--seed", type=int, default=20260717)
    parser.add_argument("--dt", type=float, default=0.2)
    parser.add_argument("--max-time", type=float, default=240.0)
    parser.add_argument("--unit-radius", type=float, default=0.5)
    parser.add_argument("--no-normal-lane-jump", action="store_true")
    parser.add_argument("--no-melee-shield-blocks", action="store_true")
    parser.add_argument(
        "--override-monk-radius",
        type=float,
        default=None,
        help="Temporarily override monk_t1 damageRadius for discussion tests.",
    )
    parser.add_argument(
        "--override-entry",
        action="append",
        default=[],
        help=(
            "Temporarily override an entry field, e.g. "
            "spear_t1:cost:22 or spear_t1:damage:15. "
            "Supported fields: count,cost,health,damage,defense,speed,"
            "attack_range,damage_radius,attack_interval."
        ),
    )
    parser.add_argument(
        "--remove-rule",
        action="append",
        default=[],
        help="Temporarily remove a counter rule, e.g. Archer:Monk.",
    )
    parser.add_argument(
        "--add-rule",
        action="append",
        default=[],
        help="Temporarily add a counter rule, e.g. Archer:Monk.",
    )
    return parser.parse_args()


def parse_rule(value: str) -> Tuple[int, int]:
    try:
        attacker, defender = value.split(":", 1)
        return FAMILY_IDS[attacker], FAMILY_IDS[defender]
    except Exception as exc:
        raise ValueError(f"Invalid rule '{value}'. Use Attacker:Defender.") from exc


def apply_entry_override(config: SceneConfig, value: str) -> None:
    supported = {
        "count",
        "cost",
        "health",
        "damage",
        "defense",
        "speed",
        "attack_range",
        "damage_radius",
        "attack_interval",
    }
    try:
        name, field_name, raw = value.split(":", 2)
    except ValueError as exc:
        raise ValueError(
            f"Invalid override '{value}'. Use entry:field:value."
        ) from exc

    if field_name not in supported:
        raise ValueError(
            f"Unsupported override field '{field_name}'. "
            f"Supported: {', '.join(sorted(supported))}."
        )

    changed = False
    for entries in config.entries_by_team:
        for entry in entries:
            if entry.name != name:
                continue
            if field_name == "count":
                setattr(entry, field_name, int(float(raw)))
            else:
                setattr(entry, field_name, float(raw))
            changed = True

    if not changed:
        raise ValueError(f"No unit entry named '{name}' found.")


def main() -> None:
    args = parse_args()
    config = load_scene_config(Path(args.scene))

    if args.override_monk_radius is not None:
        for entries in config.entries_by_team:
            for entry in entries:
                if entry.name == "monk_t1":
                    entry.damage_radius = args.override_monk_radius

    for value in args.override_entry:
        apply_entry_override(config, value)

    for value in args.remove_rule:
        config.counters.pop(parse_rule(value), None)
    for value in args.add_rule:
        config.counters[parse_rule(value)] = 3.0

    results: List[MatchResult] = []
    for index in range(args.matches):
        rng = random.Random(args.seed + index)
        sim = WaveSimulator(
            config=config,
            rng=rng,
            dt=args.dt,
            max_time=args.max_time,
            unit_radius=args.unit_radius,
            normal_lane_jump=not args.no_normal_lane_jump,
            melee_shield_blocks=not args.no_melee_shield_blocks,
        )
        results.append(sim.run())

    print("wave-level simulator")
    print(f"scene: {args.scene}")
    print(f"seed: {args.seed}; matches: {args.matches}; dt: {args.dt}")
    print(
        "rules: "
        + ", ".join(
            f"{FAMILY_NAMES.get(a, a)}>{FAMILY_NAMES.get(b, b)}"
            for a, b in sorted(config.counters)
        )
    )
    summarize(results)


if __name__ == "__main__":
    main()
