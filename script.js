
// ---------- Игрок ----------
let username = localStorage.getItem("username");

if (!username) {
    username = prompt("Введите ваш ник:");

    if (!username || username.trim() === "") {
        username = "Игрок";
    }

    localStorage.setItem("username", username);
}

let users = JSON.parse(localStorage.getItem("users") || "{}");

if (!users[username]) {
    users[username] = {
        balance: 100000,
        portfolio: {}
    };
}

let user = users[username];

// ---------- Акции ----------
let prices = {
    AAPL: 215.42,
    MSFT: 491.60,
    NVDA: 171.22,
    TSLA: 308.54,
    AMZN: 226.74,
    META: 735.81,
    GOOG: 176.13,
    NFLX: 1294.10
};

// ---------- Сохранение ----------
function save() {
    users[username] = user;
    localStorage.setItem("users", JSON.stringify(users));
}

// ---------- Интерфейс ----------
function updateUI() {

    document.getElementById("nickname").textContent = username;

    document.getElementById("balance").textContent =
        user.balance.toFixed(2);

    for (let stock in prices) {

        let el = document.getElementById(stock + "-price");

        if (el) {
            el.textContent = "$" + prices[stock].toFixed(2);
        }

    }

}

updateUI();

// ---------- Купить ----------
function buy(stock) {

    let price = prices[stock];

    if (user.balance < price) {

        alert("Недостаточно денег");

        return;
    }

    user.balance -= price;

    if (!user.portfolio[stock]) {

        user.portfolio[stock] = 0;

    }

    user.portfolio[stock]++;

    save();

    updateUI();

}

// ---------- Продать ----------
function sell(stock) {

    if (!user.portfolio[stock]) {

        alert("У вас нет этой акции");

        return;

    }

    user.portfolio[stock]--;

    user.balance += prices[stock];

    save();

    updateUI();

}

// ---------- Изменение цен ----------
setInterval(() => {

    for (let stock in prices) {

        let change = (Math.random() * 8 - 4) / 100;

        prices[stock] *= (1 + change);

        if (prices[stock] < 1) {

            prices[stock] = 1;

        }

    }

    updateUI();

}, 5000);