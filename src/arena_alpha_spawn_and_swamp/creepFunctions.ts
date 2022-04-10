import { getDirection, getObjectsByPrototype, getRange } from "game"
import { ATTACK, BodyPartConstant, HEAL, HEAL_POWER, MOVE, OK, RANGED_ATTACK, RANGED_ATTACK_POWER } from "game/constants"
import { CostMatrix, searchPath } from "game/path-finder"
import { Creep } from "game/prototypes"
import { circle, poly, rect } from "game/visual"
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

    cm = generateAttackerCM(),

    attackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(ATTACK)))

    let range = 1

    for (const enemyCreep of attackEnemyCreeps) {

        range = enemyCreep.getActiveParts(MOVE) ? 3 : 2
    }

    const rangedAttackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(RANGED_ATTACK)))

    for (const enemyCreep of rangedAttackEnemyCreeps) {

        if (creep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + creep.findPartsAmount(HEAL) * HEAL_POWER > enemyCreep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + enemyCreep.findPartsAmount(HEAL) * HEAL_POWER) continue

        range = 3
    }

    const flee = getRange(creep, targetPos) < range ? true : false
    if (flee) range = 20

    const path = searchPath(creep, {pos: targetPos, range }, {
        costMatrix: cm,
        flee
    }).path
    
    if (!path.length) return false

    /* poly(path, { opacity: 0.4, stroke: colors.purple }) */

    return creep.moveTo(path[0]) == OK
}