import { Zone,Sample } from "./model.js"

export function adaptInputToModel(input: any): {zones: Zone[], samples: Sample[]} {
    try {
        const zones: Zone[] = input.zones?.map((zone: any) => ({
            id: zone.id,
            name: zone.name,
            url: zone.url,
            topX: zone.topX,
            topY: zone.topY,
            leftX: zone.leftX,
            leftY: zone.leftY,
            bottomX: zone.bottomX,
            bottomY: zone.bottomY,
            rightX: zone.rightX,
            rightY: zone.rightY,
        }))
        const samples: Sample[] = input.samples?.map((sample: any) => ({
            id: sample.id,
            zoneIds: sample.zoneIds,
        }))
        return {zones, samples}
    } catch(e: any) {
        throw new Error('Invalid input: ' + e.message)
    }
}