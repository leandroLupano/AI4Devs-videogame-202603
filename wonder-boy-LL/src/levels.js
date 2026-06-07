// Ground y: 400  Player standing y: 358  HUD bottom: 36
// Each level: { platforms, entities, finishX, width }
// Entity types: snail | bat | spider | coin | apple | banana | weapon | hazard | finish

const G = 400;   // ground top-y
const MID = 320; // mid platform y
const HI  = 250; // high platform y
const VHI = 190; // very high platform y

function ground(x, w) {
  return { x, y: G, w, h: 80, moving: false };
}

function plat(x, y, w, moving = false) {
  return { x, y, w, h: 20, moving, moveRange: moving ? 100 : 0, moveDir: 1, moveSpeed: 60 };
}

function snail(x) {
  return { type: 'snail', x, y: G - 26, w: 28, h: 26, vx: -50, vy: 0, onGround: true, dead: false, facingLeft: true };
}

function bat(x, y) {
  return { type: 'bat', x, y, w: 30, h: 16, vx: -70, vy: 0, sineBase: y, sineAmp: 40, sineSpeed: 2, dead: false };
}

function spider(x, attachY) {
  return { type: 'spider', x, y: attachY + 20, w: 20, h: 24, vx: 0, vy: 0, ceilingY: attachY, threadY: attachY + 20, dropRange: 80, dropDir: 1, speed: 40, dead: false };
}

function coin(x, y) {
  y = y ?? G - 28;
  return { type: 'coin', x, y, w: 14, h: 14, dead: false };
}

function apple(x, y) {
  y = y ?? G - 34;
  return { type: 'apple', x, y, w: 22, h: 22, dead: false };
}

function banana(x, y) {
  y = y ?? G - 36;
  return { type: 'banana', x, y, w: 18, h: 22, dead: false };
}

function weapon(x, y) {
  y = y ?? G - 36;
  return { type: 'weapon', x, y, w: 22, h: 22, dead: false };
}

function hazard(x, y, w, kind) {
  return { type: 'hazard', subtype: kind, x, y, w, h: kind === 'fire' ? 28 : 14, dead: false };
}

function finish(x, y) {
  y = y ?? G - 80;
  return { type: 'finish', x, y, w: 60, h: 80, dead: false };
}

// ── Level 1 — Jungle Awakening ────────────────────────────────────────────────
const level1 = {
  title: 'Jungle Awakening',
  width: 3200,
  platforms: [
    ground(0, 620),
    ground(680, 540),
    ground(1290, 620),
    ground(1990, 700),
    ground(2770, 430),
    // Elevated — safe and risky routes
    plat(500, MID + 20, 110),
    plat(750, MID, 130),
    plat(1400, MID + 10, 100),
    plat(1700, MID, 120),
    plat(2200, HI + 10, 110),
    plat(2600, MID, 100),
  ],
  entities: [
    // Enemies
    snail(860),
    snail(1550),
    snail(2300),
    // Coins — ground level (safe route)
    coin(180), coin(380), coin(700), coin(1050),
    coin(1600), coin(2050), coin(2500), coin(2900),
    // Coins — elevated (risky route)
    coin(760, MID - 20), coin(1710, MID - 20),
    // Apples
    apple(490), apple(1310), apple(2010), apple(2800),
    // Bananas on high platforms (risky)
    banana(760, MID - 40), banana(2210, HI - 20),
    // Weapon pickup mid-level
    weapon(1850),
    // Finish marker
    finish(3050),
  ],
};

// ── Level 2 — Deeper Forest ───────────────────────────────────────────────────
const level2 = {
  title: 'Deeper Forest',
  width: 4000,
  platforms: [
    ground(0, 550),
    ground(630, 480),
    ground(1200, 520),
    ground(1820, 580),
    ground(2510, 560),
    ground(3180, 600),
    ground(3880, 120),
    plat(450, MID, 120),
    plat(700, HI, 100),
    plat(1050, MID + 10, 110),
    plat(1450, HI, 100),
    plat(1700, MID, 130),
    plat(2200, HI, 120),
    plat(2700, MID, 100),
    plat(3050, HI, 110),
    plat(3450, MID, 120),
    plat(3700, HI, 100),
  ],
  entities: [
    // Enemies
    snail(700), snail(1400), snail(2200), snail(3100),
    bat(900, HI - 30), bat(2000, HI - 30),
    // Coins
    coin(200), coin(450), coin(800), coin(1250),
    coin(1700), coin(2300), coin(3200), coin(3700),
    // Elevated coins
    coin(710, HI - 20), coin(1460, HI - 20), coin(3460, MID - 20),
    // Apples
    apple(600), apple(1300), apple(2500),
    // Bananas (risky)
    banana(720, HI - 40), banana(2210, HI - 40), banana(3710, HI - 40),
    // Weapon
    weapon(2100), weapon(3600),
    // Finish
    finish(3880),
  ],
};

