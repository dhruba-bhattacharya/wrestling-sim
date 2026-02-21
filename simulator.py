from __future__ import annotations

import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple


@dataclass
class Wrestler:
    id: str
    name: str
    faction: Optional[str]
    popularity: float
    skills: float
    charisma: float
    mic_skills: float
    division: str
    alignment: str
    stamina: float = 80.0
    momentum: float = 0.0
    injured_weeks: int = 0

    @property
    def is_available(self) -> bool:
        return self.injured_weeks <= 0


@dataclass
class Championship:
    name: str
    division: str
    number: int
    wrestlers: List[str]


@dataclass
class Rivalry:
    rivals: Tuple[str, ...]
    rivalry_type: str
    division: str
    level: float = 1.0
    weeks_not_featured: int = 0
    active: bool = True
    cooldown: int = 0


@dataclass
class MatchType:
    name: str
    injury_chance: float
    exhaustion: int
    boost: float


MATCH_TYPES: Dict[str, MatchType] = {
    "Singles Match": MatchType("Singles Match", 0.03, 5, 0),
    "Tables Match": MatchType("Tables Match", 0.05, 7, 1),
    "Ladder Match": MatchType("Ladder Match", 0.07, 10, 2),
    "Steel Cage": MatchType("Steel Cage", 0.10, 25, 4),
    "Tag Match": MatchType("Tag Match", 0.02, 5, 0),
    "Multimen Match": MatchType("Multimen Match", 0.02, 5, 0),
}


def floor_to_quarter(value: float) -> float:
    return math.floor(value * 4) / 4


