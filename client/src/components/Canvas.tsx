import React, {useRef, useEffect} from 'react'

type AppProps = {
  context: (ctx: CanvasRenderingContext2D) => void
  click: (x: number, y: number) => void
  width: number,
  height: number
};

function Canvas({ context, click, width, height, ...rest }: AppProps) {  
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const { devicePixelRatio:ratio=1 } = window
    canvas.width = width*ratio
    canvas.height = height*ratio
    ctx.scale(ratio, ratio)
    
    // pass back this context for draws
    context(ctx)
  }, [context, width, height])
  
  return <canvas width={width} height={height} ref={canvasRef} {...rest}></canvas>
}

export default Canvas