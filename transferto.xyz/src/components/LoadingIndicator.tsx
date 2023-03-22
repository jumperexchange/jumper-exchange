import { animate, stagger } from 'motion'
import { useEffect, useRef } from 'react'

interface LoadingIndicatorProps {
  size?: 'default' | 'small'
}

function LoadingIndicator({ size = 'default' }: LoadingIndicatorProps) {
  const element = useRef<HTMLDivElement | null>(null)

  const bubbleStyle: React.CSSProperties = {
    background: '#3f49e1',
    display: 'inline-block',
    margin: size === 'default' ? 10 : 5,
    marginBottom: 0,
    width: size === 'default' ? 14 : 8,
    height: size === 'default' ? 14 : 8,
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
        duration: size === 'default' ? 1 : 1.2,
        repeat: Infinity,
        easing: 'ease-in-out',
      },
    )
  }, [])

  return (
    <div ref={element}>
      <div className="lifi-loading-indicator-bubble" style={bubbleStyle}></div>
      <div className="lifi-loading-indicator-bubble" style={bubbleStyle}></div>
      <div className="lifi-loading-indicator-bubble" style={bubbleStyle}></div>
      <div className="lifi-loading-indicator-bubble" style={bubbleStyle}></div>
    </div>
  )
}

export default LoadingIndicator
