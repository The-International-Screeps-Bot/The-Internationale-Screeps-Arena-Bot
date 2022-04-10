import { findClosestByRange, getObjectsByPrototype } from "game"
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants"
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes"

export function hauler(creep: Creep) {

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

        const spawn = getObjectsByPrototype(StructureSpawn).find(spawn => spawn.my)

        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

            if (creep.transfer(spawn, RESOURCE_ENERGY) != ERR_NOT_IN_RANGE) return
            creep.moveTo(spawn)
        }

        return
    }

    const containers = getObjectsByPrototype(StructureContainer).filter(container => container.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
    if (!containers.length) return

    const closestContainer = findClosestByRange(creep, containers)

    if (creep.withdraw(closestContainer, RESOURCE_ENERGY) != ERR_NOT_IN_RANGE) return
    creep.moveTo(closestContainer)
}