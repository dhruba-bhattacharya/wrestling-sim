async function getJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function postJSON(url, payload = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

function renderState(state) {
  document.getElementById("meta").textContent =
    `Week ${state.week} • ${state.event} • Hype ${state.hype} • Viewers ${state.viewers.toLocaleString()}`;

  const rivalryList = document.getElementById("rivalries");
  rivalryList.innerHTML = "";
  if (!state.active_rivalries.length) {
    rivalryList.innerHTML = "<li class='muted'>No active rivalries</li>";
  } else {
    for (const rivalry of state.active_rivalries) {
      const li = document.createElement("li");
      li.textContent = `${rivalry.rivalry_type}: ${rivalry.rivals.join(" vs ")} (Level ${rivalry.level})`;
      rivalryList.appendChild(li);
    }
  }

  const roster = document.getElementById("roster");
  roster.innerHTML = "";
  for (const wrestler of state.top_wrestlers) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${wrestler.name}</td><td>${wrestler.popularity}</td><td>${wrestler.stamina}</td><td>${wrestler.alignment}</td><td>${wrestler.injured_weeks}</td>`;
    roster.appendChild(row);
  }
}

function renderResult(result) {
  const container = document.getElementById("show-result");
  const matches = result.matches.map((m) => `<li>${m.participants.join(" vs ")} (${m.type}) — ⭐ ${m.rating}</li>`).join("");
  const segments = result.segments.map((s) => `<li>${s.type}: ${s.participants.join(", ")} — ⭐ ${s.rating}</li>`).join("");
  container.classList.remove("muted");
  container.innerHTML = `
    <strong>${result.event} (Week ${result.week})</strong><br/>
    Show Rating: <b>${result.show_rating}</b><br/>
    <h4>Matches</h4><ul>${matches || "<li>None</li>"}</ul>
    <h4>Segments</h4><ul>${segments || "<li>None</li>"}</ul>
  `;
}

async function renderFeudOptions() {
  const data = await getJSON("/api/feud-options");
  const container = document.getElementById("feud-options");
  container.innerHTML = "";

  for (const option of data.options) {
    const row = document.createElement("div");
    row.className = "feud-option";
    const label = document.createElement("span");
    label.textContent = `${option.rivalry_type}: ${option.names[0]} vs ${option.names[1]}`;
    const btn = document.createElement("button");
    btn.textContent = "Start Feud";
    btn.onclick = async () => {
      await postJSON("/api/create-rivalry", { rivalry_type: option.rivalry_type, ids: option.ids });
      await refresh();
    };
    row.appendChild(label);
    row.appendChild(btn);
    container.appendChild(row);
  }

  if (!data.options.length) {
    container.innerHTML = "<div class='muted'>No options available this week.</div>";
  }
}

async function refresh() {
  const state = await getJSON("/api/state");
  renderState(state);
  await renderFeudOptions();
}

window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("refresh-btn").onclick = refresh;
  document.getElementById("play-btn").onclick = async () => {
    const data = await postJSON("/api/play-week");
    renderResult(data.result);
    renderState(data.state);
    await renderFeudOptions();
  };
  document.getElementById("reset-btn").onclick = async () => {
    await postJSON("/api/reset");
    document.getElementById("show-result").textContent = "Play a week to generate a card.";
    document.getElementById("show-result").classList.add("muted");
    await refresh();
  };

  await refresh();
});
