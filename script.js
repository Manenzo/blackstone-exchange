let users = JSON.parse(localStorage.getItem("users") || "{}");
let username = localStorage.getItem("username");

// если нет ника → на старт
if (!username || !users[username]) {
  window.location.href = "start.html";
}

let prices = {
  AAPL: 150,
  TSLA: 220,
  GOOG: 2800
};

function getUser() {
  return users[username];
}

function save() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateUI() {
  document.getElementById("balance").innerText = getUser().balance;
}

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