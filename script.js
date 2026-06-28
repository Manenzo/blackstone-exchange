diff --git a/script.js b/script.js
index a397d3d7b01f6cf7801cfe8eab40d57b53bbc907..e45595bb200292815c3df21485052de25962e1d5 100644
--- a/script.js
+++ b/script.js
@@ -1,134 +1,446 @@
+const STORAGE_KEY = "actiomansot-state-v1";
+const LEGACY_USERNAME_KEY = "username";
+const STARTING_BALANCE = 100000;
+const PRICE_UPDATE_MS = 3000;
+const NEWS_UPDATE_TICKS = 4;
+
+const STOCKS = [
+  { symbol: "AAPL", name: "Apple", sector: "Technology", price: 215.42 },
+  { symbol: "MSFT", name: "Microsoft", sector: "Technology", price: 491.60 },
+  { symbol: "NVDA", name: "NVIDIA", sector: "Semiconductors", price: 171.22 },
+  { symbol: "TSLA", name: "Tesla", sector: "Automotive", price: 308.54 },
+  { symbol: "AMZN", name: "Amazon", sector: "Consumer", price: 226.74 },
+  { symbol: "META", name: "Meta Platforms", sector: "Communication", price: 735.81 },
+  { symbol: "GOOG", name: "Alphabet", sector: "Communication", price: 176.13 },
+  { symbol: "NFLX", name: "Netflix", sector: "Entertainment", price: 1294.10 },
+  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Semiconductors", price: 142.35 },
+  { symbol: "INTC", name: "Intel", sector: "Semiconductors", price: 31.66 },
+  { symbol: "KO", name: "Coca-Cola", sector: "Consumer Staples", price: 64.22 },
+  { symbol: "PEP", name: "PepsiCo", sector: "Consumer Staples", price: 168.44 },
+  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials", price: 278.18 },
+  { symbol: "BAC", name: "Bank of America", sector: "Financials", price: 45.12 },
+  { symbol: "V", name: "Visa", sector: "Financials", price: 329.20 },
+  { symbol: "MA", name: "Mastercard", sector: "Financials", price: 517.63 },
+  { symbol: "WMT", name: "Walmart", sector: "Retail", price: 96.85 },
+  { symbol: "COST", name: "Costco", sector: "Retail", price: 988.10 },
+  { symbol: "DIS", name: "Walt Disney", sector: "Entertainment", price: 112.48 },
+  { symbol: "MCD", name: "McDonald's", sector: "Restaurants", price: 291.35 },
+  { symbol: "SBUX", name: "Starbucks", sector: "Restaurants", price: 88.56 },
+  { symbol: "NKE", name: "Nike", sector: "Consumer", price: 77.91 },
+  { symbol: "ADBE", name: "Adobe", sector: "Software", price: 413.27 },
+  { symbol: "CRM", name: "Salesforce", sector: "Software", price: 263.83 },
+  { symbol: "ORCL", name: "Oracle", sector: "Software", price: 144.71 },
+  { symbol: "IBM", name: "IBM", sector: "Technology", price: 226.90 },
+  { symbol: "CSCO", name: "Cisco", sector: "Technology", price: 59.42 },
+  { symbol: "QCOM", name: "Qualcomm", sector: "Semiconductors", price: 159.24 },
+  { symbol: "AVGO", name: "Broadcom", sector: "Semiconductors", price: 183.75 },
+  { symbol: "TXN", name: "Texas Instruments", sector: "Semiconductors", price: 195.08 },
+  { symbol: "PYPL", name: "PayPal", sector: "Financials", price: 68.37 },
+  { symbol: "UBER", name: "Uber", sector: "Mobility", price: 76.45 },
+  { symbol: "ABNB", name: "Airbnb", sector: "Travel", price: 132.66 },
+  { symbol: "BKNG", name: "Booking Holdings", sector: "Travel", price: 3924.51 },
+  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy", price: 115.82 },
+  { symbol: "CVX", name: "Chevron", sector: "Energy", price: 156.28 },
+  { symbol: "PFE", name: "Pfizer", sector: "Healthcare", price: 28.32 },
+  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", price: 151.77 },
+  { symbol: "MRK", name: "Merck", sector: "Healthcare", price: 128.01 },
+  { symbol: "LLY", name: "Eli Lilly", sector: "Healthcare", price: 882.40 },
+  { symbol: "T", name: "AT&T", sector: "Telecom", price: 18.94 },
+  { symbol: "VZ", name: "Verizon", sector: "Telecom", price: 41.28 },
+  { symbol: "BA", name: "Boeing", sector: "Industrials", price: 181.52 },
+  { symbol: "CAT", name: "Caterpillar", sector: "Industrials", price: 351.17 },
+  { symbol: "GE", name: "GE Aerospace", sector: "Industrials", price: 166.29 },
+  { symbol: "SPOT", name: "Spotify", sector: "Entertainment", price: 313.49 }
+];
+
+const NEWS_TEMPLATES = [
+  { title: "Сильные отчеты технологических компаний поддержали спрос", text: "Инвесторы активнее покупают компании роста после улучшения прогнозов по выручке.", impact: 0.018, type: "positive", sectors: ["Technology", "Software", "Semiconductors"] },
+  { title: "Опасения по ставкам давят на рынок", text: "Участники рынка осторожничают перед новыми комментариями центральных банков.", impact: -0.014, type: "negative", sectors: ["Financials", "Technology", "Consumer"] },
+  { title: "Потребительский сектор получает поддержку", text: "Розничные продажи оказались лучше ожиданий, а защитные компании выглядят устойчивее.", impact: 0.012, type: "positive", sectors: ["Consumer Staples", "Retail", "Restaurants"] },
+  { title: "Нефть резко меняет направление", text: "Волатильность сырья усилила движение в энергетических акциях.", impact: 0.016, type: "positive", sectors: ["Energy"] },
+  { title: "Инвесторы фиксируют прибыль в чипах", text: "После сильного роста часть игроков сокращает позиции в полупроводниковом секторе.", impact: -0.019, type: "negative", sectors: ["Semiconductors"] },
+  { title: "Спрос на путешествия остается высоким", text: "Бронирования и мобильность поддерживают туристические и транспортные компании.", impact: 0.014, type: "positive", sectors: ["Travel", "Mobility"] },
+  { title: "Медицинские акции торгуются смешанно", text: "Новости о разработках лекарств создают точечные движения в секторе здравоохранения.", impact: 0.008, type: "neutral", sectors: ["Healthcare"] },
+  { title: "Рынок развлечений реагирует на новые релизы", text: "Стриминговые и медиа-компании получают дополнительное внимание трейдеров.", impact: 0.011, type: "positive", sectors: ["Entertainment", "Communication"] }
+];
+
+const stockMap = Object.fromEntries(STOCKS.map((stock) => [stock.symbol, stock]));
+const page = document.body.dataset.page;
+let state = loadState();
+let tickCounter = 0;
+let searchQuery = "";
+let toastTimer = null;
+
+function createInitialState() {
+  return {
+    username: "",
+    balance: STARTING_BALANCE,
+    holdings: {},
+    prices: Object.fromEntries(STOCKS.map((stock) => [stock.symbol, stock.price])),
+    previousPrices: Object.fromEntries(STOCKS.map((stock) => [stock.symbol, stock.price])),
+    news: []
+  };
+}
 
