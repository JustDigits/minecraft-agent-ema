import { actions } from "./library/actions.js";
import { debugging } from "./dev/debugging.js";
import { documentation } from "./library/documentation.js";
import { navigation } from "./library/navigation.js";
import { whitelist } from "./utils/whitelist.js";

export const COMMAND_MAP = createCommandMap();

function createCommandMap() {
  const commandList = [
    ...actions,
    ...debugging,
    ...documentation,
    ...navigation,
    ...whitelist,
  ];

  return commandList.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}
