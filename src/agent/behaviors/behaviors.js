import { HuntingBehavior } from "./hunting.js";

export class Behaviors {
  constructor(agent) {
    this.agent = agent;
    this.map = {
      hunting: new HuntingBehavior(this.agent),
    };
  }

  stop() {
    this.map.hunting.stop();
  }
}
