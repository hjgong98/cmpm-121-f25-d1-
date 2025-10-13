# CMPM 121 D1 Project

notes: clicker monster hunter game
column 1:
title: player stats:
  exp (total accumulated)
  level: 0 (0 / 5)
    exp to next level - 5 * (2^x)
  stat points: 5 (each level adds 5 more)
  gold: 5 
  stat points distribution:
  STR : affects how much damage player does
    damage calc : base - base + STR  -- (base = player level + 2^x + weapon)
  crit rate : 5% start
  crit damage : 50% start
  luck :

middle column:
title: combat
box for training dummy / monster
  level < 0 : training dummy only, hp pool random 25-75
  level >=5 but < 10 : 25% chance for monster, hp pool random 50-100
  levle >= 10 : 50% chance for monster, hp pool random 75-100
attack button
 (when level < 5, exp gained from killing is randomized between 10 and 20, when level between 5 and 10, exp gained is between 20 and 30, etc, if its a monster same philosophy except theres also a random gold gained from between the same numbers)
box that unlocks passive training after level 3, gains 1 exp per second
box that unlocks passive gold (maybe call it part time job), gains 1 gold per second
box that says coming soon
  
column 3:  
top title: achievements  
a square box( save this for something later and have it be achievements that can be earned by playing the game)
another title: shops  
box called helmet upgrades: level 0 --- 2 gold
box called weapon upgrades: level 0 – 2 gold
box called charm: level 0 – 2 gold
  
reset button – unlocks after level 100 – multiplies any exp and gold gained with each reset ( 1 reset makes it all be multiplied by 2, 2 resets makes it all be multiplied by 3, etc ) and then everything is set to base – level 0, 5 stat points, etc.
