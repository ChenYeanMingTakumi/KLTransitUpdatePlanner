// ---------- Section 1: the four steps ----------
import {
  LINES,
  startLine, startStation, endLine, endStation,
  byId, findRoute, fmtKm,
  setSelection, resetSelection,
  nextDepartures, nowClock
} from "./router.js";

// Re-read live state at call time (module bindings are immutable snapshots per import)
function sel() {
  return { startLine, startStation, endLine, endStation };
}

function stepShell(elId, num, title, done) {
  const el = document.getElementById(elId);
  el.className = "step" + (done ? " step-done" : "");
  el.innerHTML = `<div class="step-title"><span class="step-num">${done ? "✓" : num}</span>${title}</div><div class="body"></div>`;
  return el.querySelector(".body");
}

function renderSteps() {
  // Step 1: starting line
  const s1 = stepShell("step-startline", 1, "Choose your starting line", !!startLine);
  const chips1 = document.createElement("div");
  chips1.className = "chips";
  LINES.forEach(l => {
    const b = document.createElement("button");
    b.className = "chip" + (l.id === startLine ? " on" : "");
    b.innerHTML = `<span class="dot" style="background:${l.color}"></span>${l.name}`;
    b.setAttribute("aria-pressed", l.id === startLine);
    b.onclick = () => {
      setSelection(startLine === l.id
        ? { startLine: null, startStation: null }
        : { startLine: l.id, startStation: null });
      renderAll();
    };
    chips1.appendChild(b);
  });
  s1.appendChild(chips1);

  // Step 2: starting station (only when a starting line is chosen)
  const s2 = stepShell("step-startstation", 2,
    startLine ? `Choose your starting station on the ${byId(startLine).name}` : "Choose your starting station",
    !!startStation);
  if (!startLine) {
    const note = document.createElement("p");
    note.className = "step-note";
    note.textContent = "Pick a starting line above first.";
    s2.appendChild(note);
  } else {
    const sl = byId(startLine);
    if (startStation) {
      const note = document.createElement("p");
      note.className = "step-note";
      note.innerHTML = `Start: <strong>${startStation}</strong> — tap another station to change it.`;
      s2.appendChild(note);
    }
    const st2 = document.createElement("div");
    st2.className = "stations";
    sl.stations.forEach(s => {
      const p = document.createElement("button");
      p.className = "station-pill" + (s.ic ? " ic" : "") + (s.n === startStation ? " on" : "");
      p.style.borderColor = s.run ? sl.color : "#c3ccd4";
      p.style.color = s.run ? "inherit" : "#9aa4ae";
      p.style.borderStyle = s.run ? "solid" : "dashed";
      p.style.background = s.run ? "#fff" : "#f2f4f6";
      p.innerHTML = `<span class="sdot" style="background:${s.run ? sl.color : "#b9c2cb"}"></span>${s.ic ? "◎ " : ""}${s.n}${s.run ? "" : " ✕"}`;
      p.title = s.run ? `${s.n}${s.ic ? " — interchange" : ""} — tap to set as start` : `${s.n} — suspended (cut short)`;
      p.onclick = () => { setSelection({ startStation: s.n }); renderAll(); };
      st2.appendChild(p);
    });
    s2.appendChild(st2);
  }

  // Step 3: ending line
  const s3 = stepShell("step-endline", 3, "Choose your ending line", !!endLine);
  const chips3 = document.createElement("div");
  chips3.className = "chips";
  LINES.forEach(l => {
    const b = document.createElement("button");
    b.className = "chip" + (l.id === endLine ? " on" : "");
    b.innerHTML = `<span class="dot" style="background:${l.color}"></span>${l.name}`;
    b.setAttribute("aria-pressed", l.id === endLine);
    b.onclick = () => {
      setSelection(endLine === l.id
        ? { endLine: null, endStation: null }
        : { endLine: l.id, endStation: null });
      renderAll();
    };
    chips3.appendChild(b);
  });
  s3.appendChild(chips3);

  // Step 4: ending station (only when an ending line is chosen)
  const s4 = stepShell("step-endstation", 4,
    endLine ? `Choose your ending station on the ${byId(endLine).name}` : "Choose your ending station",
    !!endStation);
  if (!endLine) {
    const note = document.createElement("p");
    note.className = "step-note";
    note.textContent = "Pick an ending line above first.";
    s4.appendChild(note);
  } else {
    const el = byId(endLine);
    if (endStation) {
      const note = document.createElement("p");
      note.className = "step-note";
      note.innerHTML = `End: <strong>${endStation}</strong> — tap another station to change it.`;
      s4.appendChild(note);
    }
    const st4 = document.createElement("div");
    st4.className = "stations";
    el.stations.forEach(s => {
      const p = document.createElement("button");
      p.className = "station-pill" + (s.ic ? " ic" : "") + (s.n === endStation ? " on" : "");
      p.style.borderColor = s.run ? el.color : "#c3ccd4";
      p.style.color = s.run ? "inherit" : "#9aa4ae";
      p.style.borderStyle = s.run ? "solid" : "dashed";
      p.style.background = s.run ? "#fff" : "#f2f4f6";
      p.innerHTML = `<span class="sdot" style="background:${s.run ? el.color : "#b9c2cb"}"></span>${s.ic ? "◎ " : ""}${s.n}${s.run ? "" : " ✕"}`;
      p.title = s.run ? `${s.n}${s.ic ? " — interchange" : ""} — tap to set as end` : `${s.n} — suspended (cut short)`;
      p.onclick = () => { setSelection({ endStation: s.n }); renderAll(); };
      st4.appendChild(p);
    });
    s4.appendChild(st4);
  }

  // Check button state + helper note
  const ready = !!(startLine && startStation && endLine && endStation);
  document.getElementById("btn-check").disabled = !ready;
  document.getElementById("actions-note").textContent = ready
    ? "All set — press Check to see the shortest available route."
    : startStation && endLine && !endStation ? "Now choose your ending station."
    : startStation && !endLine ? "Now choose your ending line."
    : startLine && !startStation ? "Now choose your starting station."
    : "Complete the four steps above to enable Check.";
}

