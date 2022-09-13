import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './OverviewUpload';
import {Drawer, Box, Card, CardMedia, CardActionArea, Typography, CardContent} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import {AppState, Zone, StatePasser} from './AppState';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const drawerWidth = 360;


function App() {
  const [appState, setAppState] = useState<AppState>(new AppState())
  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default'}}>
      <OverviewUpload sx={{width: `calc(100vw - ${drawerWidth}px)`, overflow: 'auto'}}/>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            p: 1,
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <SidebarContents state={appState} setState={setAppState}/>
      </Drawer>
  </Box>
  );
}

function SidebarContents({state, setState}: StatePasser) {
  const [zones, setZones] = useState<Array<Zone>>([])

  return <>
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {
        setState(state.set('currentZone', state.currentZone === zone ? null : zone))
      }} 
      active={state.currentZone ? zones.indexOf(state.currentZone) === index : false} />)}
      
    <h1>Upload area images:</h1>
    { 
      <ImageUploader handler={uploads => setZones([...zones, ...uploads])} cardinality="multiple"/>
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
