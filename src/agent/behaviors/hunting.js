import {
  globalSettings,
  StateTransition,
  BotStateMachine,
  NestedStateMachine,
  BehaviorIdle,
  BehaviorGetClosestEntity,
  BehaviorEquipItem,
} from "mineflayer-statemachine";

let enableHuntingBehavior = false;

const landAnimals = ["pig", "cow", "sheep", "chicken", "rabbit", "mooshroom"];
// const waterAnimals = ["salmon", "cod", "tropical_fish"];
// const edibleAnimals = [...landAnimals, ...waterAnimals];
const edibleAnimals = [...landAnimals];

const isSword = (name) => name.includes("_sword");
const isAxe = (name) => name.includes("_axe");
const isPickaxe = (name) => name.includes("_pickaxe");
const isShovel = (name) => name.includes("_shovel");
const isWeapon = (name) =>
  isSword(name) || isAxe(name) || isPickaxe(name) || isShovel(name);

const rawFoods = [
  "mutton",
  "rabbit",
  "chicken",
  "beef",
  "salmon",
  "cod",
  "porkchop",
];

export class HuntingBehavior {
  constructor(agent) {
    this.agent = agent;
    this.bot = agent.bot;
    this.mcdata = agent.mcdata;
  }

  stop() {
    enableHuntingBehavior = false;
  }

  start() {
    const bot = this.bot;

    // Debug
    // globalSettings.debugMode = true;

    // Targets are the main method by which information is passed between states.
    // The target object is a single object that is passed into the constructor of all required behaviors.
    const targets = {
      item: this.getBestHuntingWeaponInInventory(bot),
    };

    // States
    const enter = new BehaviorIdle(bot); // Main state
    const equipHuntingWeapon = new BehaviorEquipItem(bot, targets); // Main state
    const getClosestHuntableEntity = new BehaviorGetClosestEntity(
      bot,
      targets,
      (entity) => this.isHuntable(entity)
    );
    const huntClosestHuntableEntity = new BehaviorIdle();
    const getClosestRawFoodEntity = new BehaviorGetClosestEntity(
      bot,
      targets,
      (entity) => this.isRawFoodItem(entity)
    );
    const exit = new BehaviorIdle();

    // Transition Execution Order
    // Checks are made to transitions in the order in which they are provided to the state machine.
    // Transitions at the front of the list are executed before transitions later in the list.
    // If multiple transitions share the same parent state and all return true, the transition earlier in the list is given priority.
    const transitions = [
      new StateTransition({
        name: "getClosestHuntableEntity_to_exit",
        parent: getClosestHuntableEntity,
        child: exit,
        shouldTransition: () =>
          !enableHuntingBehavior || targets.entity === null,
        onTransition: () => bot.pvp.stop(),
      }),
      new StateTransition({
        name: "huntClosestHuntableEntity_to_exit",
        parent: huntClosestHuntableEntity,
        child: exit,
        shouldTransition: () => !enableHuntingBehavior,
        onTransition: () => bot.pvp.stop(),
      }),
      new StateTransition({
        name: "exit_to_enter",
        parent: exit,
        child: enter,
        shouldTransition: () => enableHuntingBehavior,
      }),
      new StateTransition({
        name: "enter_to_equipHuntingWeapon",
        parent: enter,
        child: equipHuntingWeapon, // targets.item set in object
        shouldTransition: () => true,
      }),
      new StateTransition({
        name: "equipHuntingWeapon_to_getClosestHuntableEntity",
        parent: equipHuntingWeapon,
        child: getClosestHuntableEntity, // targets.entity is set by child automatically
        shouldTransition: () => true,
      }),
      new StateTransition({
        name: "getClosestHuntableEntity_to_huntClosestHuntableEntity",
        parent: getClosestHuntableEntity,
        child: huntClosestHuntableEntity, // Hunting handled by minflayer pvp.
        shouldTransition: () =>
          bot.pvp.target === undefined && targets.entity !== null,
        onTransition: () => bot.pvp.attack(targets.entity),
      }),
      new StateTransition({
        name: "huntClosestHuntableEntity_to_getClosestRawFoodEntity",
        parent: huntClosestHuntableEntity,
        child: getClosestRawFoodEntity,
        shouldTransition: () => bot.pvp.target === undefined, // Set by mineflayer pvp when target is killed
        onTransition: () => bot.pvp.stop(),
      }),
      new StateTransition({
        name: "getClosestRawFoodEntity_to_getClosestHuntableEntity",
        parent: getClosestRawFoodEntity,
        child: getClosestHuntableEntity,
        shouldTransition: () => targets.entity !== null,
        onTransition: () => bot.pvp.attack(targets.entity), // Hack to await bot reach food
      }),
      new StateTransition({
        name: "getClosestRawFoodEntity_to_exit",
        parent: getClosestRawFoodEntity,
        child: exit,
        shouldTransition: () => targets.entity === null,
      }),
      // TODO: Transition from getClosestHuntableEntity -> wander (move and check again) when targets.entity === null
      // TODO: Transition from wander -> getClosestHuntableEntity
    ];

    const root = new NestedStateMachine(transitions, enter);
    root.name = "main";
    const stateMachine = new BotStateMachine(bot, root);
    // const webserver = new StateMachineWebserver(bot, stateMachine);
    // webserver.startServer();

    enableHuntingBehavior = true;
  }

  isHuntable(entity) {
    // For metadata @see https://wiki.vg/Entity_metadata
    // metadata[16] (for Ageable Mob and Abstract Fish entity classes): Land animal is baby or water animal is in bucket
    return edibleAnimals.includes(entity.name) && !entity.metadata[16];
  }

  getBestHuntingWeaponInInventory(bot) {
    const weapons = bot.inventory.items().filter((item) => isWeapon(item.name));

    // weapons.map((weapon) => console.log(mcdata.items[weapon.type]));

    if (weapons.length === 0) return null;
    // weapons.sort((a, b) => a.attackDamage - b.attackDamage);
    return weapons[0];
  }

  isRawFoodItem(entity) {
    const rawFoodsIds = rawFoods.map(
      (rawFood) => this.mcdata.foodsByName[rawFood].id
    );
    return rawFoodsIds.includes(entity.type);
  }
}
