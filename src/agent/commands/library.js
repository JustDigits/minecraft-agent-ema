import { debugging } from "./dev/debugging.js";
import { actions } from "./library/actions.js";
import { behaviors } from "./library/behaviors.js";
import { documentation } from "./library/documentation.js";
// import { mining } from "./library/mining.js";
import { navigation } from "./library/navigation.js";
import { whitelist } from "./utils/whitelist.js";

export const COMMAND_MAP = createCommandMap();
export const COMMAND_DOCUMENTS = createCommandDocuments();

function createCommandMap() {
  const COMMAND_LIST = [
    ...actions,
    ...behaviors,
    ...debugging,
    ...documentation,
    // ...mining,
    ...navigation,
    ...whitelist,
  ];

  return COMMAND_LIST.reduce(function (map, obj) {
    map[obj.name] = obj;
    return map;
  }, []);
}

function createCommandDocuments() {
  const documents = [];
  const ids = [];
  for (const [key, value] of Object.entries(COMMAND_MAP)) {
    documents.push(
      `${value.name}: ${value.documentation.description} Keywords: ${value.documentation.keywords}.`
    );
    ids.push(value.name);
  }

  return { documents: documents, ids: ids };
}

export function getCommandDocumentation(commandName) {
  const command = COMMAND_MAP[commandName];

  if (!command) return "Command does not exist.";
  return JSON.stringify(command.documentation);
}
