import { Typography } from "@mui/material"
import { AppState, InteractionState } from "../AppState"
import { useAppState } from "../AppStateContext"
import { useInteractionState } from "../InteractionStateContext"


export default function StatusBar() {
    let state:AppState = useAppState()
    let interactions:InteractionState = useInteractionState()

    let caption = ''
    if (interactions.selectedZone) {
        if (interactions.selectedCorner === 'top') {
            caption = 'Place the top-left corner of the image'
        } else if (interactions.selectedCorner === 'left') {
            caption = 'Place the top-right corner of the image' // yes, this is called left. sorry.
        } else if(interactions.selectedCorner === 'bottom') {
            caption = 'Place the bottom right corner'
        } else {
            caption = 'Click a corner to move it'
        }
    } else {
        if (state.workflow === 'overviewUpload') {
            caption = 'Upload an overview image'
        } else if (state.workflow === 'zoneUpload') {
            caption = 'Upload one or more sample zones'
        } else {
            caption = 'Select a sample zone to align'
        }
    }
    return <Typography align='center' variant="overline" component="div" sx={{ margin: 'auto' }}>
        {caption}
    </Typography>
}