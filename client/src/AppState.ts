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

export class Zone {
    name: string
    url: string
    top?: { x: number, y: number }
    left?: { x: number, y: number }
    bottom?: { x: number, y: number }
    height?: number
    naturalHeight?: number
    naturalWidth?: number
    isComplete: () => boolean = () => {
        return !!this.top && !!this.left && !!(this.bottom || this.height)
    }
    constructor(name: string, url: string) {
        this.name = name
        this.url = url
    }
    static fromJson(json: any): Zone {
        let zone = new Zone(json.name, json.url)
        zone.top = json.top
        zone.left = json.left
        zone.bottom = json.bottom
        zone.height = json.height
        zone.naturalHeight = json.naturalHeight
        zone.naturalWidth = json.naturalWidth
        return zone
    }
}

export enum Corners
{
    Top = 'top',
    Left = 'left',
    Bottom = 'bottom'
}