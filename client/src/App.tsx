import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './components/OverviewUpload';
import {Box, Card, CardMedia, CardActionArea, Typography, CardContent, Grid, Button} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import {AppState, InteractionState, Zone } from './AppState';
import { AppStateProvider, useAppState, useAppStateDispatch } from './AppStateContext';
import StatusBar from './components/StatusBar';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';
import { InteractionStateProvider, useInteractionState, useInteractionStateDispatch } from './InteractionStateContext';

const statusHeight = 30

function App() {

  return (
    <AppStateProvider>
      <InteractionStateProvider>
        <AppCanvasProvider>
          <Box component="main" sx={{ bgcolor: 'background.default'}}>
            <Box sx={{height: `${statusHeight}px`, borderBottom: '1px solid darkgrey'}}><StatusBar/></Box>
            <Grid container sx={{height: `calc(100vh - ${statusHeight}px)`}}>
              <Grid item xs={3} sx={{ height: '100%', overflowY: 'auto', borderLeft: '1px solid darkgrey'}} >
                <SidebarContents/>
              </Grid>
              <Grid item xs={9} sx={{ height: '100%'}} >
                <OverviewContents sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
              </Grid>
            </Grid>
          </Box>
        </AppCanvasProvider>
      </InteractionStateProvider>
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
  const interactions:InteractionState = useInteractionState()
  const dispatchState = useAppStateDispatch()
  const dispatchInteraction = useInteractionStateDispatch()

  zones = zones.sort((a, b) => a.isComplete() ? 1 : -1)
  const showButton = zones.length > 0 && (state.mappedZones.length == zones.length)

  return <Box sx={{p: 1}}>
    {showButton && <Button sx={{my: 1, width: '100%'}} variant="contained" onClick={() => download(state)}>Save and Download</Button>}
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {
        dispatchInteraction({type: 'CLICKED_ZONE', zone: zone})
      }} 
      active={interactions.selectedZone ? zones.indexOf(interactions.selectedZone) === index : false} 
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
    <CardActionArea onClick={clickHandler}>
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

function download(state: AppState) {
  const saveState = {overview: state.overview, zones: state.mappedZones }
  const data = new Blob([JSON.stringify(saveState, null, '\t')], {type: 'application/json'});
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'data.json');
  document.body.appendChild(link);
  link.click();
}