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

// core variables
let exp = 0;
let level = 0;
let statPoints = 5;
let gold = 5;

// ascension / reset system
let resets = 0;
let ascensionMultiplier = 1;

// player stats
let strength = 0;
let critRate = 5;
let critDamage = 50;
let luck = 0;

// equipment / upgrades
let weaponLevel = 0;
let helmetLevel = 0;
let charmLevel = 0;

// passive income
let expPerSec = 1;
let goldPerSec = 1;
let passiveExp = 0;
let passiveGold = 0;

// combat and enemy stae
let currentEnemy = "Training Dummy";
let enemyHP = 0;
let maxEnemyHP = 0;

// level milestone flags
let atLevel3 = false;
let atLevel5 = false;
let atLevel10 = false;

// stat rows with labels and +/- buttons
function createStatRow(label: string, value: number | string) {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.alignItems = "center";
  row.style.justifyContent = "space-between";
  row.style.margin = "6px 0";
  row.style.fontSize = "14px"

  const labelSpan = document.createElement("span");
  labelSpan.textContent = `${label}: ${value}`;
  row.appendChild(labelSpan);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "4px";

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "–";
  minusBtn.style.width = "26px";
  minusBtn.style.height = "26px";
  minusBtn.style.padding = "0";
  minusBtn.style.fontSize = "18px";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  plusBtn.style.width = "26px";
  plusBtn.style.height = "26px";
  plusBtn.style.padding = "0";
  plusBtn.style.fontSize = "18px";

  buttonContainer.appendChild(minusBtn);
  buttonContainer.appendChild(plusBtn);
  row.appendChild(buttonContainer);

  return { row, labelSpan, minusBtn, plusBtn };
}

// display elements
const expDisplay = document.createElement("div");
const levelDisplay = document.createElement("div");
const statPointsDisplay = document.createElement("div");
statsPointsDisplay.style.margin = "10px 0";
statPointsDisplay.style.textContent = `Stat Points: ${statPoints}`;
const goldDisplay = document.createElement("div");
goldDisplay.style.display = "none";

statsColumn.appendChild(expDisplay);
statsColumn.appendChild(levelDisplay);
statsColumn.appendChild(statPointsDisplay);
statsColumn.appendChild(goldDisplay);

// stat rows
let strRow, crRow, cdRow, luckRow;
let strLabel, crLabel, cdLabel, luckLabel;

strRow = createStatRow("STR", strength);
crRow = createStatRow("Crit Rate", `${critRate}%`);
cdRow = createStatRow("Crit Damage", `${critDamage}%`);
luckRow = createStatRow("Luck", `${luck}%`);

strLabel = strRow.labelSpan;
crLabel = cdRow.labelSpan;
cdLabel = crRow.labelSpan;
cdLabel = crRow.labelSpan;
luckLabel = luckRow.labelSpan;

statsColumn.appendChild(strRow.row);
statsColumn.appendChild(crRow.row);
statsColumn.appendChild(cdRow.row);
statsColumn.appendChild(luckRow.row); 

// update stats function
function updateStatDisplays() {
  statPointsDisplay.textContent = `Stat Points: ${statPoints}`;
  strLabel.textContent = `STR: ${strength}`;
  crLabel.textContent = `Crit Rate: ${critRate}%`;
  cdLabel.textContent = `Crit Damage: ${critDamage}%`;
  luckLabel.textContent = `Luck: ${luck}%`;
}

// Update stats and level
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

  // level up logic
  if (currentLevel > level) {
    level = currentLevel;
    statPoints += 5;

    // unlock the milestones
    if (level >= 3 && !atLevel3) {
      atLevel3 = true;
    }
    if (level >= 5 && !atLevel5) {
      atLevel5 = true;
      goldDisplay.style.display = "block";
      weaponBox.style.display = "block";
      buyButton.style.display = "block";
    }
    if (level >= 10 && !atLevel10) {
      atLevel10 = true;
    }
  }

  // Update UI
  expDisplay.textContent = `EXP: ${exp}`;
  levelDisplay.textContent = `Level: ${level} (${currentExp}/${expNeeded})`;
  if (level >= 5) {
    goldDisplay.textContent = `Gold: ${Math.floor(gold)}`;
  }

  updateStatDisplays();
}

// stat buttons logic

// STR
strRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) {
    strength++;
    statPoints--;
    updateStatDisplays();
  }
});
strRow.minusBtn.addEventListener("click", () => {
  if (strength > 0) {
    strength--;
    statPoints++;
    updateStatDisplays();
  }
});

// Crit Rate (max 100%)
crRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0 && critRate < 100) {
    critRate += 5;
    statPoints--;
    if (critRate > 100) critRate = 100;
    updateStatDisplays();
  }
});
crRow.minusBtn.addEventListener("click", () => {
  if (critRate > 5) {
    critRate -= 5;
    statPoints++;
    updateStatDisplays();
  }
});

// Crit Damage
cdRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) {
    critDamage += 10;
    statPoints--;
    updateStatDisplays();
  }
});
cdRow.minusBtn.addEventListener("click", () => {
  if (critDamage > 50) {
    critDamage -= 10;
    statPoints++;
    updateStatDisplays();
  }
});

// Luck
luckRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) {
    luck += 10;
    statPoints++;
    updateStatDisplays();
  }
});
luckRow.minusBtn.addEventListener("click", () => {
  if (luck > 0) {
    luck -= 10;
    statPoints++;
    updateStatDisplays();
  }
});

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
  weaponBox.style.color = "#000"; // Black text
  weaponBox.style.backgroundColor = "#fff"; // White background
  weaponBox.style.boxSizing = "border-box";

  buyButton.disabled = gold < cost;
}

// click handler
clickButton.addEventListener("click", () => {
  exp += 1 + weaponLevel; // Base + weapon bonus
  updateStatsDisplay();
});

// passive exp system
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

  // update global display
  updateStatsDisplay();
  if (level >= 5) updateShopDisplay();
}, 1000);

// passive gold
let lastTime = 0;
let goldAccumulator = 0;

function animate(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (level >= 5) {
    // Accumulate time toward 1000ms
    goldAccumulator += deltaTime;
    if (goldAccumulator >= 1000) {
      const intervals = Math.floor(goldAccumulator / 1000);
      const gainedGold = intervals * goldPerSec;
      gold += gainedGold;
      passiveGold += gainedGold;
      goldAccumulator -= intervals * 1000;

      // Update UI
      passiveGoldBox.innerHTML =
        `Passive Gold: ${goldPerSec}/s<br>Accumulated: ${
          Math.floor(passiveGold)
        }`;
      passiveGoldBox.style.backgroundColor = "#fff0e0";
      passiveGoldBox.style.color = "#996600";

      updateStatsDisplay();
      updateShopDisplay();
    }
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

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
