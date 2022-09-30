import React, {useState} from 'react';
import ImageUploader from "./ImageUploader";
import {Box} from '@mui/material';
import { useAppStateDispatch } from '../AppStateContext';

function OverviewMaker({sx}: {sx: any}) {
  const dispatch = useAppStateDispatch()

  return (<Box sx={{...sx, p: 1}}>
      <h1>Upload an overview image</h1>
      { 
        <ImageUploader handler={overview => {
          dispatch({type: 'UPLOADED_OVERVIEW', overview: overview[0]})
        }} cardinality="single"/>
      }
  </Box>
  )
  
}

export default OverviewMaker;

