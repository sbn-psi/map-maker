export class AppState {
    readonly workflow: 'overviewUpload' | 'zoneUpload' | 'zoneMapping' | 'complete' = 'overviewUpload'
    readonly canvas: 'default' | 'corner1' | 'corner2' = 'default'
    readonly currentZone: Zone | null = null
    readonly overview: Zone | null = null
    readonly mappedZones: Zone[] = []
    readonly unmappedZones: Zone[] = []
    readonly mousePosition: { x: number, y: number } | null = null
}

export type Zone = {
    name: string
    url: string
    corner1: { x: number, y: number } | null
    corner2: { x: number, y: number } | null
}