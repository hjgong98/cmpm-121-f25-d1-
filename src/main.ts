// src/main.ts

const app = document.createElement("div");
app.style.display = "flex";
app.style.gap = "20px";
app.style.padding = "20px";
app.style.fontFamily = "sans-serif";
document.body.appendChild(app);

// column 1
const statsColumn = document.createElement("div");
statsColumn.style.width = "200px";
statsColumn.innerHTML = "<h3>Player Stats</h3>";
app.appendChild(statsColumn);

// column 2
const combatColumn = document.createElement("div");
combatColumn.style.width = "200px";
combatColumn.innerHTML = "<h3>Combat</h3>";

// monster box
const monsterBox = document.createElement("div");
monsterBox.style.width = "180px";
monsterBox.style.height = "180px";
monsterBox.style.border = "2px solid #555";
monsterBox.style.margin = "0 auto";
monsterBox.style.display = "flex";
monsterBox.style.alignItems = "center";
monsterBox.style.justifyContent = "center";
monsterBox.textContent = "Training Dummy";
combatColumn.appendChild(monsterBox);

// button
const clickButton = document.createElement("button");
clickButton.textContent = "⚔ Attack! ⚔";
clickButton.style.width = "180px";
clickButton.style.margin = "10px auto";
clickButton.style.display = "block";
combatColumn.appendChild(clickButton);

// column 3 (achievement shop reset)
const shopColumn = document.createElement("div");
shopColumn.style.width = "200px";
shopColumn.innerHTML = "<h3>Shop</h3>";
app.appendChild(shopColumn);
