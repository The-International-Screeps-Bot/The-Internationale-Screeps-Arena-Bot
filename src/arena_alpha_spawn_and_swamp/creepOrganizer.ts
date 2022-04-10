import { getObjectsByPrototype } from "game"
import { Creep } from "game/prototypes"
import { roles } from "./constants"

export function creepOrganizer() {

    for (const role of roles) global.creepsOfRole[role] = []
    
    const allCreeps = getObjectsByPrototype(Creep)

    for (const creepName in allCreeps) {

        const creep = allCreeps[creepName]

        if (!creep.my) continue

        global.creepsOfRole[creep.role].push(creep)
    }
}