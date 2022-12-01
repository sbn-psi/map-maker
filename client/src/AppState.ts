export class AppState {
    readonly workflow: 'overviewUpload' | 'zoneUpload' | 'zoneMapping' | 'complete' = 'overviewUpload'
    readonly overview: Zone | null = null
    readonly mappedZones: Zone[] = []
    readonly unmappedZones: Zone[] = []
}

export class InteractionState {
    readonly mousePosition: { x: number, y: number } | null = null
    readonly selectedZone: Zone | null = null
    readonly selectedCorner: 'top' | 'left' | 'bottom' | null = null
}

export type Zone = {
    name: string
    url: string
    top: { x: number, y: number } | null
    left: { x: number, y: number } | null
    bottom: { x: number, y: number } | null
    // right: { x: number, y: number } | null
}

export enum Corners
{
    Top = 'top',
    Left = 'left',
    Bottom = 'bottom'
}