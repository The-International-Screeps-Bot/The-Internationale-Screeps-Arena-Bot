import { getDirection, getObjectsByPrototype, getRange } from "game"
import { ATTACK, BodyPartConstant, HEAL, HEAL_POWER, MOVE, OK, RANGED_ATTACK, RANGED_ATTACK_POWER } from "game/constants"
import { CostMatrix, searchPath } from "game/path-finder"
import { Creep } from "game/prototypes"
import { circle, poly, rect, text } from "game/visual"
import { colors } from "./constants"
import { findPositionsInsideRect, generateAttackerCM } from "./generalFuncs"

Creep.prototype.getActiveParts = function(type) {

    const creep = this

    for (const part of creep.body) {

        if (part.hits > 0 && part.type == type) return true
    }

    return false
}

Creep.prototype.findPartsAmount = function(type) {

    const creep = this

    let partsAmount = 0

    for (const part of creep.body) {

        if (part.hits > 0 && part.type == type) partsAmount++
    }

    return partsAmount
}

Creep.prototype.moveAsAttacker = function(targetPos) {

    const creep = this,

    attackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(ATTACK)))

    let highestRange = 1

    for (const enemyCreep of attackEnemyCreeps) {

        const rangeBetween = getRange(creep, enemyCreep)

        if (rangeBetween <= 3) {

            if (rangeBetween > highestRange) highestRange = 3

            if (rangeBetween <= 2 && enemyCreep.getActiveParts(MOVE) && rangeBetween > highestRange) highestRange = 3 
        }
    }

    const rangedAttackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(RANGED_ATTACK)))

    for (const enemyCreep of rangedAttackEnemyCreeps) {

        if (creep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + creep.findPartsAmount(HEAL) * HEAL_POWER > enemyCreep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + enemyCreep.findPartsAmount(HEAL) * HEAL_POWER) continue

        const rangeBetween = getRange(creep, enemyCreep)

        if (rangeBetween <= 3 && rangeBetween > highestRange) highestRange = rangeBetween
    }

    const flee = getRange(creep, targetPos) < highestRange ? true : false
    if (flee) highestRange = 20

    text(highestRange.toString(), creep, { font: 0.4 })

    const path = searchPath(creep, { pos: targetPos, range: highestRange }, {
        costMatrix: generateAttackerCM(),
        flee
    }).path
    
    if (!path.length) return false

    poly(path, { opacity: 0.4, stroke: colors.purple })

    return creep.moveTo(path[0], { costMatrix: generateAttackerCM() }) == OK
}

Creep.prototype.healAsAttacker = function(enemyAttackersExist) {

    const creep = this,

    nearbyAttackers = global.creepsOfRole.rangedAttacker.filter(rangedAttacker => getRange(creep, rangedAttacker) == 1)

    for (const rangedAttacker of nearbyAttackers) {

        if (rangedAttacker.hits == rangedAttacker.hitsMax) continue

        creep.heal(rangedAttacker)
        return
    }

    if (enemyAttackersExist) creep.heal(creep)
}

Creep.prototype.attackAsAttacker = function() {

    const creep = this

    
}