interface Zone {
    id: number
    name: string
    url: string
    topX: number
    topY: number
    leftX: number
    leftY: number
    bottomX: number
    bottomY: number
    rightX: number
    rightY: number
}

interface Sample {
    id: number
    zoneIds: number[]
}

export type {Zone, Sample}