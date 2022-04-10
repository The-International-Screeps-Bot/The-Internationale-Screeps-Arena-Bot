import { getObjectsByPrototype, getRange, getTerrainAt } from "game"
import { ATTACK, HEAL, MOVE, RANGED_ATTACK, TERRAIN_WALL, WORK } from "game/constants"
import { CostMatrix } from "game/path-finder"
import { Creep, RoomPosition, StructureSpawn } from "game/prototypes"
import { rect } from "game/visual"
import { colors } from "./constants"

/**
 * Takes a rectange and returns the positions inside of it in an array
 */
 export function findPositionsInsideRect(x1: number, y1: number, x2: number, y2: number) {

    const positions: RoomPosition[] = []

    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {

            // Otherwise ass the x and y to positions

            positions.push({x, y})
        }
    }

    return positions
}

export function generateAttackerCM() {
    
    if (global.attackerCM) return global.attackerCM
    
    global.attackerCM = new CostMatrix()

    const attackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(ATTACK)))

    let range

    for (const enemyCreep of attackEnemyCreeps) {

        range = enemyCreep.getActiveParts(MOVE) ? 3 : 2

        const positions = findPositionsInsideRect(enemyCreep.x - (range - 1), enemyCreep.y - (range - 1), enemyCreep.x + (range - 1), enemyCreep.y + (range - 1))

        for (const pos of positions) {

            if (getTerrainAt(pos) == TERRAIN_WALL) continue

            global.attackerCM.set(pos.x, pos.y, 244)
        }

        rect({ x: enemyCreep.x - 1 -range * 0.5, y: enemyCreep.y - 1 - range * 0.5 }, range * 2, range * 2, { fill: colors.yellow, opacity: 0.2 })
    }

    const rangedAttackEnemyCreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my && (creep.getActiveParts(RANGED_ATTACK)))

    for (const enemyCreep of rangedAttackEnemyCreeps) {

        range = 3

        const positions = findPositionsInsideRect(enemyCreep.x - 2, enemyCreep.y - 2, enemyCreep.x + 2, enemyCreep.y + 2)

        for (const pos of positions) {

            if (getTerrainAt(pos) == TERRAIN_WALL) continue

            global.attackerCM.set(pos.x, pos.y, 244)
        }

        rect({ x: enemyCreep.x - range * 0.5, y: enemyCreep.y - range * 0.5 }, range * 2 , range * 2, { fill: colors.yellow, opacity: 0.2 })
    }

    const creeps = getObjectsByPrototype(Creep)
    for (const creep of creeps) global.attackerCM.set(creep.x, creep.y, 255)

    return global.attackerCM
}

export function findEnemySpawns() {

    if (global.enemySpawns) return global.enemySpawns

    return global.enemySpawns = getObjectsByPrototype(StructureSpawn).filter(spawn => !spawn.my)
}

export function findEnemyAttackers() {

    if (global.enemyAttackers) return global.enemyAttackers

    return global.enemyAttackers = getObjectsByPrototype(Creep).filter(enemyCreep => !enemyCreep.my && findEnemySpawns().filter(spawn => getRange(spawn, enemyCreep) != 0)  && (enemyCreep.getActiveParts(WORK) || enemyCreep.getActiveParts(ATTACK) || enemyCreep.getActiveParts(RANGED_ATTACK) || enemyCreep.getActiveParts(HEAL)))
}

export function findSquadCenter() {

    if (global.squadCenter) return global.squadCenter

    let x = 0,
    y = 0
    
    for (const creep of global.creepsOfRole.rangedAttacker) {

        x += creep.x
        y += creep.y
    }

    const rangedAttackerCount = global.creepsOfRole.rangedAttacker.length
    
    return global.squadCenter = {
        x: Math.floor(x / rangedAttackerCount),
        y: Math.floor(y / rangedAttackerCount)
    }
}

/**
 * Finds a position equally between two positions
 */
export function findAvgBetweenPosotions(x1: number, y1: number, x2: number, y2: number) {

    // Inform the rounded average of the two positions

    return {
        x: Math.floor((x1 + x2) / 2),
        y: Math.floor((y1 + y2) / 2),
    }
}