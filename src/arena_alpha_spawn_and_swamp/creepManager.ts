import { getObjectsByPrototype } from "game"
import { Creep, StructureSpawn } from "game/prototypes"
import { spawnAttacker } from "./spawnAttacker"

const roleHandlers: {[key: string]: Function} = {
    spawnAttacker
}

export function creepManager() {

    const enemySpawn = getObjectsByPrototype(StructureSpawn).find(spawn => !spawn.my),
    allCreeps = getObjectsByPrototype(Creep)

    for (const creepName in allCreeps) {

        const creep = allCreeps[creepName]

        if (!creep.my) continue

        roleHandlers[creep.role](creep)
    }
}