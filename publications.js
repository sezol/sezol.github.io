// ============================================================
// DEMO 1 — Dijkstra's shortest path
// ============================================================
const graphNodes = {
  A: { x: 60, y: 130 },
  B: { x: 200, y: 50 },
  C: { x: 200, y: 210 },
  D: { x: 350, y: 50 },
  E: { x: 350, y: 210 },
  F: { x: 490, y: 130 },
};

// undirected weighted edges
const graphEdges = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "C", 1],
  ["B", "D", 5],
  ["C", "E", 8],
  ["D", "E", 2],
  ["D", "F", 6],
  ["E", "F", 3],
];

function dijkstra(source) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(graphNodes).forEach((n) => (dist[n] = Infinity));
  dist[source] = 0;

  while (visited.size < Object.keys(graphNodes).length) {
    let u = null;
    let best = Infinity;
    Object.keys(graphNodes).forEach((n) => {
      if (!visited.has(n) && dist[n] < best) {
        best = dist[n];
        u = n;
      }
    });
    if (u === null) break;
    visited.add(u);

    graphEdges.forEach(([a, b, w]) => {
      let neighbor = null;
      if (a === u) neighbor = b;
      else if (b === u) neighbor = a;
      if (neighbor && !visited.has(neighbor)) {
        const alt = dist[u] + w;
        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          prev[neighbor] = u;
        }
      }
    });
  }
  return { dist, prev };
}

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function drawGraph(highlightPrev, dist) {
  const svg = document.getElementById("dijkstra-graph");
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  graphEdges.forEach(([a, b, w]) => {
    const isPath = highlightPrev && (highlightPrev[b] === a || highlightPrev[a] === b);
    const na = graphNodes[a], nb = graphNodes[b];
    const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;

    svg.appendChild(svgEl("line", {
      x1: na.x, y1: na.y, x2: nb.x, y2: nb.y,
      stroke: isPath ? "#D48C82" : "#DCE3DE",
      "stroke-width": isPath ? 4 : 2,
    }));

    const label = svgEl("text", {
      x: mx, y: my - 6, "text-anchor": "middle", "font-size": 11,
      fill: "#55665C", "font-family": "Inter, sans-serif",
    });
    label.textContent = w;
    svg.appendChild(label);
  });

  Object.entries(graphNodes).forEach(([name, pos]) => {
    const d = dist && dist[name] !== undefined && dist[name] !== Infinity ? dist[name] : null;

    svg.appendChild(svgEl("circle", {
      cx: pos.x, cy: pos.y, r: 20, fill: "#1F3A2E", stroke: "#F7F6F2", "stroke-width": 2,
    }));

    const nameLabel = svgEl("text", {
      x: pos.x, y: pos.y + 5, "text-anchor": "middle", "font-size": 14,
      fill: "#F7F6F2", "font-family": "Inter, sans-serif",
    });
    nameLabel.textContent = name;
    svg.appendChild(nameLabel);

    if (d !== null) {
      const distLabel = svgEl("text", {
        x: pos.x, y: pos.y + 38, "text-anchor": "middle", "font-size": 12,
        fill: "#A85D50", "font-family": "Inter, sans-serif",
      });
      distLabel.textContent = d;
      svg.appendChild(distLabel);
    }
  });
}

const nodeOrder = ["A", "B", "C", "D", "E", "F"];
let sourceIndex = 0;

function initDijkstraDemo() {
  const runBtn = document.getElementById("run-dijkstra");
  const resetBtn = document.getElementById("reset-dijkstra");
  const note = document.getElementById("dijkstra-note");
  if (!runBtn) return;

  drawGraph(null, null);

  runBtn.addEventListener("click", () => {
    const source = nodeOrder[sourceIndex % nodeOrder.length];
    sourceIndex++;

    const { dist, prev } = dijkstra(source);
    drawGraph(prev, dist);
    note.textContent = `Distances from ${source}: ` + Object.entries(dist)
      .map(([n, d]) => `${n}=${d}`)
      .join(", ");
  });

  resetBtn.addEventListener("click", () => {
    drawGraph(null, null);
    note.textContent = "Click \"Run Dijkstra\" — each run starts from a different node.";
  });
}

// ============================================================
// DEMO 2 — Banker's algorithm (real safety check, two sample states)
// ============================================================
const bankerScenarios = {
  safe: [
    {
      label: "5 processes, 3 resource types",
      available: [3, 3, 2],
      max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
      allocation: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
    },
    {
      label: "4 processes, 1 resource type",
      available: [2],
      max: [[6], [5], [4], [7]],
      allocation: [[1], [2], [2], [3]],
    },
  ],
  unsafe: [
    {
      label: "5 processes, 3 resource types — resources ran out",
      available: [0, 0, 0],
      max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
      allocation: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
    },
    {
      label: "4 processes, 1 resource type — resources ran out",
      available: [0],
      max: [[6], [5], [4], [7]],
      allocation: [[1], [2], [2], [3]],
    },
  ],
};

const bankerIndex = { safe: 0, unsafe: 0 };

function checkSafety({ available, max, allocation }) {
  const n = allocation.length;
  const m = available.length;
  const need = max.map((row, i) => row.map((v, j) => v - allocation[i][j]));
  const work = available.slice();
  const finish = new Array(n).fill(false);
  const sequence = [];

  let progress = true;
  while (progress) {
    progress = false;
    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;
      const canRun = need[i].every((v, j) => v <= work[j]);
      if (canRun) {
        for (let j = 0; j < m; j++) work[j] += allocation[i][j];
        finish[i] = true;
        sequence.push(i);
        progress = true;
      }
    }
  }

  return { safe: finish.every(Boolean), sequence };
}

function renderBankerDemo() {
  const container = document.getElementById("banker-demo");
  if (!container) return;

  container.innerHTML = `
    <div class="demo-controls">
      <button type="button" data-scenario="safe">Load a safe scenario</button>
      <button type="button" data-scenario="unsafe">Load an unsafe scenario</button>
    </div>
    <p class="demo-note" id="banker-note">Each button cycles through a couple of different example setups.</p>
  `;

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.scenario;
      const scenarios = bankerScenarios[kind];
      const scenario = scenarios[bankerIndex[kind] % scenarios.length];
      bankerIndex[kind]++;

      const result = checkSafety(scenario);
      const note = document.getElementById("banker-note");
      const prefix = `[${scenario.label}] `;
      if (result.safe) {
        note.textContent = `${prefix}Safe state — processes can finish in this order: P${result.sequence.join(" → P")}`;
        note.style.color = "#3B6D11";
      } else {
        note.textContent = `${prefix}Unsafe state — no ordering lets every process finish with the resources currently available.`;
        note.style.color = "#993C1D";
      }
    });
  });
}

// ============================================================
initDijkstraDemo();
renderBankerDemo();
