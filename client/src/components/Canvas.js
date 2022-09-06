import React, {useRef, useEffect} from 'react'

const Canvas = props => {  
  
  const { ctx, width, height, ...rest } = props
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const { devicePixelRatio:ratio=1 } = window
    canvas.width = width*ratio
    canvas.height = height*ratio
    context.scale(ratio, ratio)
    
    // pass back this context for draws
    ctx(context)
  }, [ctx, width, height])
  
  return <canvas width={width} height={height} ref={canvasRef} {...rest}></canvas>
}

export default Canvas