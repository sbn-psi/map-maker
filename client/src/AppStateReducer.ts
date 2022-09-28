import { AppState, Zone } from './AppState'

type Action =
    { type: 'UPLOADED_OVERVIEW', overview: Zone }
    | { type: 'UPLOADED_ZONES', zones : Zone[] }
    | { type: 'CLICKED_ZONE', zone: Zone | null }
    | { type: 'CLICKED_CORNER', x: number, y: number }
    | { type: 'COMPLETED_ZONE', x: number, y: number }
    | { type: 'MOUSE_OVER_ZONE', x: number, y: number }

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
        case "CLICKED_ZONE":
            if(state.currentZone === action.zone) {
                return {
                    ...state,
                    currentZone: null,
                    canvas: 'default',
                }
            } else {
                return {
                    ...state,
                    currentZone: action.zone,
                    canvas: 'corner1'
                };
            }
        case "CLICKED_CORNER":
            state.currentZone!.corner1 = { x: action.x, y: action.y }
            return {
                ...state,
                canvas: 'corner2',
            };
        case "COMPLETED_ZONE":
            state.currentZone!.corner2 = { x: action.x, y: action.y }
            return {
                ...state,
                mappedZones: [...state.mappedZones, state.currentZone!],
                currentZone: null,
                canvas: 'default',
            };
        case "MOUSE_OVER_ZONE":
            return {
                ...state,
                mousePosition: { x: action.x, y: action.y },
            };
            
    }
};