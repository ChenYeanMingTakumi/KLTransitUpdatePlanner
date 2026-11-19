// ---------- State ----------
import { LINES, WALK_TRANSFERS, WALK_SAME_NAME, WALK_NAMED_PAIR } from "./data.js";

let startLine = null;
let startStation = null;
let endLine = null;
let endStation = null;

const byId = id => LINES.find(l => l.id === id);

// ---------- Routing (shortest available route across all lines) ----------
function buildGraph(allowSuspended) {
  const edges = new Map();
  const key = (lineId, name) => lineId + "|" + name;
  const push = (a, b, props) => {
    if (!edges.has(a)) edges.set(a, []);
    edges.get(a).push({ to: b, fromName: a.split("|")[1], toName: b.split("|")[1], ...props });
    if (!edges.has(b)) edges.set(b, []);
    edges.get(b).push({ to: a, fromName: b.split("|")[1], toName: a.split("|")[1], ...props });
  };
  const ok = s => allowSuspended || s.run;

  LINES.forEach(l => {
    for (let i = 0; i < l.stations.length - 1; i++) {
      const a = l.stations[i], b = l.stations[i + 1];
      if (ok(a) && ok(b))
        push(key(l.id, a.n), key(l.id, b.n),
             { line: l.id, time: l.minPerStop, dist: l.kmPerStop, walk: false });
    }
  });

  const byName = new Map();
  LINES.forEach(l => l.stations.forEach(s => {
    if (!byName.has(s.n)) byName.set(s.n, []);
    byName.get(s.n).push({ line: l, st: s });
  }));

  byName.forEach((arr, name) => {
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++)
        if (ok(arr[i].st) && ok(arr[j].st))
          push(key(arr[i].line.id, name), key(arr[j].line.id, name),
               { walk: true, ...WALK_SAME_NAME });
  });

  WALK_TRANSFERS.forEach(([a, b]) => {
    (byName.get(a) || []).forEach(x =>
      (byName.get(b) || []).forEach(y => {
        if (ok(x.st) && ok(y.st))
          push(key(x.line.id, a), key(y.line.id, b), { walk: true, ...WALK_NAMED_PAIR });
      }));
  });

  return { edges, byName, key };
}

function dijkstra(graph, startKey, endKey) {
  const { edges } = graph;
  const dist = new Map(), prev = new Map();
  dist.set(startKey, 0);
  const pq = [{ n: startKey, d: 0 }];
  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { n, d } = pq.shift();
    if (d > (dist.get(n) ?? Infinity)) continue;
    if (n === endKey) break;
    (edges.get(n) || []).forEach(e => {
      const nd = d + e.time;
      if (nd < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, nd);
        prev.set(e.to, { from: n, edge: e });
        pq.push({ n: e.to, d: nd });
      }
    });
  }
  if (!dist.has(endKey)) return null;
  const path = [];
  let cur = endKey;
  while (prev.has(cur)) { const p = prev.get(cur); path.unshift(p.edge); cur = p.from; }
  return { time: dist.get(endKey), edges: path };
}

function findRoute() {
  const out = { from: startStation, to: endStation };
  const sl = byId(startLine), el = byId(endLine);
  const sSt = sl.stations.find(s => s.n === startStation);
  const eSt = el.stations.find(s => s.n === endStation);
  if (!sSt.run) return { ...out, status: "unavailable", reason: `The starting station (${startStation}) is in the suspended section of ${sl.name} — service there is cut short.` };
  if (!eSt.run) return { ...out, status: "unavailable", reason: `The ending station (${endStation}) is in the suspended section of ${el.name} — service there is cut short.` };
  const graph = buildGraph(false);
  const res = dijkstra(graph, graph.key(startLine, startStation), graph.key(endLine, endStation));
  if (!res) {
    const anyGraph = buildGraph(true);
    const anyRes = dijkstra(anyGraph, anyGraph.key(startLine, startStation), anyGraph.key(endLine, endStation));
    return { ...out, status: "unavailable", reason: anyRes
      ? "No available route — every connection between these stations crosses a suspended section."
      : "These stations are not connected on the sample network." };
  }

  const legs = [];
  res.edges.forEach(e => {
    const last = legs[legs.length - 1];
    if (!e.walk && last && !last.walk && last.line === e.line) {
      last.to = e.toName; last.stops++; last.time += e.time; last.dist += e.dist;
    } else {
      legs.push(e.walk
        ? { walk: true, from: e.fromName, to: e.toName, time: e.time, dist: e.dist }
        : { walk: false, line: e.line, from: e.fromName, to: e.toName, stops: 1, time: e.time, dist: e.dist });
    }
  });
  const totalTime = legs.reduce((s, l) => s + l.time, 0);
  const totalDist = legs.reduce((s, l) => s + l.dist, 0);
  const walkTime = legs.filter(l => l.walk).reduce((s, l) => s + l.time, 0);
  const walkDist = legs.filter(l => l.walk).reduce((s, l) => s + l.dist, 0);
  return { ...out, status: "ok", legs, totalTime, totalDist, walkTime, walkDist };
}

