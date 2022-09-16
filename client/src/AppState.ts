export class AppState {
    readonly workflow: 'overviewUpload' | 'zoneUpload' | 'zoneMapping' | 'complete' = 'overviewUpload'
    readonly canvas: 'default' | 'corner1' | 'corner2' = 'default'
    readonly currentZone: Zone | null = null
}

export type Zone = {
    name: string
    url: string
}