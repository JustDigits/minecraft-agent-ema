import { navigation } from "./navigation.js";
import { botActions } from "./bot-actions.js";
import { documentation } from "./documentation.js";

export const COMMAND_MAP = createCommandMap();

function createCommandMap() {
  const commandList = [...documentation, ...botActions, ...navigation];

  return commandList.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}
