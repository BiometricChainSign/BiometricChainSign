import { useState, useEffect, useCallback } from 'react'

interface Options {
  initialSeconds: number
  onCompleted: () => void
}

function useCountdown({ initialSeconds, onCompleted }: Options) {
  const [seconds, setSeconds] = useState<number | null>(null)

  function start() {
    setSeconds(initialSeconds)
  }

  useEffect(() => {
    if (seconds === null) return

    if (seconds <= 0) {
      if (onCompleted) onCompleted()
      return
    }

    const timerId = setTimeout(() => {
      setSeconds(prevSeconds => (prevSeconds !== null ? prevSeconds - 1 : null))
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [seconds, onCompleted])

  return { seconds, start }
}

export default useCountdown
