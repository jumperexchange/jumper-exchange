import { animate, stagger } from 'motion'
import { useEffect, useRef } from 'react'

function LoadingIndicator() {
  const element = useRef<HTMLDivElement | null>(null)

  const bubbleStyle: React.CSSProperties = {
    background: '#096dd9',
    display: 'inline-block',
    margin: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
  }

  useEffect(() => {
    //normal animation
    animate(
      element.current?.childNodes as NodeListOf<Element>,
      {
        y: [0, -5, 0],
        opacity: [1, 0.8, 1],
      },
      {
        delay: stagger(0.1),
        duration: 1,
        repeat: Infinity,
        easing: 'ease-in-out',
      },
    )
  }, [])

  return (
    <div ref={element}>
      <div style={bubbleStyle}></div>
      <div style={bubbleStyle}></div>
      <div style={bubbleStyle}></div>
      <div style={bubbleStyle}></div>
    </div>
  )
}

export default LoadingIndicator
