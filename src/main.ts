// src/main.ts

// basic app setup
const app = document.createElement("div");
app.style.display = "flex";
app.style.gap = "20px";
app.style.padding = "20px";
app.style.fontFamily = "sans-serif";
document.body.appendChild(app);

// column 1 : player stats
const statsColumn = document.createElement("div");
statsColumn.style.width = "200px";
statsColumn.innerHTML = "<h3>Player Stats</h3>";
app.appendChild(statsColumn);

statsColumn.style.backgroundImage =
  'url("https://img.craftpix.net/2023/10/Free-Summer-Pixel-Art-Backgrounds3.jpg")';
statsColumn.style.backgroundSize = "cover";
statsColumn.style.backgroundPosition = "center";
statsColumn.style.backgroundRepeat = "no-repeat";
statsColumn.style.borderRadius = "8px"; // soft corners for vibe
statsColumn.style.position = "relative";
statsColumn.style.overflow = "hidden";

// core variables for player
let exp = 0;
let level = 0;
let statPoints = 5;
let gold = 5;

// reset values
// add in the future
// reset button resets game to the very beginning, but increases exp/gold gain by # of resets

// player stats (will be increased from using statPoints)
let strength = 0;
let critRate = 5;
let critDamage = 50;
let luck = 0;

// equipment levels (affects gameplay)
let weaponLevel = 0;
let helmetLevel = 0;
let charmLevel = 0;

// passive income (gold and exp gained per second)
const expPerSec = 1;
let passiveExp = 0;
let passiveGold = 0;

// combat
let currentEnemy = "Training Dummy";
let enemyHP = 0;
let maxEnemyHP = 0;

// level milestones (will unlock extra features)
let atLevel3 = false;
let atLevel5 = false;
let atLevel10 = false;

