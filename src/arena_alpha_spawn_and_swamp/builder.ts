import { findClosestByRange, getObjectsByPrototype } from "game"
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants"
import { ConstructionSite, Creep, StructureContainer, StructureSpawn } from "game/prototypes"

export function hauler(creep: Creep) {

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

        const sites = getObjectsByPrototype(ConstructionSite).filter(site => site.my)
        if(!sites.length) return

        const closestSite = findClosestByRange(creep, sites)

        if (creep.build(closestSite) != ERR_NOT_IN_RANGE) return

        creep.moveTo(closestSite)
        return
    }

    const containers = getObjectsByPrototype(StructureContainer).filter(container => container.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
    if (!containers.length) return

    const closestContainer = findClosestByRange(creep, containers)

    if (creep.withdraw(closestContainer, RESOURCE_ENERGY) != ERR_NOT_IN_RANGE) return
    creep.moveTo(closestContainer)
}