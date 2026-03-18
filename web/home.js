const TOTAL_BUDGET = 120;

const wrestlers = [
  { id: 1, name: "Rex Rampage", nickname: "The Neon Mauler", weightClass: "Heavyweight", style: "Power Brawler", overall: 94, charisma: 90, stamina: 83, technique: 79, popularity: 88, finisher: "Chromedown Lariat", hometown: "Las Vegas, NV", cost: 21, quote: "Turns arenas into riots.", colors: ["#ff5f6d", "#ffc371"] },
  { id: 2, name: "Mika Volt", nickname: "Static Queen", weightClass: "Cruiserweight", style: "Aerial Striker", overall: 91, charisma: 95, stamina: 89, technique: 84, popularity: 86, finisher: "Voltage Spiral", hometown: "Osaka, Japan", cost: 18, quote: "Fast enough to blur the hard cam.", colors: ["#7f5cff", "#48c6ef"] },
  { id: 3, name: "Atlas Stone", nickname: "The Foundation", weightClass: "Super Heavyweight", style: "Technical Powerhouse", overall: 92, charisma: 76, stamina: 81, technique: 90, popularity: 80, finisher: "Granite Drop", hometown: "Denver, CO", cost: 17, quote: "Built for main events and title runs.", colors: ["#7f7fd5", "#86a8e7"] },
  { id: 4, name: "Jett Valencia", nickname: "Golden Trigger", weightClass: "Light Heavyweight", style: "Showboat Striker", overall: 89, charisma: 92, stamina: 87, technique: 78, popularity: 90, finisher: "Flashpoint Knee", hometown: "Miami, FL", cost: 16, quote: "Steals scenes and signatures.", colors: ["#f7971e", "#ffd200"] },
  { id: 5, name: "Sable Saint", nickname: "Cathedral of Chaos", weightClass: "Women’s Heavyweight", style: "Submission Specialist", overall: 90, charisma: 84, stamina: 86, technique: 93, popularity: 82, finisher: "Halo Lock", hometown: "Montreal, QC", cost: 15, quote: "Makes tap-outs look sacred.", colors: ["#c471f5", "#fa71cd"] },
  { id: 6, name: "Knox Mercer", nickname: "Iron Gospel", weightClass: "Heavyweight", style: "Hardcore Bruiser", overall: 87, charisma: 80, stamina: 78, technique: 75, popularity: 85, finisher: "Mercy Driver", hometown: "Detroit, MI", cost: 14, quote: "Every match feels like a grudge.", colors: ["#eb3349", "#f45c43"] },
  { id: 7, name: "Nova Mirage", nickname: "Skyline Siren", weightClass: "Women’s Cruiserweight", style: "Hybrid Acrobat", overall: 88, charisma: 89, stamina: 92, technique: 81, popularity: 83, finisher: "Afterglow Press", hometown: "Phoenix, AZ", cost: 14, quote: "Every leap becomes a highlight.", colors: ["#654ea3", "#eaafc8"] },
  { id: 8, name: "Diesel Dominion", nickname: "Freight Train", weightClass: "Super Heavyweight", style: "Monster Heel", overall: 90, charisma: 72, stamina: 74, technique: 77, popularity: 84, finisher: "Terminal Crush", hometown: "Houston, TX", cost: 15, quote: "Book him if you want fear on the poster.", colors: ["#232526", "#414345"] },
  { id: 9, name: "Zara Zero", nickname: "Codebreaker", weightClass: "Women’s Light Heavyweight", style: "Technical Striker", overall: 86, charisma: 88, stamina: 84, technique: 87, popularity: 79, finisher: "Zero Day Kick", hometown: "London, UK", cost: 13, quote: "Precision offense, premium upside.", colors: ["#141e30", "#243b55"] },
  { id: 10, name: "Bishop Black", nickname: "Midnight Verdict", weightClass: "Heavyweight", style: "Ring General", overall: 93, charisma: 87, stamina: 82, technique: 92, popularity: 89, finisher: "Judgement Bomb", hometown: "Chicago, IL", cost: 20, quote: "A franchise-level closer.", colors: ["#0f2027", "#2c5364"] },
  { id: 11, name: "Cass Blaze", nickname: "Wildfire", weightClass: "Cruiserweight", style: "Pure Babyface", overall: 84, charisma: 91, stamina: 88, technique: 76, popularity: 81, finisher: "Phoenix Arc", hometown: "San Diego, CA", cost: 11, quote: "Merchandise machine with comeback energy.", colors: ["#ff512f", "#dd2476"] },
  { id: 12, name: "Titan Rei", nickname: "Solar Breaker", weightClass: "Heavyweight", style: "Strong Style", overall: 88, charisma: 77, stamina: 90, technique: 85, popularity: 78, finisher: "Dawn Hammer", hometown: "Sapporo, Japan", cost: 13, quote: "Touring ace with brutal offense.", colors: ["#f12711", "#f5af19"] },
  { id: 13, name: "Velvet Vane", nickname: "Main Event Muse", weightClass: "Women’s Heavyweight", style: "Character Worker", overall: 87, charisma: 94, stamina: 79, technique: 80, popularity: 92, finisher: "Curtain Call Cutter", hometown: "Atlanta, GA", cost: 16, quote: "Can talk audiences into any match.", colors: ["#8360c3", "#2ebf91"] },
  { id: 14, name: "Grim Hollow", nickname: "Last Bell", weightClass: "Heavyweight", style: "Undead Brawler", overall: 85, charisma: 86, stamina: 73, technique: 74, popularity: 87, finisher: "Tomb Echo Slam", hometown: "Parts Unknown", cost: 12, quote: "Instant aura for spooky storylines.", colors: ["#1d2b64", "#f8cdda"] },
  { id: 15, name: "Aria Prism", nickname: "Spectrum Shot", weightClass: "Women’s Cruiserweight", style: "High-Flyer", overall: 89, charisma: 90, stamina: 91, technique: 82, popularity: 84, finisher: "Prism Break Moonsault", hometown: "Los Angeles, CA", cost: 15, quote: "Premium pace and premium presentation.", colors: ["#12c2e9", "#c471ed"] },
  { id: 16, name: "Colossus Cade", nickname: "The Lockout", weightClass: "Super Heavyweight", style: "Power Monster", overall: 86, charisma: 71, stamina: 76, technique: 73, popularity: 80, finisher: "Gatekeeper Chokeslam", hometown: "Birmingham, UK", cost: 12, quote: "A human paywall in the main event.", colors: ["#4b6cb7", "#182848"] },
  { id: 17, name: "Luna Luxe", nickname: "Velvet Guillotine", weightClass: "Women’s Light Heavyweight", style: "Submission Artist", overall: 88, charisma: 85, stamina: 85, technique: 91, popularity: 83, finisher: "Moonlit Vice", hometown: "Paris, France", cost: 14, quote: "Elite mat game with star entrance energy.", colors: ["#fc5c7d", "#6a82fb"] },
  { id: 18, name: "Mason Riot", nickname: "Crowd Splitter", weightClass: "Light Heavyweight", style: "Antihero Brawler", overall: 87, charisma: 89, stamina: 80, technique: 79, popularity: 88, finisher: "Barricade Breaker", hometown: "Philadelphia, PA", cost: 14, quote: "Perfect for heated faction wars.", colors: ["#b24592", "#f15f79"] },
  { id: 19, name: "Echo Ember", nickname: "The Last Spark", weightClass: "Cruiserweight", style: "Counter Wrestler", overall: 83, charisma: 82, stamina: 90, technique: 84, popularity: 75, finisher: "Reverb Kick", hometown: "Seattle, WA", cost: 10, quote: "Low-cost value pick with serious upside.", colors: ["#56ab2f", "#a8e063"] },
  { id: 20, name: "Oracle Orion", nickname: "Future Perfect", weightClass: "Heavyweight", style: "Analytics Savant", overall: 90, charisma: 83, stamina: 88, technique: 89, popularity: 81, finisher: "Prediction Plex", hometown: "Austin, TX", cost: 16, quote: "Does everything at a winning level.", colors: ["#614385", "#516395"] },
];