-// ---------- Игрок ----------
-let username = localStorage.getItem("username");
-
-if (!username) {
-    username = prompt("Введите ваш ник:");
+function loadState() {
+  const saved = localStorage.getItem(STORAGE_KEY);
+  let parsed = null;
 
-    if (!username || username.trim() === "") {
-        username = "Игрок";
+  if (saved) {
+    try {
+      parsed = JSON.parse(saved);
+    } catch (error) {
+      parsed = null;
     }
+  }
 
-    localStorage.setItem("username", username);
-}
+  const initial = createInitialState();
+  const merged = { ...initial, ...(parsed || {}) };
+  merged.holdings = merged.holdings || {};
+  merged.prices = { ...initial.prices, ...(merged.prices || {}) };
+  merged.previousPrices = { ...initial.previousPrices, ...(merged.previousPrices || {}) };
+  merged.news = Array.isArray(merged.news) ? merged.news.slice(0, 5) : [];
 
-let users = JSON.parse(localStorage.getItem("users") || "{}");
+  if (!merged.username) {
+    merged.username = askNickname();
+  }
 
-if (!users[username]) {
-    users[username] = {
-        balance: 100000,
-        portfolio: {}
-    };
+  localStorage.setItem(LEGACY_USERNAME_KEY, merged.username);
+  return merged;
 }
 
-let user = users[username];
-
-// ---------- Акции ----------
-let prices = {
-    AAPL: 215.42,
-    MSFT: 491.60,
-    NVDA: 171.22,
-    TSLA: 308.54,
-    AMZN: 226.74,
-    META: 735.81,
-    GOOG: 176.13,
-    NFLX: 1294.10
-};
-
-// ---------- Сохранение ----------
-function save() {
-    users[username] = user;
-    localStorage.setItem("users", JSON.stringify(users));
+function askNickname(currentName = "") {
+  const value = prompt("Введите ваш ник:", currentName || "");
+  const trimmed = value ? value.trim() : "";
+  return trimmed || currentName || "Трейдер";
 }
 
-// ---------- Интерфейс ----------
-function updateUI() {
-
-    document.getElementById("nickname").textContent = username;
-
-    document.getElementById("balance").textContent =
-        user.balance.toFixed(2);
+function saveState() {
+  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
+  localStorage.setItem(LEGACY_USERNAME_KEY, state.username);
+}
 
-    for (let stock in prices) {
+function formatMoney(value) {
+  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
+}
 
-        let el = document.getElementById(stock + "-price");
+function formatPercent(value) {
+  const sign = value > 0 ? "+" : "";
+  return `${sign}${value.toFixed(2)}%`;
+}
 
-        if (el) {
-            el.textContent = "$" + prices[stock].toFixed(2);
-        }
+function getHolding(symbol) {
+  if (!state.holdings[symbol]) {
+    state.holdings[symbol] = { quantity: 0, averagePrice: 0, invested: 0 };
+  }
+  return state.holdings[symbol];
+}
 
+function getPortfolioMetrics() {
+  let portfolioValue = 0;
+  let invested = 0;
+  let positions = 0;
+
+  Object.entries(state.holdings).forEach(([symbol, holding]) => {
+    if (holding.quantity > 0) {
+      const currentValue = holding.quantity * state.prices[symbol];
+      portfolioValue += currentValue;
+      invested += holding.quantity * holding.averagePrice;
+      positions += 1;
     }
-
+  });
+
+  const profit = portfolioValue - invested;
+  const returnPercent = invested > 0 ? (profit / invested) * 100 : 0;
+
+  return {
+    cash: state.balance,
+    portfolioValue,
+    invested,
+    positions,
+    profit,
+    returnPercent,
+    netWorth: state.balance + portfolioValue
+  };
 }
 
-updateUI();
-
-// ---------- Купить ----------
-function buy(stock) {
-
-    let price = prices[stock];
-
-    if (user.balance < price) {
+function updateAccountUI() {
+  const metrics = getPortfolioMetrics();
+  setText("nickname", state.username);
+  setText("balance", formatMoney(state.balance));
+  setText("netWorthHero", formatMoney(metrics.netWorth));
+  setText("portfolioValueHero", formatMoney(metrics.portfolioValue));
+  setText("positionsHero", String(metrics.positions));
+  setText("profitHero", formatMoney(metrics.profit));
+  setText("cashSummary", formatMoney(metrics.cash));
+  setText("portfolioSummary", formatMoney(metrics.portfolioValue));
+  setText("investedSummary", formatMoney(metrics.invested));
+  setText("returnSummary", formatPercent(metrics.returnPercent));
+
+  const returnElement = document.getElementById("returnSummary");
+  const profitElement = document.getElementById("profitHero");
+  [returnElement, profitElement].forEach((element) => {
+    if (!element) return;
+    element.classList.toggle("positive", metrics.profit >= 0);
+    element.classList.toggle("negative", metrics.profit < 0);
+  });
+}
 
-        alert("Недостаточно денег");
+function setText(id, value) {
+  const element = document.getElementById(id);
+  if (element) {
+    element.textContent = value;
+  }
+}
 
-        return;
-    }
+function getChange(symbol) {
+  const previous = state.previousPrices[symbol] || state.prices[symbol];
+  const current = state.prices[symbol];
+  return ((current - previous) / previous) * 100;
+}
 
-    user.balance -= price;
+function renderMarket() {
+  const grid = document.getElementById("stockGrid");
+  if (!grid) return;
 
-    if (!user.portfolio[stock]) {
+  const filteredStocks = STOCKS.filter((stock) => {
+    const haystack = `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase();
+    return haystack.includes(searchQuery.toLowerCase());
+  });
 
-        user.portfolio[stock] = 0;
+  grid.innerHTML = filteredStocks.map((stock) => stockCardTemplate(stock)).join("");
+  document.getElementById("emptySearch")?.classList.toggle("hidden", filteredStocks.length > 0);
+}
 
-    }
+function stockCardTemplate(stock) {
+  const change = getChange(stock.symbol);
+  const direction = change >= 0 ? "positive" : "negative";
+  const arrow = change >= 0 ? "▲" : "▼";
+  const holding = getHolding(stock.symbol);
+  const flashClass = change > 0 ? "flash-up" : change < 0 ? "flash-down" : "";
+
+  return `
+    <article class="stock-card ${flashClass}" data-symbol="${stock.symbol}">
+      <div class="stock-card__body">
+        <div class="stock-card__top">
+          <div class="company-logo">${stock.symbol.slice(0, 2)}</div>
+          <span class="ticker-pill">${stock.symbol}</span>
+        </div>
+        <h3>${stock.name}</h3>
+        <div class="stock-card__price-row">
+          <span class="price-value">${formatMoney(state.prices[stock.symbol])}</span>
+          <span class="change-badge ${direction}">${arrow} ${formatPercent(change)}</span>
+        </div>
+        <div class="stock-card__meta">
+          <span>${stock.sector}</span>
+          <span>В портфеле: ${holding.quantity}</span>
+        </div>
+        <div class="trade-actions">
+          <button class="trade-button trade-button--buy" type="button" onclick="buyStock('${stock.symbol}')">Купить</button>
+          <button class="trade-button trade-button--sell" type="button" onclick="sellStock('${stock.symbol}')" ${holding.quantity <= 0 ? "disabled" : ""}>Продать</button>
+        </div>
+      </div>
+    </article>
+  `;
+}
 
-    user.portfolio[stock]++;
+function renderPortfolio() {
+  const list = document.getElementById("portfolioList");
+  if (!list) return;
 
-    save();
+  const holdings = Object.entries(state.holdings).filter(([, holding]) => holding.quantity > 0);
 
-    updateUI();
+  if (holdings.length === 0) {
+    list.innerHTML = `<div class="empty-state">Портфель пуст. Перейдите на рынок и купите первую акцию.</div>`;
+    return;
+  }
 
+  list.innerHTML = holdings.map(([symbol, holding]) => holdingCardTemplate(symbol, holding)).join("");
 }
 
-// ---------- Продать ----------
-function sell(stock) {
-
-    if (!user.portfolio[stock]) {
+function holdingCardTemplate(symbol, holding) {
+  const stock = stockMap[symbol];
+  const currentPrice = state.prices[symbol];
+  const currentValue = holding.quantity * currentPrice;
+  const invested = holding.quantity * holding.averagePrice;
+  const profit = currentValue - invested;
+  const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
+  const direction = profit >= 0 ? "positive" : "negative";
+  const arrow = profit >= 0 ? "▲" : "▼";
+  const change = getChange(symbol);
+  const flashClass = change > 0 ? "flash-up" : change < 0 ? "flash-down" : "";
+
+  return `
+    <article class="holding-card ${flashClass}">
+      <div class="holding-card__body">
+        <div class="holding-card__top">
+          <div>
+            <span class="ticker-pill">${symbol}</span>
+            <h3>${stock.name}</h3>
+          </div>
+          <span class="pnl-badge ${direction}">${arrow} ${formatMoney(profit)} · ${formatPercent(profitPercent)}</span>
+        </div>
+        <div class="holding-card__grid">
+          <div class="holding-card__metric"><span class="holding-card__label">Количество</span><strong>${holding.quantity}</strong></div>
+          <div class="holding-card__metric"><span class="holding-card__label">Средняя цена</span><strong>${formatMoney(holding.averagePrice)}</strong></div>
+          <div class="holding-card__metric"><span class="holding-card__label">Текущая цена</span><strong>${formatMoney(currentPrice)}</strong></div>
+          <div class="holding-card__metric"><span class="holding-card__label">Стоимость</span><strong>${formatMoney(currentValue)}</strong></div>
+        </div>
+        <div class="holding-card__actions trade-actions">
+          <button class="trade-button trade-button--buy" type="button" onclick="buyStock('${symbol}')">Купить еще</button>
+          <button class="trade-button trade-button--sell" type="button" onclick="sellStock('${symbol}')">Продать 1</button>
+        </div>
+      </div>
+    </article>
+  `;
+}
 
-        alert("У вас нет этой акции");
+function renderNews() {
+  const newsList = document.getElementById("marketNews");
+  if (!newsList) return;
+
+  if (state.news.length === 0) {
+    state.news = [createNewsItem()];
+    saveState();
+  }
+
+  newsList.innerHTML = state.news.map((item) => `
+    <article class="news-item">
+      <strong>${item.title}</strong>
+      <p>${item.text}</p>
+      <span class="news-impact ${item.type}">${item.label}</span>
+    </article>
+  `).join("");
+}
 
-        return;
+function createNewsItem() {
+  const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
+  const label = template.impact > 0 ? `Влияние +${(template.impact * 100).toFixed(1)}%` : template.impact < 0 ? `Влияние ${(template.impact * 100).toFixed(1)}%` : "Нейтрально";
+  return { ...template, label, createdAt: Date.now() };
+}
 
+function applyNewsImpact(newsItem) {
+  STOCKS.forEach((stock) => {
+    if (newsItem.sectors.includes(stock.sector)) {
+      state.prices[stock.symbol] = Math.max(1, state.prices[stock.symbol] * (1 + newsItem.impact));
     }
+  });
+}
 
-    user.portfolio[stock]--;
-
-    user.balance += prices[stock];
-
-    save();
-
-    updateUI();
+function addMarketNews() {
+  const item = createNewsItem();
+  applyNewsImpact(item);
+  state.news = [item, ...state.news].slice(0, 5);
+}
 
+function buyStock(symbol) {
+  const price = state.prices[symbol];
+  if (state.balance < price) {
+    showToast("Недостаточно средств для покупки этой акции.");
+    return;
+  }
+
+  const holding = getHolding(symbol);
+  const previousQuantity = holding.quantity;
+  holding.quantity += 1;
+  holding.averagePrice = ((holding.averagePrice * previousQuantity) + price) / holding.quantity;
+  holding.invested = holding.quantity * holding.averagePrice;
+  state.balance -= price;
+
+  saveState();
+  renderAll();
+  showToast(`Куплено: ${stockMap[symbol].name} за ${formatMoney(price)}.`);
 }
 
-// ---------- Изменение цен ----------
-setInterval(() => {
+function sellStock(symbol) {
+  const holding = getHolding(symbol);
+  if (holding.quantity <= 0) {
+    showToast("У вас нет этой акции для продажи.");
+    return;
+  }
+
+  const price = state.prices[symbol];
+  holding.quantity -= 1;
+  state.balance += price;
+
+  if (holding.quantity === 0) {
+    holding.averagePrice = 0;
+    holding.invested = 0;
+  } else {
+    holding.invested = holding.quantity * holding.averagePrice;
+  }
+
+  saveState();
+  renderAll();
+  showToast(`Продано: ${stockMap[symbol].name} за ${formatMoney(price)}.`);
+}
 
-    for (let stock in prices) {
+function updatePrices() {
+  STOCKS.forEach((stock) => {
+    state.previousPrices[stock.symbol] = state.prices[stock.symbol];
+    const volatility = getVolatility(stock.sector);
+    const randomMove = (Math.random() * volatility * 2 - volatility) / 100;
+    state.prices[stock.symbol] = Math.max(1, state.prices[stock.symbol] * (1 + randomMove));
+  });
+
+  tickCounter += 1;
+  if (tickCounter % NEWS_UPDATE_TICKS === 0) {
+    addMarketNews();
+  }
+
+  saveState();
+  renderAll();
+}
 
-        let change = (Math.random() * 8 - 4) / 100;
+function getVolatility(sector) {
+  const volatileSectors = ["Semiconductors", "Technology", "Software", "Entertainment", "Travel", "Mobility"];
+  const defensiveSectors = ["Consumer Staples", "Healthcare", "Telecom"];
 
-        prices[stock] *= (1 + change);
+  if (volatileSectors.includes(sector)) return 2.6;
+  if (defensiveSectors.includes(sector)) return 1.2;
+  return 1.8;
+}
 
-        if (prices[stock] < 1) {
+function showToast(message) {
+  const toast = document.getElementById("toast");
+  if (!toast) return;
+  toast.textContent = message;
+  toast.classList.add("show");
+  clearTimeout(toastTimer);
+  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
+}
 
-            prices[stock] = 1;
+function changeNickname() {
+  const nextName = askNickname(state.username);
+  state.username = nextName;
+  saveState();
+  renderAll();
+  showToast("Ник успешно обновлен.");
+}
 
-        }
+function bindEvents() {
+  document.getElementById("changeNicknameButton")?.addEventListener("click", changeNickname);
+  document.getElementById("stockSearch")?.addEventListener("input", (event) => {
+    searchQuery = event.target.value.trim();
+    renderMarket();
+  });
+}
 
-    }
+function renderAll() {
+  updateAccountUI();
+  if (page === "market") {
+    renderMarket();
+    renderNews();
+  }
+  if (page === "portfolio") {
+    renderPortfolio();
+  }
+}
 
-    updateUI();
+window.buyStock = buyStock;
+window.sellStock = sellStock;
 
-}, 5000);
\ No newline at end of file
+bindEvents();
+renderAll();
+saveState();
+setInterval(updatePrices, PRICE_UPDATE_MS);
