import React, { useEffect, useState, useRef } from 'react';

interface ClockProps {
  startedAt: number,
  successAt?: number | undefined,
  failedAt?: number | undefined,
}

const Clock = ({ startedAt, successAt, failedAt }: ClockProps) => {
  const [count, setCount] = useState<number>(Math.floor((Date.now() - startedAt) / 1000))
  const intervalRef = useRef<NodeJS.Timeout>()

  const getCount = () => {
    // not ended
    if (!failedAt && !successAt) {
      return count
    }

    // ended
    return Math.floor(((failedAt || successAt || 0) - startedAt) / 1000)
  }

  const renderTime = () => {
    const total = getCount()
    const minutes = Math.floor(total/60)
    const seconds = total % 60
    const prefix = seconds < 10 ? '0' : ''

    return `${minutes}:${prefix}${seconds}`
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => setCount(count => count + 1), 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <>
      {renderTime()}
    </>
  )
}

export default Clock