// ---------- Section 2: status of the lines involved ----------
function renderStatus(route) {
  const el = document.getElementById("line-list");
  el.innerHTML = "";
  let ids = [startLine, endLine].filter(Boolean);
  if (route && route.status === "ok")
    route.legs.filter(l => !l.walk).forEach(l => { if (!ids.includes(l.line)) ids.push(l.line); });
  if (!ids.length) {
    el.innerHTML = `<p class="sub">Choose a starting line above to see its service state.</p>`;
    return;
  }
  ids.forEach(id => {
    const l = byId(id);
    const card = document.createElement("div");
    card.className = "line-card";
    const pill = l.status === "cut-short"
      ? `<span class="status-pill cut">Cut short</span>`
      : `<span class="status-pill ok">Normal</span>`;
    const onRoute = route && route.status === "ok" && route.legs.some(x => !x.walk && x.line === id);
    const role = id === startLine && id === endLine ? "starting &amp; ending line" :
                 id === startLine ? "starting line" :
                 id === endLine ? "ending line" : "used by your route";
    card.innerHTML = `
      <div class="line-head">
        <span style="color:${l.color};font-size:1.1rem">●</span>
        <span class="name">${l.name}</span>
        <span style="font-size:0.75rem;color:var(--ink-soft)">${onRoute ? "· " + role : ""}</span>${pill}
      </div>
      <div class="stations"></div>
      <div class="notice ${l.status === "cut-short" ? "cut" : "ok"}">
        <strong>${l.status === "cut-short" ? "Disruption notice" : "Service normal"}</strong>
        ${l.notice}
      </div>`;
    const st = card.querySelector(".stations");
    l.stations.forEach(s => {
      const p = document.createElement("span");
      p.className = "station-pill" + (s.ic ? " ic" : "");
      p.style.borderColor = s.run ? l.color : "#c3ccd4";
      p.style.color = s.run ? "inherit" : "#9aa4ae";
      p.style.borderStyle = s.run ? "solid" : "dashed";
      p.style.background = s.run ? "#fff" : "#f2f4f6";
      p.style.cursor = "default";
      p.innerHTML = `<span class="sdot" style="background:${s.run ? l.color : "#b9c2cb"}"></span>${s.ic ? "◎ " : ""}${s.n}${s.run ? "" : " ✕"}`;
      st.appendChild(p);
    });
    el.appendChild(card);
  });
}

// ---------- Section 3: result popout ----------
function legHTML(leg) {
  if (leg.walk) {
    const label = leg.from === leg.to ? `Walk transfer at ${leg.from}` : `Walk ${leg.from} → ${leg.to}`;
    return `<div class="leg walk"><span class="ldot" style="background:#9aa4ae"></span><span>${label} <span class="lmeta">· ${fmtKm(leg.dist)} km walking · ~${Math.round(leg.time)} min</span></span></div>`;
  }
  const l = byId(leg.line);
  return `<div class="leg"><span class="ldot" style="background:${l.color}"></span><span>${l.name}: ${leg.from} → ${leg.to} <span class="lmeta">· ${leg.stops} stop${leg.stops === 1 ? "" : "s"} · ${fmtKm(leg.dist)} km · ~${Math.round(leg.time)} min</span></span></div>`;
}