function createInitialState() {
  return {
    budget: TOTAL_BUDGET,
    playerRoster: [],
    cpuRoster: [],
    available: [...wrestlers],
    selectedId: wrestlers[0].id,
    round: 1,
    draftEnded: false,
    log: ["Commissioner: Welcome to Dynasty Draft Night. Your clock is live."],
    history: [],
    lastAnnouncementId: 0,
  };
}

const state = createInitialState();
let announcementTimer = null;

function createPortrait(wrestler) {
  const initials = wrestler.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${wrestler.colors[0]}" />
          <stop offset="100%" stop-color="${wrestler.colors[1]}" />
        </linearGradient>
      </defs>
      <rect width="320" height="360" rx="24" fill="#090b12"/>
      <rect x="18" y="18" width="284" height="324" rx="20" fill="url(#g)" opacity="0.95"/>
      <circle cx="160" cy="126" r="62" fill="rgba(255,255,255,0.20)"/>
      <path d="M85 290c18-51 56-79 75-79s57 28 75 79" fill="rgba(10,11,18,0.34)"/>
      <text x="160" y="155" text-anchor="middle" font-size="60" font-family="Arial, sans-serif" fill="#ffffff" font-weight="700">${initials}</text>
      <text x="160" y="314" text-anchor="middle" font-size="22" font-family="Arial, sans-serif" fill="#ffffff" letter-spacing="4">${wrestler.weightClass.toUpperCase()}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function currency(amount) {
  return `$${amount}`;
}

function getSelected() {
  return state.available.find((wrestler) => wrestler.id === state.selectedId) ?? state.available[0] ?? null;
}

function ratingValue(wrestler) {
  return wrestler.overall + wrestler.popularity * 0.35 + wrestler.charisma * 0.2;
}

function pushLog(message) {
  state.log.push(message);
}

function recordHistory(side, wrestler, message) {
  state.history.push({
    id: `${side}-${wrestler.id}-${state.history.length + 1}`,
    side,
    wrestler,
    round: state.round,
    message,
  });
}

function announcePick(side, wrestler, subtitle) {
  const overlay = document.getElementById("announcement-overlay");
  overlay.classList.remove("show", "player", "cpu");
  void overlay.offsetWidth;
  overlay.classList.add("show", side);
  overlay.setAttribute("aria-hidden", "false");
  document.getElementById("announcement-label").textContent = side === "player" ? "Your pick is official" : "CPU counter-pick";
  document.getElementById("announcement-name").textContent = wrestler.name;
  document.getElementById("announcement-meta").textContent = subtitle;

  clearTimeout(announcementTimer);
  announcementTimer = window.setTimeout(() => {
    overlay.classList.remove("show", "player", "cpu");
    overlay.setAttribute("aria-hidden", "true");
  }, 1800);
}

function renderBoard() {
  const board = document.getElementById("draft-board");
  board.innerHTML = "";

  state.available.forEach((wrestler, index) => {
    const card = document.createElement("button");
    card.className = "draft-pick-card";
    card.style.animationDelay = `${index * 24}ms`;
    if (wrestler.id === state.selectedId) {
      card.classList.add("selected");
    }
    if (state.draftEnded) {
      card.disabled = true;
    }

    const affordable = wrestler.cost <= state.budget;
    if (!affordable && !state.draftEnded) {
      card.classList.add("too-expensive");
    }

    card.innerHTML = `
      <span class="pick-topline">${wrestler.weightClass}</span>
      <strong>${wrestler.name}</strong>
      <span class="pick-meta">OVR ${wrestler.overall} • ${wrestler.style}</span>
      <div class="pick-stats-inline">
        <span>POP ${wrestler.popularity}</span>
        <span>CHA ${wrestler.charisma}</span>
      </div>
      <span class="pick-cost">${currency(wrestler.cost)}</span>
    `;

    card.onclick = () => {
      state.selectedId = wrestler.id;
      render();
    };
    board.appendChild(card);
  });

  document.getElementById("pool-status").textContent = `${state.available.length} on the board`;
}

function renderProspect() {
  const wrestler = getSelected();
  const container = document.getElementById("prospect-card");
  if (!wrestler) {
    container.innerHTML = `<div class="empty-state">Draft complete. No talent remains on the board.</div>`;
    return;
  }

  const canAfford = wrestler.cost <= state.budget;
  const confidence = Math.min(99, Math.round((ratingValue(wrestler) / 135) * 100));
  container.innerHTML = `
    <div class="prospect-visual" style="--accent-a:${wrestler.colors[0]}; --accent-b:${wrestler.colors[1]};">
      <img src="${createPortrait(wrestler)}" alt="${wrestler.name} portrait" />
      <div class="prospect-badge ${canAfford ? "" : "danger"}">${canAfford ? "Draftable" : "Over Budget"}</div>
      <div class="prospect-confidence">
        <span>Scout Confidence</span>
        <strong>${confidence}%</strong>
      </div>
    </div>
    <div class="prospect-header">
      <div>
        <p class="tiny">${wrestler.nickname}</p>
        <h2>${wrestler.name}</h2>
        <p class="muted">${wrestler.hometown} • ${wrestler.style}</p>
      </div>
      <div class="prospect-price">${currency(wrestler.cost)}</div>
    </div>
    <p class="prospect-quote">“${wrestler.quote}”</p>
    <div class="attribute-grid">
      <div><span>Overall</span><strong>${wrestler.overall}</strong></div>
      <div><span>Popularity</span><strong>${wrestler.popularity}</strong></div>
      <div><span>Charisma</span><strong>${wrestler.charisma}</strong></div>
      <div><span>Technique</span><strong>${wrestler.technique}</strong></div>
      <div><span>Stamina</span><strong>${wrestler.stamina}</strong></div>
      <div><span>Class</span><strong>${wrestler.weightClass}</strong></div>
    </div>
    <div class="prospect-finisher">
      <span>Finisher</span>
      <strong>${wrestler.finisher}</strong>
    </div>
    <button id="draft-now-btn" class="draft-now-btn" ${canAfford && !state.draftEnded ? "" : "disabled"}>
      ${state.draftEnded ? "Draft Closed" : canAfford ? `Draft ${wrestler.name}` : "Not Enough Budget"}
    </button>
  `;

  const draftButton = document.getElementById("draft-now-btn");
  if (draftButton) {
    draftButton.onclick = () => makePlayerPick(wrestler.id);
  }
}

function renderRoster(containerId, roster, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!roster.length) {
    container.innerHTML = `<div class="empty-state">${type === "player" ? "Your drafted stars will appear here." : "The CPU has not answered yet."}</div>`;
    return;
  }

  roster.forEach((wrestler, index) => {
    const card = document.createElement("article");
    card.className = `roster-card ${type === "player" ? "player" : "cpu"}`;
    if (index === roster.length - 1) {
      card.classList.add("pick-flash");
    }
    card.innerHTML = `
      <div class="roster-thumb" style="background: linear-gradient(135deg, ${wrestler.colors[0]}, ${wrestler.colors[1]});">${wrestler.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
      <div>
        <strong>${wrestler.name}</strong>
        <div class="muted">${wrestler.weightClass} • ${wrestler.style}</div>
      </div>
      <div class="roster-cost">${currency(wrestler.cost)}</div>
    `;
    container.appendChild(card);
  });
}

