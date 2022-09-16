import { AppState, Zone } from './AppState'

type Action =
    { type: 'UPLOADED_OVERVIEW' }
    | { type: 'UPLOADED_ZONES' }
    | { type: 'CLICKED_ZONE', zone: Zone | null }
    | { type: 'CLICKED_CORNER' }
    | { type: 'COMPLETED_ZONE' }

export const stateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case "UPLOADED_OVERVIEW":
            return {
                ...state,
                workflow: 'zoneUpload',
            };
        case "UPLOADED_ZONES":
            return {
                ...state,
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
            return {
                ...state,
                canvas: 'corner2',
            };
        case "COMPLETED_ZONE":
            return {
                ...state,
                currentZone: null,
                canvas: 'default',
            };
    }
};