import { Creep } from "game/prototypes"
import './creepFunctions'

export function rangedAttacker(creep: Creep) {

    creep.advancedHeal()
    
    if (creep.attackEnemyAttackers()) return

    /* if (creep.attackEnemySpawns()) return */
}