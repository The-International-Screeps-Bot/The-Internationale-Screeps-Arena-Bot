import { Creep } from 'game/prototypes'
import { creepManager } from './creepManager'
import { spawnManager } from './spawnManager'

declare module 'game/prototypes' {

    interface Creep {
        role: string
    }
}

export function loop() {

    spawnManager()

    creepManager()
}
