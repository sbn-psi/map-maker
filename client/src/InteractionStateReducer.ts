import { InteractionState, Zone } from './AppState'

type Action =
    { type: 'CLICKED_ZONE', zone: Zone | null }
    | { type: 'SELECTED_CORNER', corner: 'top' | 'left' | 'bottom' }
    | { type: 'PLACED_CORNER', x: number, y: number, corner: 'top' | 'left' | 'bottom' }
    | { type: 'MOUSE_OVER_ZONE', x: number, y: number }

const cornerOrder = ['top', 'left', 'bottom']

export const stateReducer = (state: InteractionState, action: Action) => {
    switch (action.type) {
        case "CLICKED_ZONE":
            if(state.selectedZone === action.zone) {
                return {
                    ...state,
                    selectedZone: null,
                }
            } else {
                let newState = {
                    ...state,
                    selectedZone: action.zone,
                }
                if(!action.zone?.top) {
                    newState.selectedCorner = 'top'
                }
                return newState
            }
        case "SELECTED_CORNER":
            return {
                ...state,
                selectedCorner: action.corner
            };
        case "PLACED_CORNER":
            state.selectedZone![action.corner] = { x: action.x, y: action.y }
            let currentCorner = cornerOrder.indexOf(action.corner)
            let nextCorner = currentCorner + 1 <= cornerOrder.length ? cornerOrder[currentCorner + 1] : null
            return {
                ...state,
                selectedCorner: nextCorner
            };
        case "MOUSE_OVER_ZONE":
            return {
                ...state,
                mousePosition: { x: action.x, y: action.y },
            };
            
    }
};