// Compact line-status block for the popout
function statusBlockHTML(route) {
  let ids = [startLine, endLine].filter(Boolean);
  if (route && route.status === "ok")
    route.legs.filter(l => !l.walk).forEach(l => { if (!ids.includes(l.line)) ids.push(l.line); });
  return `<h4 style="margin:18px 0 8px;font-size:0.92rem;">Line status</h4>` +
    ids.map(id => {
      const l = byId(id);
      const pill = l.status === "cut-short"
        ? `<span class="status-pill cut">Cut short</span>`
        : `<span class="status-pill ok">Normal</span>`;
      const running = l.stations.filter(s => s.run);
      const runRange = running.length
        ? `${running[0].n} → ${running[running.length - 1].n}`
        : "no service";
      return `<div class="line-card" style="margin-bottom:10px;">
        <div class="line-head">
          <span style="color:${l.color};font-size:1.1rem">●</span>
          <span class="name">${l.name}</span>${pill}
        </div>
        <div class="meta" style="font-size:0.85rem;color:var(--ink-soft)">${l.notice}</div>
        <div class="stations" style="margin-top:8px;">${l.stations.map(s => `
          <span class="station-pill" style="border-color:${s.run ? l.color : "#c3ccd4"};border-style:${s.run ? "solid" : "dashed"};background:${s.run ? "#fff" : "#f2f4f6"};color:${s.run ? "inherit" : "#9aa4ae"};cursor:default;">
            <span class="sdot" style="background:${s.run ? l.color : "#b9c2cb"}"></span>${s.ic ? "◎ " : ""}${s.n}${s.run ? "" : " ✕"}
          </span>`).join("")}</div>
      </div>`;
    }).join("");
}

// Real-time departures block for the first ride leg of the route
function departuresHTML(route) {
  if (route.status !== "ok") return "";
  const firstRide = route.legs.find(l => !l.walk);
  if (!firstRide) return "";
  const line = byId(firstRide.line);
  const deps = nextDepartures(firstRide.line, firstRide.from, 3).sort((a, b) => a.waitMin - b.waitMin);
  if (!deps.length) return "";
  const dirLabel = d => d === "fw" ? "toward the last station" : d === "bw" ? "toward the first station" : "";
  const items = deps.map(d => `
    <div class="dep-item">
      <span class="dep-time">${d.depart}</span>
      <span class="dep-wait">${d.tomorrow ? "tomorrow" : `in ${d.waitMin} min`}</span>
      ${d.dir ? `<span class="dep-dir">${dirLabel(d.dir)}</span>` : ""}
    </div>`).join("");
  const best = deps[0];
  const arrive = best ? toHHMMFromRoute(route, best) : null;
  return `<div class="departures">
    <div class="dep-head">
      <span class="dep-title">Next departures from ${firstRide.from}</span>
      <span class="dep-line" style="background:${line.color}">${line.name}</span>
    </div>
    <div class="dep-list">${items}</div>
    ${arrive ? `<div class="dep-arrive">If you board the ${best.depart} departure, you arrive at ${route.to} at about <strong>${arrive}</strong>.</div>` : ""}
    <div class="dep-note">Computed from your device clock (${nowClock()}) against the embedded weekday timetables — sample schedule data, not a live feed.</div>
  </div>`;
}

function toHHMMFromRoute(route, dep) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const boardMin = nowMin + (dep.tomorrow ? dep.waitMin : dep.waitMin);
  const arriveMin = boardMin + Math.round(route.totalTime);
  const mm = ((arriveMin % 1440) + 1440) % 1440;
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`;
}

function openModal(route) {
  const backdrop = document.getElementById("modal-backdrop");
  const title = document.getElementById("modal-title");
  const sub = document.getElementById("modal-sub");
  const body = document.getElementById("modal-body");
  title.textContent = `${route.from} → ${route.to}`;

  if (route.status !== "ok") {
    sub.textContent = "No available route for this trip.";
    body.innerHTML = `<div class="journey-card unavailable">
      <div class="time">Not available</div>
      <div class="meta">${route.reason}</div>
    </div>` + statusBlockHTML(route);
  } else {
    const rides = route.legs.filter(l => !l.walk);
    const walks = route.legs.filter(l => l.walk);
    const lineNames = rides.map(l => byId(l.line).name);
    const explain = rides.length === 1
      ? `Shortest available route: direct service on one line — ${lineNames[0]}.`
      : `Shortest available route: ${rides.length} line segments (${lineNames.join(" → ")}) with ${walks.length} interchange${walks.length === 1 ? "" : "s"}.`;
    sub.textContent = explain;
    body.innerHTML = `
      <div class="totals-hero">
        <div class="th"><span class="lbl">Total distance</span><span class="val">${fmtKm(route.totalDist)} km</span></div>
        <div class="th"><span class="lbl">Total time</span><span class="val">~${Math.round(route.totalTime)} min${route.walkTime ? ` <small>incl. ~${Math.round(route.walkTime)} min walking</small>` : ""}</span></div>
        ${route.walkTime ? `<div class="th"><span class="lbl">Walking at interchanges</span><span class="val">${fmtKm(route.walkDist)} km <small>· ~${Math.round(route.walkTime)} min</small></span></div>` : ""}
      </div>
      ${departuresHTML(route)}
      <div class="legs">${route.legs.map(legHTML).join("")}</div>
      <div class="snap" style="margin-top:10px;font-size:0.78rem;color:var(--ink-soft)">Sample figures only — not real distances or timetables.</div>` +
      statusBlockHTML(route);
  }
  backdrop.hidden = false;
  document.getElementById("modal-close").focus();
}

function closeModal() {
  document.getElementById("modal-backdrop").hidden = true;
}

function renderAll() {
  renderSteps();
  renderStatus(null);
}

// ---------- Module exports ----------
export { renderAll, openModal, closeModal };
