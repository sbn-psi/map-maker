import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppState, useAppStateDispatch } from '../AppStateContext';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { AppState, InteractionState, Zone, Corners } from '../AppState';
import { Box } from '@mui/material';
import { useInteractionState, useInteractionStateDispatch } from '../InteractionStateContext';
import {findBottomCorner, findHeight, findWidth} from '../math' ;

export function Overview({sx}: {sx: any}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const state:AppState = useAppState();
  const interactions:InteractionState = useInteractionState();
  const dispatchInteraction = useInteractionStateDispatch()
  const dispatchState = useAppStateDispatch();
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');

  // setup click handlers for canvas
  useEffect(() => {
    const clickHandler = (x: number, y: number) => {

      if (!!interactions.selectedCorner) {
        dispatchInteraction({type: 'PLACED_CORNER', corner: interactions.selectedCorner, x: x, y: y})
        interactions.selectedZone![interactions.selectedCorner] = {x: x, y: y}
        if(interactions.selectedZone?.isComplete()) {
          dispatchState({type: 'MAPPED_ZONE', zone: interactions.selectedZone!})
        }
      } else if(!!interactions.selectedZone) {
        // calculate if click was on a corner
        for(let corner of Object.values(Corners)) {
          let coords = interactions.selectedZone[corner]
          if (Math.abs(coords!.x - x) < 10 && Math.abs(coords!.y - y) < 10) {
            dispatchInteraction({type: 'SELECTED_CORNER', corner: corner})
            return
          }
        }
      }
    };

    const mouseHandler = (x: number, y: number) => {
      if (!!interactions.selectedZone) {
        dispatchInteraction({type: 'MOUSE_OVER_ZONE', x, y});
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
  }, [interactions]);

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
    // overview image
    drawContext.drawImage(img.current!, 0, 0);

    // mapped zones
    for(let zone of state.mappedZones) {
      drawZone(zone, drawContext);
    }

    // corners
    if(interactions.selectedZone?.top) {
      for(let corner of Object.values(Corners)) {
        const coords = interactions.selectedZone![corner]
        if(coords) drawCorner(coords.x, coords.y, drawContext, corner === interactions.selectedCorner);
      };
      
    }

    // draw interacting zone if we have at least two corners
    if(interactions.selectedZone && interactions.selectedCorner && interactions.mousePosition) {
      let cornersPlaced = [interactions.selectedZone.left, interactions.selectedZone.top, interactions.selectedZone.bottom].filter((c) => !!c).length;
      if(cornersPlaced >= 2) {
        drawContext.globalAlpha = 0.4
        let tempZone = {...interactions.selectedZone, [interactions.selectedCorner]: interactions.mousePosition}
        tempZone.height = findHeight(tempZone.left!, tempZone.bottom!)
        if(interactions.selectedCorner === Corners.Bottom) {
          correctBottomCorner(tempZone, interactions.mousePosition)
        }
        drawZone(tempZone, drawContext);
        drawContext.globalAlpha = 1
      }
    }
  }


  return <Box sx={sx}>
    <img ref={img} src={state.overview!.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    {state.unmappedZones.map((zone: Zone) => <img id={zone.name} key={zone.name} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />)}
    <Canvas width={width} height={height} />
  </Box>;

}

function drawCorner(x: number, y: number, ctx: CanvasRenderingContext2D, selected: boolean) {
  ctx.save();
  ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = selected ? "#DD0000" : "#FFFFFF";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore(); // resets to previous state
}

function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
  if(!(zone.left && zone.top && zone.height)) return;

  // calculate tilt
  const angle = Math.atan2(zone.left.y - zone.top.y, zone.left.x - zone.top.x);

  const height = zone.height
  const width = findWidth(zone.top, zone.left);
  
  // set translate (relative origin) and rotation angle for the drawing context so that image has proper tilt
  ctx.save();
  ctx.translate(zone.top.x, zone.top.y);
  ctx.rotate(angle);
  ctx.drawImage((document.getElementById(zone.name) as HTMLImageElement)!, 0, 0, width, height);
  ctx.strokeStyle = "#43FF33";
  ctx.rect(0, 0, width, height);
  ctx.stroke();
  ctx.restore(); // resets to previous state
  
}

// WIP
function correctBottomCorner(zone: Zone, mousePosition: {x: number, y: number}) {
  if(!zone.top || !zone.left) return;

  // calculate angle between top and mouse
  const angle = Math.atan2(zone.top.y - mousePosition.y, zone.top.x - mousePosition.x);

  if(zone.left.y > zone.top.y) {
    // left is below top
  } else {
    // left is above top
  }
}