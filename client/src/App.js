import React, {useState} from 'react';
import './App.css';
import OverviewUpload from './OverviewUpload';
import {Drawer, Box, Button} from '@mui/material';
import ImageUploader from './components/ImageUploader';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const drawerWidth = 360;


function App() {
  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <OverviewUpload/>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <SidebarContents/>
      </Drawer>
  </Box>
  );
}

function SidebarContents() {
  const [zones, setZones] = useState([])

  return <>
    {zones.map((zone, index) => <SampleZone key={index} imageUrl={zone.url} clickHandler={() => {console.log(index)}}/>)}
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

function SampleZone({imageUrl, clickHandler}) {
  return <Grid container spacing={2}>
    <Grid xs={6} md={3}><img src={imageUrl}/></Grid>
    <Grid xs={6} md={9}><Button onClick={clickHandler}>Select</Button></Grid>
  </Grid>
}

export default App;