// ── Level 3 — Rocky Cliffs ────────────────────────────────────────────────────
const level3 = {
  title: 'Rocky Cliffs',
  width: 4800,
  platforms: [
    ground(0, 480),
    ground(580, 420),
    ground(1120, 480),
    ground(1720, 500),
    ground(2380, 460),
    ground(2980, 500),
    ground(3620, 460),
    ground(4260, 440),
    ground(4760, 40),
    plat(380, MID, 110),
    plat(700, HI, 120),
    plat(1000, MID, 100),
    plat(1380, HI, 110),
    plat(1800, MID, 120),
    plat(2100, HI, 100),
    plat(2500, MID, 110),
    plat(2800, HI + 10, 120),
    plat(3200, MID, 100),
    plat(3500, VHI, 100),
    plat(3800, MID, 110),
    plat(4100, HI, 100),
    plat(4450, MID, 120),
    plat(200, MID - 10, 100, true),   // moving platform
  ],
  entities: [
    // Enemies
    snail(650), snail(1400), snail(2600),
    bat(900, HI - 30), bat(2200, HI - 30), bat(3500, VHI - 30),
    spider(1800, MID - 80), spider(3200, MID - 80),
    // Coins
    coin(150), coin(500), coin(900), coin(1200),
    coin(1900), coin(2400), coin(3100), coin(3700),
    // Elevated
    coin(710, HI - 20), coin(2110, HI - 20), coin(3510, VHI - 20),
    // Apples
    apple(500), apple(1750), apple(3650),
    // Bananas (risky high platforms)
    banana(710, HI - 40), banana(2110, HI - 40),
    banana(3510, VHI - 40), banana(4110, HI - 40),
    // Hazard: spikes in a pit area
    hazard(1120, G - 14, 100, 'spike'),
    hazard(3620, G - 14, 80, 'spike'),
    // Weapons
    weapon(2300), weapon(4000),
    // Finish
    finish(4760),
  ],
};

// ── Level 4 — Treetop Village ─────────────────────────────────────────────────
const level4 = {
  title: 'Treetop Village',
  width: 5600,
  platforms: [
    ground(0, 400),
    ground(500, 360),
    ground(980, 380),
    ground(1490, 360),
    ground(1990, 380),
    ground(2520, 340),
    ground(3020, 360),
    ground(3560, 340),
    ground(4100, 360),
    ground(4660, 340),
    ground(5200, 400),
    // Elevated platforms — narrower
    plat(300, MID, 90),
    plat(600, HI, 85),
    plat(1100, MID, 90),
    plat(1550, HI, 80),
    plat(1700, MID, 85),
    plat(2100, VHI, 90),
    plat(2350, HI, 80),
    plat(2700, MID, 85),
    plat(3000, VHI, 90),
    plat(3250, HI, 80),
    plat(3650, MID, 90),
    plat(3900, HI, 85),
    plat(4200, VHI, 90),
    plat(4500, HI, 80),
    plat(4750, MID, 90),
    plat(5000, HI, 85),
    plat(700, MID - 20, 80, true),   // moving
    plat(3100, HI - 20, 80, true),   // moving
  ],
  entities: [
    // Enemies — more varied
    snail(560), snail(1100), snail(2150), snail(3650),
    bat(750, HI - 30), bat(1900, HI - 30), bat(3200, VHI - 30), bat(4700, HI - 30),
    spider(2100, VHI - 80), spider(3000, VHI - 80), spider(4200, VHI - 80),
    // Coins — 10 total
    coin(200), coin(550), coin(1050), coin(1700),
    coin(2200), coin(2800), coin(3300), coin(3800),
    coin(4400), coin(5100),
    // Elevated coins
    coin(610, HI - 20), coin(2110, VHI - 20), coin(3910, HI - 20),
    // Apples — fewer, more strategic
    apple(450), apple(2600),
    // Bananas — risky high platforms (4 bananas)
    banana(620, HI - 40), banana(2110, VHI - 40),
    banana(3260, HI - 40), banana(5010, HI - 40),
    // Hazards
    hazard(1490, G - 14, 80, 'spike'),
    hazard(2520, G - 14, 80, 'spike'),
    hazard(4100, G - 14, 100, 'spike'),
    // Weapons
    weapon(1400), weapon(3500), weapon(5050, HI - 40),
    // Finish
    finish(5200 + 50),
  ],
};