// create stat row
function createStatRow(label: string, value: number | string) {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.alignItems = "center";
  row.style.justifyContent = "space-between";
  row.style.margin = "6px 0";
  row.style.fontSize = "14px";

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

// helper function for stats
function setupStatButtons(
  minusBtn: HTMLButtonElement,
  plusBtn: HTMLButtonElement,
  getValue: () => number,
  setValue: (value: number) => void,
  canIncrement: () => boolean = () => statPoints > 0,
  onIncrement: () => void = () => {
    statPoints--;
  },
  onDecrement: () => void = () => {
    statPoints++;
  },
) {
  plusBtn.addEventListener("click", () => {
    if (canIncrement()) {
      setValue(getValue() + 1);
      onIncrement();
      updateStatDisplays();
    }
  });

  minusBtn.addEventListener("click", () => {
    const currentValue = getValue();
    if (currentValue > 0) {
      setValue(currentValue - 1);
      onDecrement();
      updateStatDisplays();
    }
  });
}

// ui
const expDisplay = document.createElement("div");
const levelDisplay = document.createElement("div");

// statpointsdisplay
const statPointsDisplay = document.createElement("div");
statPointsDisplay.style.margin = "10px 0";
statPointsDisplay.textContent = `Stat Points: ${statPoints}`;

const goldDisplay = document.createElement("div");
goldDisplay.style.display = "none";

// append
statsColumn.appendChild(expDisplay);
statsColumn.appendChild(levelDisplay);
statsColumn.appendChild(statPointsDisplay);
statsColumn.appendChild(goldDisplay);

// stat rows
const strRow = createStatRow("STR", strength);
const crRow = createStatRow("Crit Rate", `${critRate}%`); // Correct order!
const cdRow = createStatRow("Crit Damage", `${critDamage}%`);
const luckRow = createStatRow("Luck", `${luck}%`);

// label
const strLabel = strRow.labelSpan;
const crLabel = crRow.labelSpan;
const cdLabel = cdRow.labelSpan;
const luckLabel = luckRow.labelSpan;

// append
statsColumn.appendChild(strRow.row);
statsColumn.appendChild(crRow.row);
statsColumn.appendChild(cdRow.row);
statsColumn.appendChild(luckRow.row);

// update
function updateStatDisplays() {
  statPointsDisplay.textContent = `Stat Points: ${statPoints}`;
  strLabel.textContent = `STR: ${strength}`;
  crLabel.textContent = `Crit Rate: ${critRate}%`;
  cdLabel.textContent = `Crit Damage: ${critDamage}%`;
  luckLabel.textContent = `Luck: ${luck}%`;
}

// update stat display
function updateStatsDisplay() {
  let currentExp = exp;
  let currentLevel = 0;
  let expNeeded = 5;

  while (currentExp >= expNeeded) {
    currentExp -= expNeeded;
    currentLevel++;
    expNeeded *= 2;
  }

  // Level up
  if (currentLevel > level) {
    level = currentLevel;
    statPoints += 5;

    // level markers
    if (level >= 3 && !atLevel3) atLevel3 = true;
    if (level >= 5 && !atLevel5) {
      atLevel5 = true;
      goldDisplay.style.display = "block";
      helmetBox.style.display = "block";
      buyButton.style.display = "block";
      weaponBox.style.display = "block";
      weaponBuyButton.style.display = "block";
      charmBox.style.display = "block";
      charmBuyButton.style.display = "block";
    }
    if (level >= 10 && !atLevel10) atLevel10 = true;
  }

  // update ui
  expDisplay.textContent = `EXP: ${exp}`;
  levelDisplay.textContent = `Level: ${level} (${
    Math.floor(currentExp)
  }/${expNeeded})`;
  if (level >= 5) {
    goldDisplay.textContent = `Gold: ${Math.floor(gold)}`;
  }

  updateStatDisplays();
}

// strength
setupStatButtons(
  strRow.minusBtn,
  strRow.plusBtn,
  () => strength,
  (val) => {
    strength = val;
  },
);

// crit rate with cap
setupStatButtons(
  crRow.minusBtn,
  crRow.plusBtn,
  () => critRate,
  (val) => {
    critRate = val;
  },
  () => statPoints > 0 && critRate < 100,
  () => {
    statPoints--;
  },
);

// crit damage
setupStatButtons(
  cdRow.minusBtn,
  cdRow.plusBtn,
  () => critDamage,
  (val) => {
    critDamage = val;
  },
  () => statPoints > 0,
  () => {
    statPoints--;
  },
);

// luck (increments by 10, special rule)
setupStatButtons(
  luckRow.minusBtn,
  luckRow.plusBtn,
  () => luck,
  (val) => {
    luck = val;
  },
  () => statPoints > 0,
  () => {
    statPoints--;
  },
);

// column 2: combat
const combatColumn = document.createElement("div");
combatColumn.style.width = "200px";
combatColumn.innerHTML = "<h3>Combat</h3>";
app.appendChild(combatColumn);

combatColumn.style.backgroundImage =
  'url("https://img.craftpix.net/2023/10/Free-Summer-Pixel-Art-Backgrounds3.jpg")';
combatColumn.style.backgroundSize = "cover";
combatColumn.style.backgroundPosition = "center";
combatColumn.style.backgroundRepeat = "no-repeat";
combatColumn.style.borderRadius = "8px";
combatColumn.style.position = "relative";
combatColumn.style.overflow = "hidden";

// enemy box
const enemyBox = document.createElement("div");
Object.assign(enemyBox.style, {
  width: "180px",
  height: "180px",
  border: "2px solid #555",
  margin: "0 auto",
  position: "relative",
  backgroundColor: "#fff",
  textAlign: "center",
  fontSize: "14px",
  overflow: "hidden",
});

// hp
const hpDisplay = document.createElement("div");
hpDisplay.style.position = "absolute";
hpDisplay.style.top = "8px";
hpDisplay.style.left = "8px";
hpDisplay.style.color = "red";
hpDisplay.style.fontWeight = "bold";
hpDisplay.style.fontSize = "12px";

// enemy name
const enemyNameDisplay = document.createElement("div");
enemyNameDisplay.style.position = "absolute";
enemyNameDisplay.style.bottom = "8px";
enemyNameDisplay.style.left = "50%";
enemyNameDisplay.style.transform = "translateX(-50%)";
enemyNameDisplay.style.fontWeight = "bold";
enemyNameDisplay.style.color = "#333";
enemyNameDisplay.style.fontSize = "14px";

// create image element
const enemyImage = document.createElement("img");
Object.assign(enemyImage.style, {
  width: "120px",
  height: "120px",
  objectFit: "contain",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  transition: "transform 0.1s ease",
});

enemyBox.appendChild(enemyImage);
enemyBox.appendChild(hpDisplay);
enemyBox.appendChild(enemyNameDisplay);
combatColumn.appendChild(enemyBox);

// attack button
const attackButton = document.createElement("button");
attackButton.textContent = "⚔ Attack! ⚔";
attackButton.style.width = "180px";
attackButton.style.margin = "10px auto";
attackButton.style.display = "block";
combatColumn.appendChild(attackButton);

// passive boxes
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

const passiveExpBox = createPassiveBox("Unlocks at level 3");
const passiveGoldBox = createPassiveBox("Unlocks at level 5");
const placeholderBox = createPassiveBox("Coming soon...");
combatColumn.appendChild(passiveExpBox);
combatColumn.appendChild(passiveGoldBox);
combatColumn.appendChild(placeholderBox);

// spawn enemy
function spawnEnemy() {
  let isMonster = false;
  if (level >= 10) isMonster = Math.random() < 0.5;
  else if (level >= 5) isMonster = Math.random() < 0.25;

  currentEnemy = isMonster ? "Monster" : "Training Dummy";

  // Set image source
  if (currentEnemy === "Training Dummy") {
    enemyImage.src =
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e57c0ca5-c162-43e7-b0dc-40f215c30321/di9bip6-fe55068c-72c3-4510-bbc0-7cb02a44e17c.png/v1/fill/w_320,h_320/2d_dummy_sprite_by_retronc_di9bip6-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzIwIiwicGF0aCI6Ii9mL2U1N2MwY2E1LWMxNjItNDNlNy1iMGRjLTQwZjIxNWMzMDMyMS9kaTliaXA2LWZlNTUwNjhjLTcyYzMtNDUxMC1iYmMwLTdjYjAyYTQ0ZTE3Yy5wbmciLCJ3aWR0aCI6Ijw9MzIwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.uTX8d0eoYACnjMsI6FDksB9HI1xtFigzdO4Uq3vkl2A";
  } else {
    enemyImage.src =
      "https://media.moddb.com/images/downloads/1/219/218099/ghost.png";
  }

  // Reset any shake
  enemyImage.style.transform = "translate(-50%, -50%)";

  // Set HP
  let minHP: number, maxHP: number;
  if (level < 5) {
    minHP = 25;
    maxHP = 75;
  } else if (level < 10) {
    minHP = 50;
    maxHP = 100;
  } else {
    minHP = 75;
    maxHP = 125;
  }
  enemyHP = Math.floor(minHP + Math.random() * (maxHP - minHP + 1));
  maxEnemyHP = enemyHP;

  hpDisplay.textContent = `HP: ${Math.floor(enemyHP)}`;
  enemyNameDisplay.textContent = currentEnemy;
}

spawnEnemy();

// attack button
attackButton.addEventListener("click", () => {
  // only allow attack if enemy is alive
  if (enemyHP <= 0) return;

  // exp per hit
  const expPerHit = 1 + weaponLevel;
  exp += expPerHit;

  // calc damage
  const minDamage = 5 + (2 * level) + weaponLevel;
  const maxDamage = minDamage + strength;
  let damage = Math.floor(
    minDamage + Math.random() * (maxDamage - minDamage + 1),
  );

  // did it crit
  if (Math.random() * 100 < critRate) {
    damage = Math.floor(damage * (1 + critDamage / 100));
  }

  // apply damage immediately
  enemyHP -= damage;

  // Shake animation!
  enemyImage.style.transform = "translate(-52%, -50%)";
  setTimeout(() => {
    enemyImage.style.transform = "translate(-48%, -50%)";
    setTimeout(() => {
      enemyImage.style.transform = "translate(-52%, -50%)";
      setTimeout(() => {
        enemyImage.style.transform = "translate(-50%, -50%)"; // back to center
      }, 50);
    }, 50);
  }, 50);

  // hpdate hp display
  hpDisplay.textContent = `HP: ${Math.max(0, Math.floor(enemyHP))}`;

  // 🎉 6. If enemy dies
  if (enemyHP <= 0) {
    const baseReward = maxEnemyHP;
    if (currentEnemy === "Training Dummy") {
      exp += baseReward;
    } else {
      exp += Math.floor(baseReward / 2);
      gold += Math.floor(baseReward / 2);
    }

    // respawn
    spawnEnemy();
  }

  // update ui
  updateStatsDisplay();
  updateShopDisplay();
});

updateStatsDisplay();

// column 3 (achievement shop reset)
const miscellColumn = document.createElement("div");
miscellColumn.style.width = "200px";
miscellColumn.innerHTML = "<h3>Achievements</h3>";
app.appendChild(miscellColumn);

miscellColumn.style.backgroundImage =
  'url("https://img.craftpix.net/2023/10/Free-Summer-Pixel-Art-Backgrounds3.jpg")';
miscellColumn.style.backgroundSize = "cover";
miscellColumn.style.backgroundPosition = "center";
miscellColumn.style.backgroundRepeat = "no-repeat";
miscellColumn.style.borderRadius = "8px";
miscellColumn.style.position = "relative";
miscellColumn.style.overflow = "hidden";

// achievements box
const achievementsBox = document.createElement("div");
Object.assign(achievementsBox.style, {
  width: "180px",
  height: "180px",
  border: "2px solid #555",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  color: "#888",
  fontSize: "14px",
});
achievementsBox.textContent = "Achievements";
miscellColumn.appendChild(achievementsBox);

// shop title
const shopTitle = document.createElement("h4");
shopTitle.textContent = "Shop";
shopTitle.style.marginTop = "20px";
miscellColumn.appendChild(shopTitle);

// shop info
const helmetBox = document.createElement("div");
Object.assign(helmetBox.style, {
  width: "180px",
  height: "40px",
  border: "2px solid #555",
  margin: "0 auto",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 0",
  color: "#fff",
});
miscellColumn.appendChild(helmetBox);

// purchase button
const buyButton = document.createElement("button");
buyButton.textContent = "Buy";
buyButton.style.width = "180px";
buyButton.style.margin = "10px auto";
buyButton.style.display = "none";
miscellColumn.appendChild(buyButton);

// weapon shop
const weaponBox = document.createElement("div");
Object.assign(weaponBox.style, {
  width: "180px",
  height: "40px",
  border: "2px solid #555",
  margin: "10px auto",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 0",
  boxSizing: "border-box",
  color: "#000",
  backgroundColor: "#fff",
});
miscellColumn.appendChild(weaponBox);

const weaponBuyButton = document.createElement("button");
weaponBuyButton.textContent = "Buy";
weaponBuyButton.style.width = "180px";
weaponBuyButton.style.margin = "10px auto";
weaponBuyButton.style.display = "none";
miscellColumn.appendChild(weaponBuyButton);

// charm shop
const charmBox = document.createElement("div");
Object.assign(charmBox.style, {
  width: "180px",
  height: "40px",
  border: "2px solid #555",
  margin: "10px auto",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 0",
  boxSizing: "border-box",
  color: "#000",
  backgroundColor: "#fff",
});
miscellColumn.appendChild(charmBox);

const charmBuyButton = document.createElement("button");
charmBuyButton.textContent = "Buy";
charmBuyButton.style.width = "180px";
charmBuyButton.style.margin = "10px auto";
charmBuyButton.style.display = "none";
miscellColumn.appendChild(charmBuyButton);

// update shop
function updateShopDisplay() {
  if (!atLevel5) return;

  const cost = Math.pow(2, helmetLevel + 1);
  helmetBox.innerHTML = `
    Helmet Level: ${helmetLevel}<br>
    Cost: ${cost} gold
  `;

  const weaponCost = Math.pow(2, weaponLevel + 1);
  weaponBox.innerHTML = `
    Weapon Level: ${weaponLevel}<br>
    Cost: ${weaponCost} gold
  `;

  const charmCost = Math.pow(2, charmLevel + 1);
  charmBox.innerHTML = `
  Charm Level: ${charmLevel}<br>
  Cost: ${charmCost} gold
  `;

  // make sure text is readable
  helmetBox.style.color = "#000";
  helmetBox.style.backgroundColor = "#fff";
  helmetBox.style.boxSizing = "border-box";

  weaponBox.style.color = "#000";
  weaponBox.style.backgroundColor = "#fff";
  weaponBox.style.boxSizing = "border-box";

  charmBox.style.color = "#000";
  charmBox.style.backgroundColor = "#fff";
  charmBox.style.boxSizing = "border-box";

  buyButton.disabled = gold < cost;
  weaponBuyButton.disabled = gold < weaponCost;
  charmBuyButton.disabled = gold < charmCost;
}

// passive exp system
setInterval(() => {
  if (level >= 3) {
    const gainedExp = expPerSec + helmetLevel;
    exp += gainedExp;
    passiveExp += gainedExp;
    passiveExpBox.innerHTML = `Passive EXP: ${gainedExp}/s<br>Accumulate: ${
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
    // accumulate time toward 1000ms
    goldAccumulator += deltaTime;
    if (goldAccumulator >= 1000) {
      const intervals = Math.floor(goldAccumulator / 1000);
      const gainedGoldPerSec = 1 + helmetLevel;
      const gainedGold = intervals * gainedGoldPerSec;

      gold += gainedGold;
      passiveGold += gainedGold;
      goldAccumulator -= intervals * 1000;

      // update UI
      passiveGoldBox.innerHTML =
        `Passive Gold: ${gainedGoldPerSec}/s<br>Accumulated: ${
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
  const cost = Math.pow(2, helmetLevel + 1);
  if (gold >= cost) {
    gold -= cost;
    helmetLevel++;

    updateStatsDisplay();
    updateShopDisplay();
  }
});

// weapon purchase logic
weaponBuyButton.addEventListener("click", () => {
  const weaponCost = Math.pow(2, weaponLevel + 1);
  if (gold >= weaponCost) {
    gold -= weaponCost;
    weaponLevel++;

    updateStatsDisplay();
    updateShopDisplay();
  }
});

// charm button Logic
charmBuyButton.addEventListener("click", () => {
  const charmCost = Math.pow(2, charmLevel + 1);
  if (gold >= charmCost) {
    gold -= charmCost;
    charmLevel++;
    updateStatsDisplay();
    updateShopDisplay();
  }
});
