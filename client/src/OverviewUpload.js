import React, {useState} from 'react';
import ImageUploader from "./components/ImageUploader";

function OverviewUpload() {
  const [imageUrl, setImageUrl] = useState(null)

  return (<>
    <h1>Let's start with the overview map</h1>
    { 
      imageUrl ? <img src={imageUrl}/>
        : <ImageUploader handler={setImageUrl}/>
    }
  </>);
}

export default OverviewUpload;
