import { AppState, Zone } from './AppState'

type Action =
    { type: 'UPLOADED_OVERVIEW', overview: Zone }
    | { type: 'UPLOADED_ZONES', zones : Zone[] }
    | { type: 'MAPPED_ZONE', zone: Zone, x: number, y: number }

export const stateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case "UPLOADED_OVERVIEW":
            return {
                ...state,
                workflow: 'zoneUpload',
                overview: action.overview
            };
        case "UPLOADED_ZONES":
            return {
                ...state,
                unmappedZones: [state.unmappedZones, action.zones].flat(),
                workflow: 'zoneMapping',
            };
        case "MAPPED_ZONE":
            return {
                ...state,
                mappedZones: [...state.mappedZones, action.zone],
                currentZone: null,
                canvas: 'default',
            };
    }
};