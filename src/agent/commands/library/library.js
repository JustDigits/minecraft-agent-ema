import { navigation } from "./navigation.js";
import { botActions } from "./bot-actions.js";

export const COMMAND_MAP = createCommandMap();

function createCommandMap() {
  const commandList = [...botActions, ...navigation];

  return commandList.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}
