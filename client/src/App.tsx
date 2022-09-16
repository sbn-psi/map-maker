import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './OverviewUpload';
import {Box, Card, CardMedia, CardActionArea, Typography, CardContent, Grid} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import {Zone } from './AppState';
import { AppStateProvider, useAppState, useAppStateDispatch } from './AppStateContext';
import StatusBar from './components/StatusBar';

const statusHeight = 30

function App() {

  return (
    <AppStateProvider>
      <Box component="main" sx={{ bgcolor: 'background.default'}}>
        <Box sx={{height: `${statusHeight}px`, borderBottom: '1px solid darkgrey'}}><StatusBar/></Box>
        <Grid container sx={{height: `calc(100vh - ${statusHeight}px)`}}>
          <Grid xs={9} sx={{ height: '100%'}} >
            <OverviewUpload sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
          </Grid>
          <Grid xs={3} sx={{ height: '100%', overflowY: 'auto'}} >
            <SidebarContents/>
          </Grid>

        </Grid>
      </Box>
    </AppStateProvider>
  )
}



function SidebarContents() {
  const [zones, setZones] = useState<Array<Zone>>([])
  const state = useAppState()
  const dispatchState = useAppStateDispatch()

  return <>
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {
        dispatchState({type: 'CLICKED_ZONE', zone: zone})
      }} 
      active={state.currentZone ? zones.indexOf(state.currentZone) === index : false} />)}
      
    <h1>Upload area images:</h1>
    { 
      <ImageUploader handler={uploads => {
        setZones([...zones, ...uploads])
        dispatchState({type: 'UPLOADED_ZONES'})
      }} cardinality="multiple"/>
    }
  </>
}

function SampleZone({zone, clickHandler, active}: {zone: Zone, clickHandler: () => void, active: boolean}) {
  return <Card sx={{backgroundColor: active ? 'lightblue' : 'white', margin: '5px'}}>
    <CardActionArea onClick={clickHandler}>
      <CardMedia image={zone.url} sx={{height: 100}}/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {zone.name}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Click to {active ? 'unselect' : 'select'}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
  
}

export default App;
