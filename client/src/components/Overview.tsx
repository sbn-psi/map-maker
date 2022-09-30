import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppState, useAppStateDispatch } from '../AppStateContext';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { AppState, Zone } from '../AppState';
import { Box } from '@mui/material';

export function Overview({sx}: {sx: any}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const state:AppState = useAppState();
  const dispatchState = useAppStateDispatch()
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');

  // setup click handlers for canvas
  useEffect(() => {
    const clickHandler = (x: number, y: number) => {
      if (state.canvas === 'corner1') {
        dispatchState({type: 'CLICKED_CORNER', x, y});
      } else if (state.canvas === 'corner2' && x > state.currentZone!.corner1!.x && y > state.currentZone!.corner1!.y) {
        dispatchState({type: 'COMPLETED_ZONE', x, y});
      }
    };

    const mouseHandler = (x: number, y: number) => {
      if (!!state.currentZone) {
        dispatchState({type: 'MOUSE_OVER_ZONE', x, y});
      }
    };
    if (!!canvas) {
      // set up click handling
      const clickListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        clickHandler(pos.x, pos.y);
      };
      canvas.addEventListener('mousedown', clickListener);

      // set up mouse move
      const moveListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        mouseHandler(pos.x, pos.y);
      };
      canvas.addEventListener('mousemove', moveListener);
      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', clickListener);
        canvas?.removeEventListener('mousemove', moveListener);
      };
    }
  }, [state]);

  // setup image load listener so we rerender when it happens
  useEffect(() => {
    const listener = () => {
      setLoaded(true);
    };
    img.current!.addEventListener('load', listener);

    return function cleanup() {
      img.current?.removeEventListener('load', listener);
    };
  }, []);

  const width = img.current?.naturalWidth || 1000;
  const height = img.current?.naturalHeight || 1000;

  // draw the current state
  if (loaded && drawContext) {
    drawContext.drawImage(img.current!, 0, 0);
    for(let zone of state.mappedZones) {
      drawZone(zone, drawContext);
    }
    if(state.currentZone?.corner1) {
      let x = state.currentZone.corner1.x, y = state.currentZone.corner1.y;
      drawFirstCorner(x, y, drawContext);
      
      if(state.mousePosition) {
        drawContext.globalAlpha = 0.4
        drawContext.drawImage((document.getElementById(state.currentZone.name) as HTMLImageElement)!, x, y, state.mousePosition.x - x, state.mousePosition.y - y);
        drawContext.globalAlpha = 1
      }
    }
  }


  return <Box sx={sx}>
    <img ref={img} src={state.overview!.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    {state.unmappedZones.map((zone: Zone) => <img id={zone.name} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />)}
    <Canvas width={width} height={height} />
  </Box>;

}

function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#43FF33";
  ctx.rect(zone.corner1!.x, zone.corner1!.y, zone.corner2!.x - zone.corner1!.x, zone.corner2!.y - zone.corner1!.y);
  ctx.stroke();
  ctx.drawImage((document.getElementById(zone.name) as HTMLImageElement)!, zone.corner1!.x, zone.corner1!.y, zone.corner2!.x - zone.corner1!.x, zone.corner2!.y - zone.corner1!.y);
}

function drawFirstCorner(x: number, y: number, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x, y, 20, 3);
  ctx.fillRect(x, y, 3, 20);
}

function drawSecondCorner(x: number, y: number, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x-20, y-3, x, y);
  ctx.fillRect(x-3, y-20, x, y);
}