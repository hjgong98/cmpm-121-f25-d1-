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

// initial stats
let exp = 0;
let level = 0;
let statPoints = 5;
// let gold = 0;
// let goldPerSec = 0;
// let expPerSec = 0;
// let enhanceLevel = 0;

// display elements
const expDisplay = document.createElement("div");
const levelDisplay = document.createElement("div");
const statPointsDisplay = document.createElement("div");
const goldDisplay = document.createElement("div");
goldDisplay.style.display = "none"; // hidden until level 5

updateStatsDisplay();

statsColumn.appendChild(expDisplay);
statsColumn.appendChild(levelDisplay);
statsColumn.appendChild(statPointsDisplay);
statsColumn.appendChild(goldDisplay);

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

// create boxes

// box 1 (unlocks at level 3)

// box 2 (unlocks at level 5)

// box 3 (tbc)

// click handler
clickButton.addEventListener("click", () => {
  exp++;
  updateStatsDisplay();
});
app.appendChild(combatColumn);

// column 3 (achievement shop reset)
const miscellColumn = document.createElement("div");
miscellColumn.style.width = "200px";
miscellColumn.innerHTML = "<h3>Achievements</h3>";
app.appendChild(miscellColumn);

// Achievements box
const achievementsBox = document.createElement("div");
achievementsBox.style.width = "180px";
achievementsBox.style.height = "180px";
achievementsBox.style.border = "2px solid #555";
achievementsBox.style.margin = "0 auto";
achievementsBox.style.display = "flex";
achievementsBox.style.alignItems = "center";
achievementsBox.style.justifyContent = "center";
achievementsBox.textContent = "Achievements";
miscellColumn.appendChild(achievementsBox);

// add shop title

// add shop box (unlocks at level 5)
// for section :) delete later

// update stats function
function updateStatsDisplay() {
  // calculate current level and progress
  let currentExp = exp;
  let currentLevel = 0;
  let expNeeded = 5;
  // note: dont forget to add stuff here  -delete when done

  while (currentExp >= expNeeded) {
    currentExp -= expNeeded;
    currentLevel++;
    expNeeded *= 2;
  }

  // update level and stat points if changed
  if (currentLevel > level) {
    level = currentLevel;
    statPoints += 5;
  }

  // update display
  expDisplay.textContent = `EXP: ${exp}`;
  levelDisplay.textContent = `Level: ${level} (${currentExp}/${expNeeded})`;
  statPointsDisplay.textContent = `Stat Points: ${statPoints}`;
}
