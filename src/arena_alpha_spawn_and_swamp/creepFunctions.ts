import { findClosestByRange, getDirection, getObjectById, getObjectsByPrototype, getRange, getTerrainAt } from "game"
import { ATTACK, BodyPartConstant, HEAL, HEAL_POWER, MOVE, OK, RANGED_ATTACK, RANGED_ATTACK_POWER, TERRAIN_WALL } from "game/constants"
import { CostMatrix, PathStep, searchPath } from "game/path-finder"
import { Creep, OwnedStructure, StructureSpawn } from "game/prototypes"
import { Visual } from "game/visual"
import { colors } from "./constants"
import { findEnemyAttackers, findEnemySpawns, findPositionsInsideRect, findSquadCenter, generateAttackerCM } from "./generalFuncs"

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

Creep.prototype.attackEnemyAttackers = function() {

    const creep = this

    const enemyAttackers = (findEnemyAttackers() as (Creep | StructureSpawn)[]).concat(findEnemySpawns())

    if (!enemyAttackers.length) return false

    const enemyAttacker = findClosestByRange(creep, enemyAttackers)
/* 
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

        if (rangeBetween <= 4 && rangeBetween > highestRange) highestRange = rangeBetween
    }
    highestRange = 1

    const cm = generateAttackerCM().clone(),

    creeps = getObjectsByPrototype(Creep).filter(anyCreep => anyCreep.id != creep.id)
    for (const creepAlt of creeps) cm.set(creepAlt.x, creepAlt.y, 255)
 */

    creep.travel({
        goal: { pos: enemyAttacker, range: 0 },
        rangedAttacker: true,
        swampCost: 0,
    })

    /* new Visual().text(cm.get(creep.x, creep.y).toString(), creep, { font: 0.4 })

    let path: PathStep[]

    if (flee) {

        highestRange = 20

        path = searchPath(creep, { pos: enemyAttacker, range: highestRange }, {
            costMatrix: cm,
            flee,
            swampCost: 0,
        }).path

        new Visual().line(creep, enemyAttacker, { opacity: 0.2, color: colors.lightBlue })
    }
    else {

        path = searchPath(creep, { pos: enemyAttacker, range: highestRange }, {
            costMatrix: cm,
            swampCost: 0
        }).path

        new Visual().line(creep, enemyAttacker, { opacity: 0.2, color: colors.lightBlue })
    }
    
    if (!path.length) return false

    new Visual().poly(path, { opacity: 0.2, stroke: colors.purple })

    creep.moveToPos(path[0], flee) */

    if (getRange(creep, enemyAttacker) == 1) {

        creep.rangedMassAttack()
        return true
    }

    if (getRange(creep, enemyAttacker) > 3) {

        creep.rangedMassAttack()
        return true
    }

    creep.rangedAttack(enemyAttacker)
    return true
}

Creep.prototype.attackEnemySpawns = function() {

    const creep = this

    // See if there is an enemy spawn, informing false if there isn't

    const enemySpawn = findClosestByRange(creep, findEnemySpawns())
    if (!enemySpawn) return false

    // Otherwise if in range 1 to the spawn

    if (getRange(creep, enemySpawn) == 1) {

        creep.rangedMassAttack()
        return true
    }

    creep.travel({
        goal: { pos: enemySpawn, range: 1 },
        rangedAttacker: true,
        swampCost: 0,
    })

    if (getRange(creep, enemySpawn) > 3) {

        creep.rangedMassAttack()

        return true
    }
    
    creep.rangedAttack(enemySpawn)

    return true
}

Creep.prototype.advancedHeal = function() {

    const creep = this

    // If the creep is below max hits

    if (creep.hits < creep.hitsMax) {

        // Heal the creep

        creep.heal(creep)
        return
    }
    
    const nearbyMyCreeps = global.creepsOfRole.rangedAttacker.filter(nearbyCreep => nearbyCreep.my && getRange(creep, nearbyCreep) <= 3)

    for (const nearbyCreep of nearbyMyCreeps) {

        // If the nearbyCreep is not below max hits

        if (nearbyCreep.hits == nearbyCreep.hitsMax) continue

        // If range 1 heal didn't work, try range 3 heal. Stop

        if (creep.heal(nearbyCreep) != OK) creep.rangedHeal(nearbyCreep)
        return
    }

    // Otherwise pre-heal itself

    creep.heal(creep)
}

