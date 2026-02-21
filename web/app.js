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
  document.getElementById("meta-week").textContent = `WEEK ${state.week}`;
  document.getElementById("meta-event").textContent = state.event;

  const kpis = document.getElementById("meta-kpis");
  kpis.innerHTML = `
    <article class="kpi"><small>HYPE</small><strong>${state.hype}</strong></article>
    <article class="kpi"><small>VIEWERS</small><strong>${state.viewers.toLocaleString()}</strong></article>
    <article class="kpi"><small>ROSTER</small><strong>${state.top_wrestlers.length}</strong></article>
  `;

  const rivalryList = document.getElementById("rivalries");
  rivalryList.innerHTML = "";
  if (!state.active_rivalries.length) {
    rivalryList.innerHTML = "<li class='muted'>No active rivalries</li>";
  } else {
    for (const rivalry of state.active_rivalries) {
      const li = document.createElement("li");
      li.textContent = `${rivalry.rivalry_type}: ${rivalry.rivals.join(" vs ")} (L${rivalry.level}, idle ${rivalry.weeks_not_featured}w)`;
      rivalryList.appendChild(li);
    }
  }
}

function renderResult(result) {
  const grid = document.getElementById("booking-grid");
  grid.innerHTML = "";

  const slots = [];
  for (const match of result.matches) {
    slots.push({
      title: match.type,
      body: match.participants.join(" vs "),
      rating: `⭐ ${match.rating}${match.title_match ? " • TITLE" : ""}`,
    });
  }
  for (const segment of result.segments) {
    slots.push({
      title: segment.type,
      body: segment.participants.join(", "),
      rating: `⭐ ${segment.rating}`,
    });
  }

  while (slots.length < 8) {
    slots.push({ title: "OPEN SLOT", body: "Add Match / Segment", rating: "" });
  }

  for (const slot of slots.slice(0, 10)) {
    const card = document.createElement("article");
    card.className = "slot";
    card.innerHTML = `<div><b>${slot.title}</b><div>${slot.body}</div><div class="muted">${slot.rating}</div></div>`;
    grid.appendChild(card);
  }
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
    btn.textContent = "ACCEPT";
    btn.onclick = async () => {
      await postJSON("/api/create-rivalry", { rivalry_type: option.rivalry_type, ids: option.ids });
      await refresh();
    };
    row.appendChild(label);
    row.appendChild(btn);
    container.appendChild(row);
  }

  if (!data.options.length) {
    container.innerHTML = "<div class='muted'>No options this week.</div>";
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
    document.getElementById("booking-grid").innerHTML = "";
    await refresh();
  };

  await refresh();
});