function renderLog() {
  const log = document.getElementById("draft-log");
  log.innerHTML = state.log.slice().reverse().map((entry, index) => `<div class="log-entry" style="animation-delay:${index * 35}ms">${entry}</div>`).join("");
}

function renderHistory() {
  const container = document.getElementById("pick-history");
  if (!state.history.length) {
    container.innerHTML = `<div class="empty-state">Every draft selection will leave a trail here.</div>`;
    return;
  }

  container.innerHTML = state.history.slice().reverse().map((item) => `
    <article class="history-chip ${item.side}">
      <span>R${item.round}</span>
      <strong>${item.wrestler.name}</strong>
      <small>${item.side === "player" ? "You" : "CPU"} • ${currency(item.wrestler.cost)}</small>
    </article>
  `).join("");
}

function renderScoreboard() {
  const playerCost = state.playerRoster.reduce((sum, wrestler) => sum + wrestler.cost, 0);
  const cpuCost = state.cpuRoster.reduce((sum, wrestler) => sum + wrestler.cost, 0);
  const spendRatio = Math.min(100, Math.round((playerCost / TOTAL_BUDGET) * 100));

  document.getElementById("budget-remaining").textContent = currency(state.budget);
  document.getElementById("budget-spent").textContent = `Spent: ${currency(playerCost)}`;
  document.getElementById("player-count").textContent = `${state.playerRoster.length} Picks`;
  document.getElementById("player-total-cost").textContent = `Total Cost: ${currency(playerCost)}`;
  document.getElementById("cpu-count").textContent = `${state.cpuRoster.length} Picks`;
  document.getElementById("cpu-total-cost").textContent = `Total Cost: ${currency(cpuCost)}`;
  document.getElementById("round-indicator").textContent = `Round ${state.round}`;
  document.getElementById("turn-indicator").textContent = state.draftEnded
    ? "Draft complete"
    : state.available.length
      ? "Your pick is live"
      : "Board exhausted";
  document.getElementById("turn-meter-fill").style.width = `${spendRatio}%`;
}

