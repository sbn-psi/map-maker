import React, {useState, useEffect, useRef} from 'react';
import ImageUploader from "./components/ImageUploader";
import Canvas from './components/Canvas'
import {Box} from '@mui/material';

function OverviewMaker({sx, ...other}) {
  const [imageUrl, setImageUrl] = useState(null)

  return (<Box sx={sx}>
    {imageUrl ? 
      <Overview imageUrl={imageUrl}/> :
      <Uploader callback={setImageUrl} {...other}/>
    }
  </Box>
  )
  
}

export default OverviewMaker;

function Uploader({callback}) {
  return (<Box sx={{p: 1}}>
    <h1>Upload an overview map</h1>
    { 
      <ImageUploader handler={callback}/>
    }
  </Box>);
}

function Overview({imageUrl, activeZone}) {
  const [drawContext, setDrawContext] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const img = useRef(null) 

  
  const clickHandler = (x, y) => {
    console.log(`click ${x}, ${y}`)
  }

  const mouseHandler = (x, y) => {
    if(!!activeZone) {
      console.log(`move ${x}, ${y}`)
    }
  }
  
  const width = img.current?.naturalWidth || 1000
  const height = img.current?.naturalHeight || 1000
  
  if(loaded && drawContext) {
    drawContext.drawImage(img.current, 0, 0)
  }

  useEffect(() => {
    const listener = () => {
      setLoaded(true)
    }
    img.current.addEventListener('load', listener)

    return function cleanup() {
      img.current?.removeEventListener('load', listener)
    }
  }, [])

  return <>
    <img ref={img} src={imageUrl} style={{display: 'none'}} crossOrigin="anonymous"/>
    <Canvas context={setDrawContext} click={clickHandler} move={mouseHandler} width={width} height={height}/>
  </>

}