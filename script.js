let users = JSON.parse(localStorage.getItem("users") || "{}");
let username = localStorage.getItem("username");

console.log("USERNAME:", username);
console.log("USERS:", users);

// ❗ если нет данных — НЕ ломаемся, а отправляем
if (!username) {
  window.location.href = "start.html";
}

if (!users[username]) {
  // если вдруг сломались данные — пересоздаём
  users[username] = {
    balance: 100000,
    portfolio: {}
  };
  localStorage.setItem("users", JSON.stringify(users));
}

function getUser() {
  return users[username];
}

function save() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateUI() {
  const el = document.getElementById("balance");
  if (el) {
    el.innerText = getUser().balance;
  }
}

let prices = {
  AAPL: 150,
  TSLA: 220,
  GOOG: 2800
};

function buy(stock) {
  let user = getUser();

  if (user.balance >= prices[stock]) {
    user.balance -= prices[stock];
    user.portfolio[stock] = (user.portfolio[stock] || 0) + 1;
    save();
    updateUI();
  } else {
    alert("Нет денег");
  }
}

function sell(stock) {
  let user = getUser();

  if ((user.portfolio[stock] || 0) > 0) {
    user.portfolio[stock] -= 1;
    user.balance += prices[stock];
    save();
    updateUI();
  } else {
    alert("Нет акций");
  }
}

updateUI();
