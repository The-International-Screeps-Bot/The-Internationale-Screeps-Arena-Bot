import { getObjectsByPrototype } from "game"
import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK } from "game/constants"
import { StructureSpawn } from "game/prototypes"

export function spawnManager() {

    const allSpawns = getObjectsByPrototype(StructureSpawn)

    for (const spawnName in allSpawns) {

        const spawn = allSpawns[spawnName]

        if (!spawn.my) continue

        if (global.creepCount.hauler < 3) {

            const spawnResult = spawn.spawnCreep([CARRY, MOVE, CARRY, MOVE])
            if (spawnResult.error) continue
    
            const spawningCreep = spawnResult.object
    
            spawningCreep.role = 'hauler'
            continue
        }

        const spawnResult = spawn.spawnCreep([RANGED_ATTACK, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, MOVE, HEAL, MOVE, MOVE])
        if (spawnResult.error) continue

        const spawningCreep = spawnResult.object

        spawningCreep.role = 'rangedAttacker'
    }
}