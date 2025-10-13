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

// core variables
let exp = 0;
let level = 0;
let statPoints = 5;
let gold = 5;

// reset
let resets = 0;
let ascensionMultiplier = 1;

// player stats
let strength = 0;
let critRate = 5;
let critDamage = 50;
let luck = 0;

// equipment
let weaponLevel = 0;
let helmetLevel = 0;
let charmLevel = 0;

// passive income
let expPerSec = 1;
let goldPerSec = 1;
let passiveExp = 0;
let passiveGold = 0;

// combat
let currentEnemy = "Training Dummy";
let enemyHP = 0;
let maxEnemyHP = 0;

// level milestones
let atLevel3 = false;
let atLevel5 = false;
let atLevel10 = false;

// create sta trow
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
const crRow = createStatRow("Crit Rate", `${critRate}%`);     // Correct order!
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
    }
    if (level >= 10 && !atLevel10) atLevel10 = true;
  }

  // update ui
  expDisplay.textContent = `EXP: ${exp}`;
  levelDisplay.textContent = `Level: ${level} (${Math.floor(currentExp)}/${expNeeded})`;
  if (level >= 5) {
    goldDisplay.textContent = `Gold: ${Math.floor(gold)}`;
  }

  updateStatDisplays();
}

// stat button logic
strRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) { strength++; statPoints--; updateStatDisplays(); }
});
strRow.minusBtn.addEventListener("click", () => {
  if (strength > 0) { strength--; statPoints++; updateStatDisplays(); }
});

crRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0 && critRate < 100) {
    critRate += 5;
    statPoints--;
    if (critRate > 100) critRate = 100;
    updateStatDisplays();
  }
});
crRow.minusBtn.addEventListener("click", () => {
  if (critRate > 5) { critRate -= 5; statPoints++; updateStatDisplays(); }
});

cdRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) { critDamage += 10; statPoints--; updateStatDisplays(); }
});
cdRow.minusBtn.addEventListener("click", () => {
  if (critDamage > 50) { critDamage -= 10; statPoints++; updateStatDisplays(); }
});

luckRow.plusBtn.addEventListener("click", () => {
  if (statPoints > 0) { luck += 10; statPoints++; updateStatDisplays(); }
});
luckRow.minusBtn.addEventListener("click", () => {
  if (luck > 0) { luck -= 10; statPoints++; updateStatDisplays(); }
});

// column 2: combat
const combatColumn = document.createElement("div");
combatColumn.style.width = "200px";
combatColumn.innerHTML = "<h3>Combat</h3>";
app.appendChild(combatColumn);

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

  let minHP: number, maxHP: number;
  if (level < 5) { minHP = 25; maxHP = 75; }
  else if (level < 10) { minHP = 50; maxHP = 100; }
  else { minHP = 75; maxHP = 125; }

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
  let damage = Math.floor(minDamage + Math.random() * (maxDamage - minDamage + 1));

  // did it crit
  if (Math.random() * 100 < critRate) {
    damage = Math.floor(damage * (1 + critDamage / 100));
  }

  // apply damage immediately
  enemyHP -= damage;

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
  height: "40px", // Fixed height
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
buyButton.style.display = "none"; // Hidden until level 5
miscellColumn.appendChild(buyButton);

// update shop
function updateShopDisplay() {
  if (!atLevel5) return;

  const cost = Math.pow(2, helmetLevel + 1);
  helmetBox.innerHTML = `
    Helmet Level: ${helmetLevel}<br>
    Cost: ${cost} gold
  `;

  // Make sure text is readable
  helmetBox.style.color = "#000"; // Black text
  helmetBox.style.backgroundColor = "#fff"; // White background
  helmetBox.style.boxSizing = "border-box";

  buyButton.disabled = gold < cost;
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
    // Accumulate time toward 1000ms
    goldAccumulator += deltaTime;
    if (goldAccumulator >= 1000) {
      const intervals = Math.floor(goldAccumulator / 1000);
      const gainedGoldPerSec = 1 + helmetLevel;  // Helmets boost gold too!
      const gainedGold = intervals * gainedGoldPerSec;
      
      gold += gainedGold;
      passiveGold += gainedGold;
      goldAccumulator -= intervals * 1000; // Remove full seconds

      // Update UI
      passiveGoldBox.innerHTML = `Passive Gold: ${gainedGoldPerSec}/s<br>Accumulated: ${Math.floor(passiveGold)}`;
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
