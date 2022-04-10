import { getCpuTime } from 'game'
import { BodyPartConstant } from 'game/constants'
import { CostMatrix, PathStep } from 'game/path-finder'
import { Creep, StructureSpawn } from 'game/prototypes'
import { roles } from './constants'
import { creepManager } from './creepManager'
import { spawnManager } from './spawnManager'

declare module 'game/prototypes' {

    interface Creep {
        role: string

        getActiveParts(type: BodyPartConstant): boolean

        findPartsAmount(type: BodyPartConstant): number

        moveAsAttacker(targetPos: RoomPosition): boolean
    }
}

declare global {
    module NodeJS {
        interface Global {

            creepCount: {[key: string]: number}

            attackerCM: CostMatrix
        
            enemyAttackers: Creep[]

            enemySpawns: StructureSpawn[]
        }
    }   
}

export function loop() {

    global.creepCount = {}
    delete global.attackerCM
    delete global.enemyAttackers
    delete global.enemySpawns

    creepManager()

    spawnManager()

    console.log(getCpuTime())
}
