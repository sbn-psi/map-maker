import React, {useRef, useEffect} from 'react'

type CanvasProps = {
  context: (ctx: CanvasRenderingContext2D) => void
  click: (x: number, y: number) => void
  move: (x: number, y: number) => void
  width: number,
  height: number
};

function Canvas({ context, click, move, width, height }: CanvasProps) {  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')
  
  useEffect(() => {
    
    if(canvas && ctx) {
  
      // set up scaling
      const { devicePixelRatio:ratio=1 } = window
      canvas.width = width*ratio
      canvas.height = height*ratio
      ctx.scale(ratio, ratio)
      
      // pass back the 2d context for draws
      context(ctx)

      // set up click handling
      const clickListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event)
        let translated = translateMousePos(pos.x, pos.y, ctx.getTransform())
        click(translated.x, translated.y)
      }
      canvas.addEventListener('mousedown', clickListener)

      // set up mouse move
      const moveListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event)
        let translated = translateMousePos(pos.x, pos.y, ctx.getTransform())
        move(translated.x, translated.y)
      }
      canvas.addEventListener('mousemove', moveListener)
      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', clickListener)
        canvas?.removeEventListener('mousemove', moveListener)
      }
    } 

  }, [ctx, canvas, click, move, context, width, height])
  
  return <canvas width={width} height={height} ref={canvasRef}>
    Your browser does not support canvas, please use another
  </canvas>
}

export default React.memo(Canvas, compareProps)

function compareProps(prevProps: CanvasProps, nextProps: CanvasProps) {
  return prevProps.width === nextProps.width && prevProps.height === nextProps.height
}

function  getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function translateMousePos(x: number, y: number, transform: DOMMatrix) {

  let inverted = transform.invertSelf()

  return {
    x: x * inverted.a + y * inverted.c + inverted.e,
    y: x * inverted.b + y * inverted.d + inverted.f
  }
  
}