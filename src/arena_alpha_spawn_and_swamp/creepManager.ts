import { getObjectsByPrototype } from "game"
import { Creep, StructureSpawn } from "game/prototypes"
import { roles } from "./constants"
import { hauler } from "./hauler"
import { rangedAttacker } from "./rangedAttacker"

const roleHandlers: {[key: string]: Function} = {
    hauler,
    rangedAttacker
}

export function creepManager() {

    for (const role of roles) {

        global.creepCount[role] = 0
    }

    const allCreeps = getObjectsByPrototype(Creep)

    for (const creepName in allCreeps) {

        const creep = allCreeps[creepName]

        if (!creep.my) continue

        roleHandlers[creep.role](creep)

        global.creepCount[creep.role]++
    }
}