import React, {useState, useRef} from 'react';
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
  const img = useRef(null) 

  const plotImage = (ctx) => {
    ctx.drawImage(img.current, 0, 0)
  }

  const width = img.current?.naturalWidth || 1000
  const height = img.current?.naturalHeight || 1000

  return <>
    <img ref={img} src={imageUrl} style={{display: 'none'}} crossOrigin="anonymous"/>
    <Canvas ctx={plotImage} width={width} height={height}/>
  </>

}