const STORAGE_KEY = "actiomansot-state-v1";
const STARTING_BALANCE = 100000;
const PRICE_UPDATE_MS = 3000;
const NEWS_UPDATE_TICKS = 4;

const STOCKS = [
  { symbol: "AAPL", name: "Apple", sector: "Technology", price: 215.42 },
  { symbol: "MSFT", name: "Microsoft", sector: "Technology", price: 491.60 },
  { symbol: "NVDA", name: "NVIDIA", sector: "Semiconductors", price: 171.22 },
  { symbol: "TSLA", name: "Tesla", sector: "Automotive", price: 308.54 },
  { symbol: "AMZN", name: "Amazon", sector: "Consumer", price: 226.74 },
  { symbol: "META", name: "Meta", sector: "Communication", price: 735.81 },
  { symbol: "GOOG", name: "Alphabet", sector: "Communication", price: 176.13 },
  { symbol: "NFLX", name: "Netflix", sector: "Entertainment", price: 1294.10 }
];

const stockMap = Object.fromEntries(STOCKS.map(s => [s.symbol, s]));

let state = loadState();
let tick = 0;

function createState() {
  return {
    username: "Трейдер",
    balance: STARTING_BALANCE,
    holdings: {},
    prices: Object.fromEntries(STOCKS.map(s => [s.symbol, s.price])),
    previousPrices: Object.fromEntries(STOCKS.map(s => [s.symbol, s.price])),
    news: []
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const base = createState();
  if (!saved) return base;

  try {
    const parsed = JSON.parse(saved);
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function format(v) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(v || 0);
}

function getHolding(sym) {
  if (!state.holdings[sym]) {
    state.holdings[sym] = { qty: 0, avg: 0 };
  }
  return state.holdings[sym];
}

function metrics() {
  let value = 0;
  let invested = 0;

  for (const sym in state.holdings) {
    const h = state.holdings[sym];
    if (h.qty <= 0) continue;

    value += h.qty * state.prices[sym];
    invested += h.qty * h.avg;
  }

  const profit = value - invested;

  return {
    cash: state.balance,
    value,
    invested,
    profit,
    net: state.balance + value,
    return: invested ? (profit / invested) * 100 : 0
  };
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateUI() {
  const m = metrics();

  set("nickname", state.username);
  set("balance", format(state.balance));
  set("netWorthHero", format(m.net));
  set("portfolioValueHero", format(m.value));
  set("profitHero", format(m.profit));
  set("cashSummary", format(m.cash));
  set("portfolioSummary", format(m.value));
  set("investedSummary", format(m.invested));
  set("returnSummary", m.return.toFixed(2) + "%");
  set("positionsHero", Object.values(state.holdings).filter(h => h.qty > 0).length);
}

function buy(sym) {
  const price = state.prices[sym];
  if (state.balance < price) return toast("Нет денег");

  const h = getHolding(sym);
  const prev = h.qty;

  h.qty += 1;
  h.avg = ((h.avg || 0) * prev + price) / h.qty;

  state.balance -= price;

  save();
  render();
  toast("Куплено " + sym);
}

function sell(sym) {
  const h = getHolding(sym);
  if (h.qty <= 0) return toast("Нет акций");

  const price = state.prices[sym];

  h.qty -= 1;
  state.balance += price;

  if (h.qty === 0) h.avg = 0;

  save();
  render();
  toast("Продано " + sym);
}

function renderPortfolio() {
  const el = document.getElementById("portfolioList");
  if (!el) return;

  const items = Object.entries(state.holdings).filter(([_, h]) => h.qty > 0);

  if (!items.length) {
    el.innerHTML = `<div class="empty-state">Портфель пуст</div>`;
    return;
  }

  el.innerHTML = items.map(([sym, h]) => {
    const price = state.prices[sym];
    const pnl = (price - h.avg) * h.qty;

    return `
      <div class="holding-card">
        <h3>${sym}</h3>
        <p>Qty: ${h.qty}</p>
        <p>PnL: ${format(pnl)}</p>
        <button onclick="buy('${sym}')">Buy</button>
        <button onclick="sell('${sym}')">Sell</button>
      </div>
    `;
  }).join("");
}

function render() {
  updateUI();
  renderPortfolio();
}

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;

  t.textContent = msg;
  t.classList.add("show");

  setTimeout(() => t.classList.remove("show"), 2000);
}

window.buy =