const fmtKm = d => (Math.round(d * 10) / 10).toFixed(1);

// ---------- Real-time departure engine ----------
// Computes the next departures for a station on a line using the embedded timetables
// and the visitor's current clock. Returns [] when service has ended for the day.
import { KOMUTER_TIMETABLES, SERVICE_WINDOWS } from "./timetable.js";

const toMin = t => {           // "6:30" or "06:30" -> minutes since midnight
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = m => {          // minutes since midnight -> "HH:MM" (wraps past midnight)
  const mm = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`;
};

function nextDeparturesKomuter(lineId, stationName, count) {
  const tt = KOMUTER_TIMETABLES[lineId];
  if (!tt) return [];
  const idx = tt.stations.indexOf(stationName);
  if (idx < 0) return [];
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const out = [];
  for (const dir of ["fw", "bw"]) {
    const times = tt[dir][idx] || [];
    // next train departing this station in this direction (>= now, same day)
    let best = null;
    for (const t of times) {
      if (!t) continue;
      const m = toMin(t);
      if (m >= nowMin && (best === null || m < best)) best = m;
    }
    // service ended: show the first train tomorrow
    const fallback = times.filter(Boolean).map(toMin).sort((a, b) => a - b)[0];
    const dep = best !== null ? best : (fallback !== undefined ? fallback + 1440 : null);
    if (dep !== null) {
      out.push({
        dir,
        depart: toHHMM(dep),
        waitMin: Math.round(((dep - nowMin) % 1440 + 1440) % 1440),
        tomorrow: best === null
      });
    }
  }
  return out.slice(0, count);
}

function nextDeparturesHeadway(lineId, count) {
  const svc = SERVICE_WINDOWS[lineId];
  if (!svc) return [];
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const first = toMin(svc.first);
  // build today's departure minute-set from the headway windows
  const deps = [];
  for (const [a, b, headway] of svc.windows) {
    for (let m = toMin(a); m < toMin(b); m += headway) deps.push(m);
    deps.push(toMin(b));
  }
  deps.sort((x, y) => x - y);
  const upcoming = deps.filter(m => m >= nowMin);
  const pick = upcoming.length ? upcoming.slice(0, count)
    : deps.slice(0, count).map(m => m + 1440); // tomorrow's first trains
  return pick.map((m, i) => ({
    depart: toHHMM(m),
    waitMin: Math.round(((m - nowMin) % 1440 + 1440) % 1440),
    tomorrow: upcoming.length === 0
  }));
}

// Public: next departures for the first ride leg of a routed journey.
// For multi-leg journeys, departures are for the line of the first leg.
function nextDepartures(lineId, stationName, count = 3) {
  if (KOMUTER_TIMETABLES[lineId] && stationName) return nextDeparturesKomuter(lineId, stationName, count);
  return nextDeparturesHeadway(lineId, count);
}

function nowClock() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}


// ---------- Module exports ----------
export {
  LINES, WALK_TRANSFERS,
  startLine, startStation, endLine, endStation,
  byId, findRoute, fmtKm,
  setSelection, resetSelection, getState,
  nextDepartures, nowClock
};

// ---------- State mutators (hoisted for export above) ----------
function setSelection(s) {
  startLine = s.startLine ?? startLine;
  startStation = s.startStation ?? startStation;
  endLine = s.endLine ?? endLine;
  endStation = s.endStation ?? endStation;
}
function resetSelection() {
  startLine = null; startStation = null; endLine = null; endStation = null;
}
function getState() {
  return { startLine, startStation, endLine, endStation };
}
