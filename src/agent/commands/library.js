import { actions } from "./library/actions.js";
import { auth } from "./library/auth.js";
import { debugging } from "./library/debugging.js";
import { documentation } from "./library/documentation.js";
import { navigation } from "./library/navigation.js";

export const COMMAND_MAP = createCommandMap();

function createCommandMap() {
  const commandList = [
    ...actions,
    ...auth,
    ...debugging,
    ...documentation,
    ...navigation,
  ];

  return commandList.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}
