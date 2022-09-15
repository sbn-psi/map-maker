import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './OverviewUpload';
import {Drawer, Box, Card, CardMedia, CardActionArea, Typography, CardContent, Grid} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import {AppState, Zone, StatePasser} from './AppState';

const statusHeight = 30

function App() {
  const [appState, setAppState] = useState<AppState>(new AppState())
  return (
    <Box component="main" sx={{ bgcolor: 'background.default'}}>
      <Box sx={{height: `${statusHeight}px`, borderBottom: '1px solid darkgrey'}}><StatusBar state={appState}/></Box>
      <Grid container sx={{height: `calc(100vh - ${statusHeight}px)`}}>
        <Grid xs={9} sx={{ height: '100%'}} >
          <OverviewUpload sx={{height: '100%', width: '100%', overflow: 'auto'}} state={appState} setState={setAppState}/>
        </Grid>
        <Grid xs={3} sx={{ height: '100%', overflowY: 'auto'}} >
          <SidebarContents state={appState} setState={setAppState}/>
        </Grid>

      </Grid>
    </Box>
  );
}

function StatusBar({state}: {state: AppState}) {
  let caption = ''
  if(state.currentZone) {
    if(state.canvas === 'corner1') {
      caption = 'Place the first corner'
    } else {
      caption = 'Place the second corner'
    }
  } else {
    if(state.workflow === 'overviewUpload') {
      caption = 'Upload an overview image'
    } else if(state.workflow === 'zoneUpload') {
      caption = 'Upload one or more sample zones'
    } else {
      caption = 'Select a sample zone to align'
    }
  }
  return <Typography align='center' variant="overline" component="div" sx={{margin: 'auto'}}>
    {caption}
  </Typography>
}

function SidebarContents({state, setState}: StatePasser) {
  const [zones, setZones] = useState<Array<Zone>>([])

  return <>
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {
        setState(state.set(
          ['currentZone', state.currentZone === zone ? null : zone],
          ['canvas', 'corner1']
        ))
      }} 
      active={state.currentZone ? zones.indexOf(state.currentZone) === index : false} />)}
      
    <h1>Upload area images:</h1>
    { 
      <ImageUploader handler={uploads => {
        setZones([...zones, ...uploads])
        setState(state.set(['workflow', 'zoneMapping']))
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
