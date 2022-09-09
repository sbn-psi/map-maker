import React, {useRef, useEffect} from 'react'

type CanvasProps = {
  context: (ctx: CanvasRenderingContext2D) => void
  click: (x: number, y: number) => void
  width: number,
  height: number
};

function Canvas({ context, click, width, height, ...rest }: CanvasProps) {  
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if(canvas && ctx) {
  
      // set up scaling
      const { devicePixelRatio:ratio=1 } = window
      canvas.width = width*ratio
      canvas.height = height*ratio
      ctx.scale(ratio, ratio)
      
      // pass back the 2d context for draws
      context(ctx)

      // set up click handling
      const listener = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        click(x, y)
      }
      canvas.addEventListener('mousedown', listener)
      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', listener)
      }
    } 

  }, [click, context, width, height])
  
  return <canvas width={width} height={height} ref={canvasRef} {...rest}>
    Your browser does not support canvas, please use another
  </canvas>
}

export default Canvas