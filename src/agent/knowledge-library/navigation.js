import pf from "mineflayer-pathfinder";

export function followPlayer(bot, username, distance = 3) {
  const player = bot.players[username]?.entity;
  if (!player) return;

  const movements = new pf.Movements(bot);
  const goal = new pf.goals.GoalFollow(player, distance);

  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal, true);
}

export function goToPlayer(bot, username, distance = 3) {
  const player = bot.players[username]?.entity;
  if (!player) return;

  const { x, y, z } = player.position;
  const movements = new pf.Movements(bot);
  const goal = new pf.goals.GoalNear(x, y, z, distance);

  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal);
}
