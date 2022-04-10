import { findClosestByRange, getObjectsByPrototype, getRange } from "game"
import { ATTACK, ERR_NOT_IN_RANGE, HEAL, RANGED_ATTACK, WORK } from "game/constants"
import { Creep, StructureSpawn } from "game/prototypes"
import './creepFunctions'
import { findEnemyAttackers } from "./generalFuncs"

export function rangedAttacker(creep: Creep) {

    const enemyAttackers = findEnemyAttackers()

    if (enemyAttackers.length) {

        creep.heal(creep)

        const enemyAttacker = findClosestByRange(creep, enemyAttackers)

        creep.moveAsAttacker(enemyAttacker)

        if (getRange(creep, enemyAttacker) == 1) {

            creep.rangedMassAttack()
            return
        }

        if (getRange(creep, enemyAttacker) > 3) {

            creep.rangedMassAttack()
        }

        creep.rangedAttack(enemyAttacker)
        return
    }

    if (creep.hits < creep.hitsMax) creep.heal(creep)

    const enemySpawn = getObjectsByPrototype(StructureSpawn).find(spawn => !spawn.my)

    if (!enemySpawn) return

    if (getRange(creep, enemySpawn) == 1) {

        creep.rangedMassAttack()
        return
    }

    if (getRange(creep, enemySpawn) > 3) {

        creep.rangedMassAttack()
        creep.moveTo(enemySpawn)
        return
    }
    
    creep.rangedAttack(enemySpawn)
    creep.moveTo(enemySpawn)
}