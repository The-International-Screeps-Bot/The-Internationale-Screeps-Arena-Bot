import { getCpuTime } from 'game'
import { BodyPartConstant } from 'game/constants'
import { CostMatrix, PathStep } from 'game/path-finder'
import { Creep, Id, RoomPosition, StructureSpawn } from 'game/prototypes'
import { creepManager } from './creepManager'
import { creepOrganizer } from './creepOrganizer'
import { spawnManager } from './spawnManager'

declare module 'game/prototypes' {

    interface TravelOpts {
        goal: { pos: RoomPosition, range: number }
        rangedAttacker?: boolean
        flee?: boolean
        avoidEnemyRanges?: boolean
        plainCost?: number
        swampCost?: number
    }

    interface Creep {

        /**
         * 
         */
        role: string

        getActiveParts(type: BodyPartConstant): boolean

        findPartsAmount(type: BodyPartConstant): number

        moveAsAttacker(targetPos: RoomPosition): boolean

        healAsAttacker(enemyAttackersExist?: boolean): void

        attackAsAttacker(): void

        attackEnemyAttackers(): boolean

        attackEnemySpawns(): boolean

        advancedHeal(): void

        travel(opts: TravelOpts): void
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

            supporterOffers: Id<Creep>[]
        }
    }   
}

global.supporterOffers = []

export function loop() {

    global.creepsOfRole = {}
    delete global.attackerCM
    delete global.enemyAttackers
    delete global.enemySpawns
    delete global.squadCenter

    creepOrganizer()

    creepManager()

    spawnManager()

    console.log('CPU: ' + (getCpuTime() / 1000000).toFixed(2) + ' / ' + 50)
}
