import { debugging } from "./debugging.js";
import { auth } from "./auth.js";
import { documentation } from "./documentation.js";
import { botActions } from "./bot-actions.js";
import { navigation } from "./navigation.js";

export const COMMAND_MAP = createCommandMap();

function createCommandMap() {
  const commandList = [
    ...debugging,
    ...auth,
    ...documentation,
    ...botActions,
    ...navigation,
  ];

  return commandList.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}
