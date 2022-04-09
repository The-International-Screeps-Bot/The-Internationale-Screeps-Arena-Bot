import { getObjectsByPrototype } from "game"
import { ERR_NOT_IN_RANGE } from "game/constants"
import { Creep, StructureSpawn } from "game/prototypes"

export function spawnAttacker(creep: Creep) {

    const enemySpawn = getObjectsByPrototype(StructureSpawn).find(spawn => !spawn.my)

    if (!enemySpawn) return

    if (creep.attack(enemySpawn) != ERR_NOT_IN_RANGE) return
    creep.moveTo(enemySpawn)
}