import { getObjectsByPrototype } from "game"
import { ATTACK, MOVE } from "game/constants"
import { StructureSpawn } from "game/prototypes"

export function spawnManager() {

    const allSpawns = getObjectsByPrototype(StructureSpawn)

    for (const spawnName in allSpawns) {

        const spawn = allSpawns[spawnName]

        if (!spawn.my) continue

        const spawnResult = spawn.spawnCreep([ATTACK, MOVE, MOVE])
        if (spawnResult.error) continue

        const spawningCreep = spawnResult.object

        spawningCreep.role = 'spawnAttacker'
    }
}