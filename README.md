# Transit Service Watch

A single-page Klang Valley rail journey planner that runs entirely in the browser.
No backend, no database, no build step — just static files.

**All data is fictional sample data.** Nothing here is real transit information:
distances, travel times, frequencies and disruptions are invented for demo purposes
and are labelled as such in the UI.

## What it does

1. **Plan a journey** — choose a starting line and station, then an ending line and
   station (start and end may be on different lines).
2. **Check** — opens a result popout showing:
   - total distance and time (including walking at interchanges),
   - the shortest available route with a leg-by-leg breakdown (per-line stops,
     distance, time, and walking transfers),
   - the service status of every line involved, including cut-short sections.
3. **Reset** — clears the selection back to the blank state.

The router (Dijkstra over a station graph) respects suspended sections: journeys
through cut-short parts of a line are reported as unavailable with an explanation.

## Project structure

```
index.html        — page markup, loads the stylesheet and the app module
css/style.css     — all styling
js/data.js        — line/station data, interchange walkways, sample speeds
js/router.js      — selection state + shortest-route engine (Dijkstra)
js/ui.js          — rendering of steps, status cards, and the result popout
js/app.js         — entry point: button wiring and boot
```

## Running it

Because the JavaScript uses ES modules, the page needs to be served over HTTP
(opening `index.html` directly from disk won't load the modules in most browsers).

Any static server works, for example:

```bash
# Python
python -m http.server 8417
# then open http://localhost:8417/index.html
```

or use any other one-command static file server (e.g. `npx serve`).

Nothing is saved between visits; every session starts blank.
