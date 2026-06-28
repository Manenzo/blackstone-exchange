let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

// ---------- Проверка логина ----------
if (!currentUser || !users[currentUser]) {
  console.log("Нет пользователя → редирект на login");
  window.location.href = "login.html";
}

// ---------- Получаем игрока ----------
function getUser() {
  return users[currentUser];
}

// ---------- Сохранение ----------
function save() {
  localStorage.setItem("users", JSON.stringify(users));
}

// ---------- Баланс на UI ----------
function updateUI() {
  const el = document.getElementById("balance");
  if (el) {
    el.innerText = getUser().balance;
  }
}

// ---------- Цены акций ----------
let prices = {
  AAPL: 150,
  TSLA: 220,
  GOOG: 2800,
  NVDA: 900,
  MSFT: 350
};

// ---------- Купить ----------
function buy(stock) {
  let user = getUser();

  if (!prices[stock]) {
    alert("Нет такой акции");
    return;
  }

  if (user.balance >= prices[stock]) {
    user.balance -= prices[stock];

    if (!user.portfolio[stock]) {
      user.portfolio[stock] = 0;
    }

    user.portfolio[stock] += 1;

    save();
    updateUI();
  } else {
    alert("💸 Недостаточно денег");
  }
}

// ---------- Продать ----------
function sell(stock) {
  let user = getUser();

  if (!user.portfolio[stock] || user.portfolio[stock] <= 0) {
    alert("📉 Нет акций для продажи");
    return;
  }

  user.portfolio[stock] -= 1;
  user.balance += prices[stock];

  save();
  updateUI();
}

// ---------- Инициализация ----------
function init() {
  // если вдруг портфеля нет
  if (!users[currentUser].portfolio) {
    users[currentUser].portfolio = {};
  }

  updateUI();
}

// запускаем
init();
