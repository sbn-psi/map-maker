export class AppState {
    readonly workflow: 'initial' | 'overviewUpload' | 'zoneUpload' | 'zoneMapping' | 'complete' = 'initial'
    readonly canvas: 'default' | 'corner1' | 'corner2' = 'default'
    readonly currentZone: Zone | null = null
    readonly set: (prop: 'workflow' | 'canvas' | 'currentZone', val: any) => AppState = (prop, val) => {
        
        let obj = Object.assign({}, this)
        Object.assign(obj, { [prop]: val})
        return obj
    }
}

type Zone = {
    name: string
    url: string
}

type StatePasser = {
    state: AppState,
    setState: (state: AppState) => void
}

export type {Zone, StatePasser}