Creep.prototype.travel = function(opts) {

    const creep = this,

    costMatrix = new CostMatrix()
    
    if (opts.rangedAttacker) {

        for (const structure of getObjectsByPrototype(OwnedStructure)) {

            costMatrix.set(structure.x, structure.y, 255)
        }
    
        //
    
        const attackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(ATTACK)))
    
        let range = 1,
        highestRange = 1
    
        for (const enemyCreep of attackEnemyCreeps) {

            range = 1

            const rangeBetween = getRange(creep, enemyCreep)

            if (rangeBetween <= 3) {

                if (!enemyCreep.getActiveParts(MOVE)) range = 1

                else range = 2
            }

            if (range > highestRange) highestRange = range + 1
    
            const positions = findPositionsInsideRect(enemyCreep.x - range, enemyCreep.y - range, enemyCreep.x + range, enemyCreep.y + range)
    
            for (const pos of positions) {
    
                if (getTerrainAt(pos) == TERRAIN_WALL) continue
    
                costMatrix.set(pos.x, pos.y, 254)
            }
    
            /* new Visual().rect({ x: enemyCreep.x - 0.5 - range, y: enemyCreep.y - 0.5 - range }, range * 2  + 1, range * 2  + 1, { fill: colors.yellow, opacity: 0.2 }) */
        }
    
        const rangedAttackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(RANGED_ATTACK)))
    
        for (const enemyCreep of rangedAttackEnemyCreeps) {

            if (creep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + creep.findPartsAmount(HEAL) * HEAL_POWER > enemyCreep.findPartsAmount(RANGED_ATTACK) * RANGED_ATTACK_POWER + enemyCreep.findPartsAmount(HEAL) * HEAL_POWER) continue

            range = 2

            if (getRange(creep, enemyCreep) <= 3 && range > highestRange) highestRange = range + 1
    
            const positions = findPositionsInsideRect(enemyCreep.x - range, enemyCreep.y - range, enemyCreep.x + range, enemyCreep.y + range)
    
            for (const pos of positions) {
    
                if (getTerrainAt(pos) == TERRAIN_WALL) continue
    
                costMatrix.set(pos.x, pos.y, 254)
            }
    
            /* new Visual().rect({ x: enemyCreep.x - 0.5 - range, y: enemyCreep.y - 0.5 - range }, range * 2 + 1 , range * 2 + 1, { fill: colors.yellow, opacity: 0.1 }) */
        }

        const allCreeps = getObjectsByPrototype(Creep).filter(anyCreep => anyCreep.id != creep.id)
        for (const creepAlt of allCreeps) costMatrix.set(creepAlt.x, creepAlt.y, 255)

        opts.goal.range = highestRange

        const squadLeadersInRange = global.creepsOfRole.rangedAttacker.filter(rangedAttacker => getRange(creep, rangedAttacker) <= 4).length,
        enemyAttackersInRange = attackEnemyCreeps.filter(enemyAttacker => getRange(creep, enemyAttacker) <= 2).length + rangedAttackEnemyCreeps.filter(enemyAttacker => getRange(creep, enemyAttacker) <= 4).length
    
        opts.flee = costMatrix.get(creep.x, creep.y) >= 254 || enemyAttackersInRange > squadLeadersInRange
        if (opts.flee) opts.goal.range = 20
    }

    new Visual().line(creep, opts.goal.pos, { opacity: 0.2, color: colors.lightBlue })

    const path = searchPath(creep, opts.goal, {
        costMatrix,
        flee: opts.flee,
        plainCost: opts.plainCost,
        swampCost: opts.swampCost
    }).path

    if (opts.flee) new Visual().text('F', creep, { font: 0.5 })
    new Visual().poly(path, { opacity: 0.2, stroke: colors.purple })

    if (!path.length) return

    creep.move(getDirection(path[0].x - creep.x, path[0].y - creep.y))
}