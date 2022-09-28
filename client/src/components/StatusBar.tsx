import { Typography } from "@mui/material"
import { useAppState } from "../AppStateContext"


export default function StatusBar() {
    let state = useAppState()

    let caption = ''
    if (state.currentZone) {
        if (state.canvas === 'corner1') {
            caption = 'Place the top left corner'
        } else {
            caption = 'Place the bottom right corner'
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