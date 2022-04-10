import { getCpuTime } from 'game'
import { BodyPartConstant } from 'game/constants'
import { CostMatrix, PathStep } from 'game/path-finder'
import { Creep, RoomPosition, StructureSpawn } from 'game/prototypes'
import { roles } from './constants'
import { creepManager } from './creepManager'
import { creepOrganizer } from './creepOrganizer'
import { spawnManager } from './spawnManager'

declare module 'game/prototypes' {

    interface Creep {
        role: string

        getActiveParts(type: BodyPartConstant): boolean

        findPartsAmount(type: BodyPartConstant): number

        moveAsAttacker(targetPos: RoomPosition): boolean

        healAsAttacker(enemyAttackersExist?: boolean): void

        attackAsAttacker(): void
    }
}

declare global {
    module NodeJS {
        interface Global {

            creepsOfRole: {[key: string]: Creep[]}

            attackerCM: CostMatrix
        
            enemyAttackers: Creep[]

            enemySpawns: StructureSpawn[]

            squadCenter: RoomPosition
        }
    }   
}

export function loop() {

    global.creepsOfRole = {}
    delete global.attackerCM
    delete global.enemyAttackers
    delete global.enemySpawns
    delete global.squadCenter

    creepOrganizer()

    creepManager()

    spawnManager()

    console.log('CPU: ' + getCpuTime())
}
