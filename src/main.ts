// src/main.ts

// set up
const app = document.createElement("div");
app.style.display = "flex";
app.style.gap = "20px";
app.style.padding = "20px";
app.style.fontFamily = "sans-serif";
document.body.appendChild(app);

// column 1: player stats
const statsColumn = document.createElement("div");
statsColumn.style.width = "200px";
statsColumn.innerHTML = "<h3>Player Stats</h3>";
app.appendChild(statsColumn);

// game variables
let exp = 0;
let level = 0;
let statPoints = 5;
let gold = 5;
const expPerSec = 1;
const goldPerSec = 1;
let weaponLevel = 0;
let passiveExp = 0;
let passiveGold = 0;

// display elements
const expDisplay = document.createElement("div");
const levelDisplay = document.createElement("div");
const statPointsDisplay = document.createElement("div");
const goldDisplay = document.createElement("div");
goldDisplay.style.display = "none";

// update stats function
function updateStatsDisplay() {
  // calculate current level and progress
  let currentExp = exp;
  let currentLevel = 0;
  let expNeeded = 5;

  while (currentExp >= expNeeded) {
    currentExp -= expNeeded;
    currentLevel++;
    expNeeded *= 2;
  }

  // level up
  if (currentLevel > level) {
    level = currentLevel;
    statPoints += 5;

    // gold display unlocks at level 5
    if (level >= 5) {
      goldDisplay.style.display = "block";
      weaponBox.style.display = "block";
      buyButton.style.display = "block";
    }
  }

  // update display
  expDisplay.textContent = `EXP: ${exp}`;
  levelDisplay.textContent = `Level: ${level} (${currentExp}/${expNeeded})`;
  statPointsDisplay.textContent = `Stat Points: ${statPoints}`;
  if (level >= 5) {
    goldDisplay.textContent = `Gold: ${Math.floor(gold)}`;
  }
}

statsColumn.appendChild(expDisplay);
statsColumn.appendChild(levelDisplay);
statsColumn.appendChild(statPointsDisplay);
statsColumn.appendChild(goldDisplay);

// column 2: combat
const combatColumn = document.createElement("div");
combatColumn.style.width = "200px";
combatColumn.innerHTML = "<h3>Combat</h3>";
app.appendChild(combatColumn);

// monster box
const monsterBox = document.createElement("div");
Object.assign(monsterBox.style, {
  width: "180px",
  height: "180px",
  border: "2px solid #555",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
monsterBox.textContent = "Training Dummy";
combatColumn.appendChild(monsterBox);

// attack
const clickButton = document.createElement("button");
clickButton.textContent = "⚔ Attack! ⚔";
clickButton.style.width = "180px";
clickButton.style.margin = "10px auto";
clickButton.style.display = "block";
combatColumn.appendChild(clickButton);

// passive stat boxes
const createPassiveBox = (text: string) => {
  const box = document.createElement("div");
  Object.assign(box.style, {
    width: "180px",
    height: "40px",
    border: "2px solid #555",
    margin: "10px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    textAlign: "center",
  });
  box.textContent = text;
  return box;
};

// passive boxes
const passiveExpBox = createPassiveBox("Unlocks at level 3");
const passiveGoldBox = createPassiveBox("Unlocks at level 5");
const placeholderBox = createPassiveBox("Coming soon...");

combatColumn.appendChild(passiveExpBox);
combatColumn.appendChild(passiveGoldBox);
combatColumn.appendChild(placeholderBox);

// column 3 (achievement shop reset)
const miscellColumn = document.createElement("div");
miscellColumn.style.width = "200px";
miscellColumn.innerHTML = "<h3>Achievements</h3>";
app.appendChild(miscellColumn);

// Achievements box
const achievementsBox = document.createElement("div");
Object.assign(achievementsBox.style, {
  width: "180px",
  height: "180px",
  border: "2px solid #555",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
achievementsBox.textContent = "Achievements";
miscellColumn.appendChild(achievementsBox);

// shop title
const shopTitle = document.createElement("h4");
shopTitle.textContent = "Shop";
shopTitle.style.marginTop = "20px";
miscellColumn.appendChild(shopTitle);

// shop info
const weaponBox = document.createElement("div");
Object.assign(weaponBox.style, {
  width: "180px",
  height: "40px", // Fixed height
  border: "2px solid #555",
  margin: "0 auto",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 0",
  color: "#fff",
});
miscellColumn.appendChild(weaponBox);

// purchase button
const buyButton = document.createElement("button");
buyButton.textContent = "Buy";
buyButton.style.width = "180px";
buyButton.style.margin = "10px auto";
buyButton.style.display = "none"; // Hidden until level 5
miscellColumn.appendChild(buyButton);

// update shop
function updateShopDisplay() {
  if (level < 5) return;

  const cost = Math.pow(2, weaponLevel + 1);
  weaponBox.innerHTML = `
    Weapon Level: ${weaponLevel}<br>
    Cost: ${cost} gold
  `;

  // Make sure text is readable
  weaponBox.style.color = "#000";         // Black text
  weaponBox.style.backgroundColor = "#fff"; // White background
  weaponBox.style.boxSizing = "border-box";

  buyButton.disabled = gold < cost;
}

// click handler
clickButton.addEventListener("click", () => {
  exp += 1 + weaponLevel; // Base + weapon bonus
  updateStatsDisplay();
});

// passive income system
setInterval(() => {
  if (level >= 3) {
    const gainedExp = expPerSec;
    exp += gainedExp;
    passiveExp += gainedExp;
    passiveExpBox.innerHTML = `Passive EXP: ${expPerSec}/s<br>Accumulate: ${
      Math.floor(passiveExp)
    }`;
    passiveExpBox.style.backgroundColor = "#e0ffe0";
    passiveExpBox.style.color = "#006600";
  }

  if (level >= 5) {
    const gainedGold = goldPerSec;
    gold += gainedGold;
    passiveGold += gainedGold;
    passiveGoldBox.innerHTML = `Passive Gold: ${goldPerSec}/s<br>Accumulated: ${
      Math.floor(passiveGold)
    }`;
    passiveGoldBox.style.backgroundColor = "#fff0e0";
    passiveGoldBox.style.color = "#996600";
  }

  // update global display
  updateStatsDisplay();
  if (level >= 5) updateShopDisplay();
}, 1000);

// shop purchase logic
buyButton.addEventListener("click", () => {
  const cost = Math.pow(2, weaponLevel + 1);
  if (gold >= cost) {
    gold -= cost;
    weaponLevel++;
    updateStatsDisplay();
    updateShopDisplay();
  }
});
