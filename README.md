# Ultimate Wrestling Simulator (Prototype)

This project now includes a playable browser UI for the simulation.

## What's implemented

- JSON-backed roster/championship/rivalry loading.
- Event calendar support for weekly Dynamite, TV specials, and PPVs.
- Feud option generation and rivalry creation.
- Auto-booking that prioritizes popularity + stamina.
- Singles match rating logic with rivalry history, alignment bonus, match boost, random variance, and quarter-star rounding.
- TV special / PPV rating modifiers.
- Stamina, exhaustion, injury chances, and weekly recovery.
- Basic self-promo segments and show-level hype/viewers progression.
- **Browser UI** to:
  - review feud options
  - start rivalries
  - simulate the next week
  - view latest show card and roster status
  - reset the game state

## Run (Web UI)

```bash
python3 app.py
```

Then open: `http://localhost:8000`

## Run (CLI Play Mode)

```bash
python3 play_cli.py
```

This gives you an interactive terminal game loop for feud setup + week simulation.

## Data files

The `data/` directory includes starter JSON files matching your requested schema:

- `wrestlers.json`
- `factions.json`
- `rivalry.json`
- `championships.json`
- `contract.json`
- `industry.json`
- `injury.json`
