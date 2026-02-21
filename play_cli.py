from __future__ import annotations

import json
from pathlib import Path

from simulator import WrestlingSimulator


def print_header(sim: WrestlingSimulator) -> None:
    state = sim.to_state()
    print("\n" + "=" * 72)
    print(f"Week {state['week']} | Event: {state['event']} | Hype: {state['hype']} | Viewers: {state['viewers']}")
    print("=" * 72)


def pick_rivalries(sim: WrestlingSimulator) -> None:
    options = sim.feud_options_with_names()
    if not options:
        print("No feud options available this week.")
        return

    print("\nAvailable feud options:")
    for i, opt in enumerate(options, start=1):
        print(f"  [{i}] {opt['rivalry_type']}: {opt['names'][0]} vs {opt['names'][1]}")
    print("  [0] Continue without adding a feud")

    while True:
        raw = input("Choose feud index to add (or 0): ").strip()
        if raw == "0":
            return
        if raw.isdigit() and 1 <= int(raw) <= len(options):
            selected = options[int(raw) - 1]
            sim.create_rivalry(selected["rivalry_type"], selected["ids"])
            print(f"Added feud: {selected['rivalry_type']} ({selected['names'][0]} vs {selected['names'][1]})")
            return
        print("Invalid choice.")


def print_show(result: dict) -> None:
    print("\n" + "-" * 72)
    print(f"{result['event']} (Week {result['week']}) | Show Rating: {result['show_rating']}")
    print("-" * 72)

    if result["matches"]:
        print("Matches:")
        for match in result["matches"]:
            participants = " vs ".join(match["participants"])
            print(f"  - {participants} [{match['type']}] => ⭐ {match['rating']}")

    if result["segments"]:
        print("Segments:")
        for seg in result["segments"]:
            print(f"  - {seg['type']} ({', '.join(seg['participants'])}) => ⭐ {seg['rating']}")


def main() -> None:
    sim = WrestlingSimulator(Path("data"), seed=42)

    print("Ultimate Wrestling Simulator - CLI Mode")
    print("Commands: [p]lay week, [f]eud setup, [s]tate, [q]uit")

    while True:
        print_header(sim)
        command = input("Enter command (p/f/s/q): ").strip().lower()

        if command == "q":
            print("Goodbye, booker.")
            return

        if command == "s":
            print(json.dumps(sim.to_state(), indent=2))
            continue

        if command == "f":
            pick_rivalries(sim)
            continue

        if command == "p":
            result = sim.auto_book_weekly_show()
            print_show(result)
            continue

        print("Unknown command.")


if __name__ == "__main__":
    main()