class WrestlingSimulator:
    def __init__(self, data_dir: str | Path, seed: Optional[int] = None) -> None:
        self.data_dir = Path(data_dir)
        self.random = random.Random(seed)
        self.week = 1
        self.hype = 65
        self.viewers = 750_000
        self.rivalry_history = self._load_rivalry_history()
        self.wrestlers = self._load_wrestlers()
        self.championships = self._load_championships()
        self.active_rivalries: List[Rivalry] = []

    def _load_json(self, name: str):
        path = self.data_dir / name
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _load_wrestlers(self) -> Dict[str, Wrestler]:
        data = self._load_json("wrestlers.json")
        injuries = {x["id"]: x["weeksofinjuryleft"] for x in self._load_json("injury.json")}
        return {
            w["ID"]: Wrestler(
                id=w["ID"],
                name=w["Name"],
                faction=w.get("Faction"),
                popularity=float(w["Popularity"]),
                skills=float(w["Skills"]),
                charisma=float(w["Charisma"]),
                mic_skills=float(w["MicSkills"]),
                division=w["Division"],
                alignment=w["Alignment"],
                injured_weeks=int(injuries.get(w["ID"], 0)),
            )
            for w in data
        }

    def _load_championships(self) -> List[Championship]:
        data = self._load_json("championships.json")
        return [
            Championship(
                name=c["Championship"],
                division=c["Division"],
                number=int(c["Number"]),
                wrestlers=[x.strip() for x in c["Wrestlers"].split(",")],
            )
            for c in data
        ]

    def _load_rivalry_history(self) -> Dict[frozenset[str], int]:
        data = self._load_json("rivalry.json")
        return {frozenset((r["id1"], r["id2"])): int(r["rivalryrate"]) for r in data}

    def schedule_event_name(self, week: int) -> str:
        events = {
            6: "AEW Revolution",
            10: "AEW Dynamite: Homecoming",
            16: "AEW Dynasty",
            22: "AEW Double Or Nothing",
            26: "AEW Dynamite: Grand Slam",
            32: "AEW All In",
            38: "AEW All Out",
            42: "AEW Dynamite: Blood and Guts",
            48: "AEW Full Gear",
        }
        return events.get(week, "AEW Dynamite")

    def is_ppv(self, week: int) -> bool:
        return week in {6, 16, 22, 32, 38, 48}

    def is_tv_special(self, week: int) -> bool:
        return week in {10, 26, 42}

    def feud_options(self) -> List[Tuple[str, str, str]]:
        options: List[Tuple[str, str, str]] = []
        available = [w for w in self.wrestlers.values() if w.is_available]
        by_division = {
            "M": sorted([w for w in available if w.division == "M"], key=lambda x: x.popularity, reverse=True),
            "F": sorted([w for w in available if w.division == "F"], key=lambda x: x.popularity, reverse=True),
        }

        for div, wrestlers in by_division.items():
            if len(wrestlers) >= 2:
                options.append(("Grudge", wrestlers[0].id, wrestlers[1].id))
            for title in [t for t in self.championships if t.division == div and t.number == 1]:
                champ = title.wrestlers[0]
                candidates = [w.id for w in wrestlers if w.id != champ][:3]
                for c in candidates:
                    options.append((f"Title Feud: {title.name}", champ, c))
        return options

    def feud_options_with_names(self) -> List[dict]:
        options = []
        for rivalry_type, left, right in self.feud_options():
            options.append(
                {
                    "rivalry_type": rivalry_type,
                    "ids": [left, right],
                    "names": [self.wrestlers[left].name, self.wrestlers[right].name],
                }
            )
        return options

    def create_rivalry(self, rivalry_type: str, ids: List[str]) -> None:
        rivals = tuple(ids)
        exists = any(set(r.rivals) == set(rivals) and r.active for r in self.active_rivalries)
        if exists:
            return
        self.active_rivalries.append(
            Rivalry(
                rivals=rivals,
                rivalry_type=rivalry_type,
                division=self.wrestlers[ids[0]].division,
                level=1.0,
            )
        )

    def _alignment_bonus_singles(self, a: Wrestler, b: Wrestler) -> float:
        if a.alignment != b.alignment:
            return 0.25
        return 0.0 if a.alignment == "Face" else -0.25

    def _rivalry_boost(self, a: str, b: str) -> float:
        return self.rivalry_history.get(frozenset((a, b)), 0) / 3

    def rate_singles_match(
        self,
        a: Wrestler,
        b: Wrestler,
        rivalry_level: float,
        match_type: MatchType,
        title_match: bool,
    ) -> float:
        p = (a.popularity + b.popularity) / 2
        s = (a.skills + b.skills) / 2
        r1 = (p + s) / 4
        rivalry = rivalry_level + self._rivalry_boost(a.id, b.id)
        title_boost = 0.5 if self.is_ppv(self.week) else (0.25 if title_match else 0)
        r2 = r1 + (rivalry / 6) + match_type.boost + self._alignment_bonus_singles(a, b) + title_boost
        return floor_to_quarter(r2 + self.random.uniform(-0.5, 1))

    def _event_bonus_rating(self, rating: float) -> float:
        if self.is_tv_special(self.week):
            return rating + 0.5 if rating >= 3.5 else rating - 0.75
        if self.is_ppv(self.week):
            return rating + 0.5 if rating >= 4 else rating - 0.5
        return rating

    def _apply_match_aftermath(self, participants: List[Wrestler], match_type: MatchType) -> None:
        for wrestler in participants:
            wrestler.stamina = max(0, min(100, wrestler.stamina - match_type.exhaustion))
            injury_chance = (match_type.injury_chance * 100) * (2 - wrestler.stamina / 100)
            if self.random.uniform(0, 100) < injury_chance:
                injury_weeks = round(self.random.uniform(1, 26) * (1 - wrestler.stamina / 250))
                wrestler.injured_weeks = max(1, injury_weeks)

    def _weekly_recovery(self, featured: set[str]) -> None:
        for wrestler in self.wrestlers.values():
            if wrestler.injured_weeks > 0:
                wrestler.injured_weeks -= 1
                if wrestler.injured_weeks == 0:
                    wrestler.stamina = 60
            elif wrestler.id not in featured:
                wrestler.stamina = min(100, wrestler.stamina + 10)
            if self.random.uniform(0, 1) < 0.00075:
                wrestler.injured_weeks = max(wrestler.injured_weeks, 1)

    def _update_rivalries(self, featured_pairings: set[frozenset[str]]) -> None:
        for rivalry in self.active_rivalries:
            if rivalry.cooldown > 0:
                rivalry.cooldown -= 1
            pairing = frozenset(rivalry.rivals)
            if not rivalry.active:
                continue
            if pairing in featured_pairings:
                rivalry.weeks_not_featured = 0
                roll = self.random.uniform(0, 100)
                if roll > 95:
                    rivalry.level = min(5, rivalry.level + 2)
                elif roll > 15:
                    rivalry.level = min(5, rivalry.level + 1)
            else:
                rivalry.weeks_not_featured += 1
                if rivalry.weeks_not_featured >= 2:
                    rivalry.level -= 0.5
            if rivalry.level < 1:
                rivalry.active = False
                rivalry.cooldown = 26

    def _weighted_pick(self, pool: List[Wrestler]) -> Wrestler:
        weights = []
        for wrestler in pool:
            weights.append(max(0.1, wrestler.popularity * 0.7 + wrestler.stamina * 0.3))
        return self.random.choices(pool, weights=weights, k=1)[0]

    def auto_book_weekly_show(self) -> dict:
        event_name = self.schedule_event_name(self.week)
        match_limit = 10 if self.is_ppv(self.week) else (6 if self.is_tv_special(self.week) else 5)
        segment_limit = 0 if self.is_ppv(self.week) else (self.random.randint(2, 4) if self.is_tv_special(self.week) else 3)

        roster = [w for w in self.wrestlers.values() if w.is_available]
        roster.sort(key=lambda w: (w.popularity, w.stamina), reverse=True)

        featured: set[str] = set()
        featured_pairings: set[frozenset[str]] = set()
        matches = []
        for _ in range(match_limit):
            pool = [w for w in roster if w.id not in featured]
            if len(pool) < 2:
                break
            a = self._weighted_pick(pool)
            remaining_pool = [w for w in pool if w.id != a.id]
            b = self._weighted_pick(remaining_pool)
            feud = next((r for r in self.active_rivalries if set(r.rivals) == {a.id, b.id} and r.active), None)
            level = feud.level if feud else 0
            mtype = MATCH_TYPES["Singles Match"]
            title_match = any(a.id in title.wrestlers for title in self.championships) and a.division == b.division
            raw_rating = self.rate_singles_match(a, b, level, mtype, title_match=title_match)
            final_rating = self._event_bonus_rating(raw_rating)
            matches.append(
                {
                    "type": mtype.name,
                    "participants": [a.name, b.name],
                    "rating": round(final_rating, 2),
                    "title_match": title_match,
                }
            )
            self._apply_match_aftermath([a, b], mtype)
            featured.update({a.id, b.id})
            featured_pairings.add(frozenset((a.id, b.id)))

        segments = []
        promo_pool = [w for w in roster if w.id not in featured]
        for _ in range(segment_limit):
            if not promo_pool:
                break
            wrestler = promo_pool.pop(0)
            rating = ((wrestler.mic_skills + wrestler.charisma) / 2) + self.random.uniform(-1, 1)
            segments.append({"type": "Self-Promo", "participants": [wrestler.name], "rating": round(rating, 2)})
            wrestler.popularity += 0.5 if rating > 4 else 0.25
            wrestler.stamina = min(100, wrestler.stamina + 5)
            featured.add(wrestler.id)

        show_ratings = [x["rating"] for x in matches + segments]
        if show_ratings:
            opening = show_ratings[0]
            main_event = show_ratings[-1]
            middle = sum(show_ratings[1:-1])
            show_rating = round((opening * 2 + middle + main_event * 2) / (len(show_ratings) + 2), 2)
        else:
            show_rating = 0

        self._update_rivalries(featured_pairings)
        if self.is_ppv(self.week):
            for rivalry in self.active_rivalries:
                if rivalry.active and frozenset(rivalry.rivals) in featured_pairings:
                    rivalry.active = False
                    rivalry.cooldown = 26

        if show_rating > 3.5:
            self.hype += 1
            self.viewers = self.random.randint(self.viewers, self.viewers + 50_000)
        elif show_rating < 2.5:
            self.hype -= 1
            self.viewers = self.random.randint(max(0, self.viewers - 50_000), self.viewers)

        self._weekly_recovery(featured)

        result = {
            "week": self.week,
            "event": event_name,
            "show_rating": show_rating,
            "hype": self.hype,
            "viewers": self.viewers,
            "matches": matches,
            "segments": segments,
        }
        self.week += 1
        return result

    def to_state(self) -> dict:
        return {
            "week": self.week,
            "event": self.schedule_event_name(self.week),
            "hype": self.hype,
            "viewers": self.viewers,
            "active_rivalries": [
                {
                    "rivalry_type": rivalry.rivalry_type,
                    "level": rivalry.level,
                    "weeks_not_featured": rivalry.weeks_not_featured,
                    "rivals": [self.wrestlers[r].name for r in rivalry.rivals],
                }
                for rivalry in self.active_rivalries
                if rivalry.active
            ],
            "top_wrestlers": [
                {
                    "name": wrestler.name,
                    "popularity": round(wrestler.popularity, 2),
                    "stamina": round(wrestler.stamina, 2),
                    "alignment": wrestler.alignment,
                    "injured_weeks": wrestler.injured_weeks,
                }
                for wrestler in sorted(self.wrestlers.values(), key=lambda w: w.popularity, reverse=True)
            ],
        }


if __name__ == "__main__":
    sim = WrestlingSimulator("data", seed=42)
    options = sim.feud_options()[:5]
    if options:
        first = options[0]
        sim.create_rivalry(first[0], [first[1], first[2]])
    for _ in range(3):
        print(json.dumps(sim.auto_book_weekly_show(), indent=2))
