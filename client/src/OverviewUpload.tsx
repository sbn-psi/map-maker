import React, {useState, useEffect, useRef} from 'react';
import ImageUploader from "./components/ImageUploader";
import Canvas from './components/Canvas'
import {Box} from '@mui/material';
import { useAppState, useAppStateDispatch } from './AppStateContext';

function OverviewMaker({sx}: {sx: any}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const dispatch = useAppStateDispatch()

  return (<Box sx={sx}>
    {imageUrl ? 
      <Overview imageUrl={imageUrl}/> :
      <Box sx={{p: 1}}>
        <h1>Upload an overview map</h1>
        { 
          <ImageUploader handler={overview => {
            dispatch({type: 'UPLOADED_OVERVIEW'})
            setImageUrl(overview[0].url)
          }} cardinality="single"/>
        }
      </Box>
    }
  </Box>
  )
  
}

export default OverviewMaker;

function Overview({imageUrl}: {imageUrl: string}) {
  const [drawContext, setDrawContext] = useState<CanvasRenderingContext2D | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const img = useRef<HTMLImageElement>(null) 
  const state = useAppState()

  
  const clickHandler = (x: number, y: number) => {
    console.log(`click ${x}, ${y}`)
  }

  const mouseHandler = (x: number, y: number) => {
    if(!!state.currentZone) {
      console.log(`move ${x}, ${y}`)
    } 
  }
  
  const width = img.current?.naturalWidth || 1000
  const height = img.current?.naturalHeight || 1000
  
  if(loaded && drawContext) {
    drawContext.drawImage(img.current!, 0, 0)
  }

  useEffect(() => {
    const listener = () => {
      setLoaded(true)
    }
    img.current!.addEventListener('load', listener)

    return function cleanup() {
      img.current?.removeEventListener('load', listener)
    }
  }, [])

  return <>
    <img ref={img} src={imageUrl} style={{display: 'none'}} crossOrigin="anonymous"/>
    <Canvas context={setDrawContext} click={clickHandler} move={mouseHandler} width={width} height={height}/>
  </>

}