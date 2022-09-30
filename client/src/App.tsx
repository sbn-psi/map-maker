import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './components/OverviewUpload';
import {Box, Card, CardMedia, CardActionArea, Typography, CardContent, Grid, Button} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import {AppState, Zone } from './AppState';
import { AppStateProvider, useAppState, useAppStateDispatch } from './AppStateContext';
import StatusBar from './components/StatusBar';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';

const statusHeight = 30

function App() {

  return (
    <AppStateProvider>
      <AppCanvasProvider>
        <Box component="main" sx={{ bgcolor: 'background.default'}}>
          <Box sx={{height: `${statusHeight}px`, borderBottom: '1px solid darkgrey'}}><StatusBar/></Box>
          <Grid container sx={{height: `calc(100vh - ${statusHeight}px)`}}>
            <Grid item xs={9} sx={{ height: '100%'}} >
              <OverviewContents sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
            </Grid>
            <Grid item xs={3} sx={{ height: '100%', overflowY: 'auto', borderLeft: '1px solid darkgrey'}} >
              <SidebarContents/>
            </Grid>

          </Grid>
        </Box>
      </AppCanvasProvider>
    </AppStateProvider>
  )
}

function OverviewContents({sx}: {sx: any}) {
  const state:AppState = useAppState()

  return state.overview ? <Overview sx={sx}/> : <OverviewUpload sx={sx}/>
}

function SidebarContents() {
  let [zones, setZones] = useState<Array<Zone>>([])
  const state:AppState = useAppState()
  const dispatchState = useAppStateDispatch()

  zones = zones.sort((a, b) => (a.corner1 && a.corner2) ? 1 : -1)
  const showButton = zones.length > 0 && zones.every((zone) => zone.corner1 && zone.corner2)

  return <Box sx={{p: 1}}>
    {showButton && <Button sx={{my: 1, width: '100%'}} variant="contained">Save and Exit</Button>}
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {
        dispatchState({type: 'CLICKED_ZONE', zone: zone})
      }} 
      active={state.currentZone ? zones.indexOf(state.currentZone) === index : false} 
      completed={state.mappedZones.includes(zone)}/>)}
      
    <h1>Upload sample zone images</h1>
    { 
      <ImageUploader handler={uploads => {
        setZones([...zones, ...uploads])
        dispatchState({type: 'UPLOADED_ZONES', zones: uploads})
      }} cardinality="multiple"/>
    }
  </Box>
}

function SampleZone({zone, clickHandler, active, completed}: {zone: Zone, clickHandler: () => void, active: boolean, completed: boolean}) {
  let color = active ? 'lightblue' : completed ? 'lightgreen' : 'white'
  return <Card sx={{backgroundColor: color, margin: '5px'}}>
    <CardActionArea onClick={completed ? undefined : clickHandler}>
      <CardMedia image={zone.url} sx={{height: 100}}/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {zone.name}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {completed ? 
            <span style={{color: 'green'}}>Completed</span> :
            `Click to ${active ? 'unselect' : 'select'}`
          }
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
  
}

export default App;
