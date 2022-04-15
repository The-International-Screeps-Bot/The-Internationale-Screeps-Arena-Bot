import { getObjectsByPrototype } from "game"
import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK } from "game/constants"
import { StructureSpawn } from "game/prototypes"

export function spawnManager() {

    const allSpawns = getObjectsByPrototype(StructureSpawn)

    for (const spawnName in allSpawns) {

        const spawn = allSpawns[spawnName]

        if (!spawn.my) continue

        if (global.creepsOfRole.hauler.length < 4) {

            const spawnResult = spawn.spawnCreep([CARRY, MOVE])
            if (spawnResult.error) continue
    
            const creep = spawnResult.object
    
            creep.role = 'hauler'
            continue
        }
        
        if (global.creepsOfRole.rangedAttacker.length < Infinity) {

            const spawnResult = spawn.spawnCreep([RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL])
            if (spawnResult.error) continue

            const creep = spawnResult.object
            
            creep.role = 'rangedAttacker'
            continue
        }
    }
}