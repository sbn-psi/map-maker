export class AppState {
    readonly workflow: 'overviewUpload' | 'zoneUpload' | 'zoneMapping' | 'complete' = 'overviewUpload'
    readonly canvas: 'default' | 'corner1' | 'corner2' = 'default'
    readonly currentZone: Zone | null = null
    readonly set: (...state: StatePair[]) => AppState = (...states) => {
        let obj = Object.assign({}, this)
        for(let state of states) {
            Object.assign(obj, { [state[0]]: state[1]})
        }
        return obj
    }
}

type StatePair = [
    prop: 'workflow' | 'canvas' | 'currentZone', 
    val: any
]

type Zone = {
    name: string
    url: string
}

type StatePasser = {
    state: AppState,
    setState: (state: AppState) => void
}

export type {Zone, StatePasser}