// ── Level 5 — Volcano Peak ────────────────────────────────────────────────────
const level5 = {
  title: 'Volcano Peak',
  width: 6400,
  platforms: [
    ground(0, 350),
    ground(460, 300),
    ground(900, 300),
    ground(1360, 280),
    ground(1820, 300),
    ground(2300, 260),
    ground(2780, 280),
    ground(3280, 260),
    ground(3800, 280),
    ground(4380, 260),
    ground(4960, 280),
    ground(5560, 260),
    ground(6200, 200),
    // Narrow elevated platforms
    plat(260, MID, 75),
    plat(480, HI, 75),
    plat(700, VHI, 75),
    plat(1050, MID, 75),
    plat(1200, HI, 75),
    plat(1450, VHI, 75),
    plat(1700, MID, 75),
    plat(2000, HI, 75),
    plat(2150, VHI, 70),
    plat(2450, MID, 75),
    plat(2650, VHI, 70),
    plat(2950, HI, 75),
    plat(3100, MID, 75),
    plat(3400, VHI, 70),
    plat(3600, HI, 75),
    plat(3950, MID, 75),
    plat(4150, VHI, 70),
    plat(4550, HI, 75),
    plat(4750, MID, 75),
    plat(5150, VHI, 70),
    plat(5350, HI, 75),
    plat(5750, MID, 75),
    plat(5950, VHI, 70),
    plat(350, HI - 10, 75, true),   // moving
    plat(2300, MID - 10, 70, true), // moving
    plat(4800, HI - 10, 70, true),  // moving
  ],
  entities: [
    // Enemies — hardest configuration
    snail(520), snail(1050), snail(1950), snail(3400), snail(5200),
    bat(750, VHI - 30), bat(1500, VHI - 30), bat(2650, VHI - 30),
    bat(3600, VHI - 30), bat(5350, VHI - 30),
    spider(2150, VHI - 80), spider(3400, VHI - 80), spider(4150, VHI - 80), spider(5950, VHI - 80),
    // Coins — 12 total
    coin(150), coin(500), coin(950), coin(1450),
    coin(2000), coin(2500), coin(3100), coin(3650),
    coin(4200), coin(4800), coin(5400), coin(6000),
    // Elevated coins (risky)
    coin(710, VHI - 20), coin(2160, VHI - 20), coin(3410, VHI - 20),
    // Apples — scarce, rewarding
    apple(800), apple(4500),
    // Bananas — risky high routes (5 bananas)
    banana(710, VHI - 40), banana(2160, VHI - 40), banana(3410, VHI - 40),
    banana(5160, VHI - 40), banana(5960, VHI - 40),
    // Fire hazards
    hazard(460, G - 28, 80, 'fire'),
    hazard(1360, G - 28, 80, 'fire'),
    hazard(2300, G - 28, 80, 'fire'),
    hazard(3280, G - 28, 80, 'fire'),
    hazard(4380, G - 28, 80, 'fire'),
    hazard(5560, G - 28, 80, 'fire'),
    // Spike hazards in pits
    hazard(900, G - 14, 100, 'spike'),
    hazard(2780, G - 14, 100, 'spike'),
    hazard(4960, G - 14, 100, 'spike'),
    // Weapons
    weapon(1650), weapon(3700), weapon(5450, VHI - 40),
    // Finish
    finish(6200 + 20),
  ],
};

export const LEVELS = [level1, level2, level3, level4, level5];
