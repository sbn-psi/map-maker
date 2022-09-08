import React, {useState, useEffect, useRef} from 'react';
import ImageUploader from "./components/ImageUploader";
import Canvas from './components/Canvas'

function OverviewMaker() {
  const [imageUrl, setImageUrl] = useState(null)

  return (<>
    {imageUrl ? 
      <Overview imageUrl={imageUrl}/> :
      <Uploader callback={setImageUrl}/>
    }
  </>
  )
  
}

export default OverviewMaker;

function Uploader({callback}) {
  return (<>
    <h1>Upload an overview map</h1>
    { 
      <ImageUploader handler={callback}/>
    }
  </>);
}

function Overview({imageUrl}) {
  const [drawContext, setDrawContext] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const img = useRef(null) 

  
  const clickHandler = (x, y) => {
    console.log(`${x}, ${y}`)
  }
  
  const width = img.current?.naturalWidth || 1000
  const height = img.current?.naturalHeight || 1000
  
  if(loaded) {
    drawContext.drawImage(img.current, 0, 0)
  }

  useEffect(() => {
    const listener = () => {
      setLoaded(true)
    }
    img.current.addEventListener('load', listener)

    return function cleanup() {
      img.current.removeEventListener('load', listener)
    }
  }, [])

  return <>
    <img ref={img} src={imageUrl} style={{display: 'none'}} crossOrigin="anonymous"/>
    <Canvas context={setDrawContext} click={clickHandler} width={width} height={height}/>
  </>

}