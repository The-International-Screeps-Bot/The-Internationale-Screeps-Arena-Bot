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

        const creeps = global.creepsOfRole[role]

        for (const creep of creeps) {

            roleHandlers[creep.role](creep)
        }
    }
}