function removeFromAvailable(id) {
  const index = state.available.findIndex((wrestler) => wrestler.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = state.available.splice(index, 1);
  state.selectedId = state.available[0]?.id ?? null;
  return removed;
}

function chooseCpuPick() {
  return state.available
    .slice()
    .sort((a, b) => ratingValue(b) - ratingValue(a))[0] ?? null;
}

function maybeEndDraft(reason) {
  if (state.draftEnded) {
    return;
  }
  const affordableExists = state.available.some((wrestler) => wrestler.cost <= state.budget);
  if (!state.available.length || !affordableExists) {
    state.draftEnded = true;
    pushLog(reason ?? "Commissioner: Draft is officially closed.");
  }
}

function processPick(side, wrestler, roster, budgetImpact = 0) {
  removeFromAvailable(wrestler.id);
  roster.push(wrestler);
  state.budget -= budgetImpact;
  const actionText = side === "player"
    ? `You drafted ${wrestler.name} for ${currency(wrestler.cost)}.`
    : `CPU drafted ${wrestler.name} for ${currency(wrestler.cost)}.`;
  pushLog(actionText);
  recordHistory(side, wrestler, actionText);
  announcePick(side, wrestler, `${wrestler.weightClass} • ${wrestler.style} • ${currency(wrestler.cost)}`);
}

function makePlayerPick(id) {
  if (state.draftEnded) {
    return;
  }
  const wrestler = state.available.find((candidate) => candidate.id === id);
  if (!wrestler || wrestler.cost > state.budget) {
    pushLog(`Commissioner: ${wrestler?.name ?? "That pick"} cannot be submitted under your budget.`);
    render();
    return;
  }

  processPick("player", wrestler, state.playerRoster, wrestler.cost);

  const cpuPick = chooseCpuPick();
  if (cpuPick) {
    window.setTimeout(() => {
      processPick("cpu", cpuPick, state.cpuRoster, 0);
      state.round += 1;
      maybeEndDraft("Commissioner: No affordable talent remains. Your draft room is locked.");
      render();
    }, 450);
  } else {
    state.round += 1;
    maybeEndDraft("Commissioner: No affordable talent remains. Your draft room is locked.");
  }

  render();
}

function forceCpuPick() {
  if (state.draftEnded) {
    return;
  }
  const cpuPick = chooseCpuPick();
  if (!cpuPick) {
    maybeEndDraft();
    render();
    return;
  }

  processPick("cpu", cpuPick, state.cpuRoster, 0);
  state.round += 1;
  maybeEndDraft("Commissioner: The final card has been spoken for.");
  render();
}

function endDraft() {
  if (!state.draftEnded) {
    state.draftEnded = true;
    pushLog(`Commissioner: Draft ended by user. Final roster count: ${state.playerRoster.length}.`);
  }
  render();
}

function resetDraft() {
  Object.assign(state, createInitialState());
  pushLog("Commissioner: Draft board has been reset for a fresh run.");
  clearTimeout(announcementTimer);
  document.getElementById("announcement-overlay").classList.remove("show", "player", "cpu");
  render();
}

function render() {
  renderBoard();
  renderProspect();
  renderRoster("player-roster", state.playerRoster, "player");
  renderRoster("cpu-roster", state.cpuRoster, "cpu");
  renderLog();
  renderHistory();
  renderScoreboard();

  document.getElementById("auto-pick-btn").disabled = state.draftEnded || !state.available.length;
  document.getElementById("end-draft-btn").disabled = state.draftEnded;
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("auto-pick-btn").onclick = forceCpuPick;
  document.getElementById("end-draft-btn").onclick = endDraft;
  document.getElementById("reset-draft-btn").onclick = resetDraft;
  render();
});
