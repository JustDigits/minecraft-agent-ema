import { readFileSync } from "fs";
export default JSON.parse(readFileSync("./settings.json", "utf-8"));