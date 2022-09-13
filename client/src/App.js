import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './OverviewUpload';
import {Drawer, Box, Card, CardMedia, CardActionArea, Typography, CardContent} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const drawerWidth = 360;


function App() {
  const [activeZone, setActiveZone] = useState(null)
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
        <SidebarContents setActive={setActiveZone} active={activeZone}/>
      </Drawer>
  </Box>
  );
}

function SidebarContents({setActive, active}) {
  const [zones, setZones] = useState([])

  return <>
    {zones.map((zone, index) => <SampleZone key={index} zone={zone} 
      clickHandler={() => {active === index ? setActive(null) : setActive(index)}} 
      active={active === index}/>)}
    <Uploader callback={uploads => setZones([...zones, ...uploads])}/>
  </>
}

function Uploader({callback}) {
  return (<>
    <h1>Upload area images:</h1>
    { 
      <ImageUploader handler={callback} cardinality="multiple"/>
    }
  </>);
}

function SampleZone({zone, clickHandler, active}) {
  return <Card sx={{backgroundColor: active ? 'lightblue' : 'white', margin: '5px'}}>
    <CardActionArea onClick={clickHandler}>
      <CardMedia image={zone.url}/>
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
