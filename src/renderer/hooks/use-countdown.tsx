import { useState, useEffect, useCallback } from 'react'

interface Options {
  initialSeconds: number
}

function useCountdown({ initialSeconds }: Options) {
  const [seconds, setSeconds] = useState<number | null>(null)

  function start() {
    setSeconds(initialSeconds)
  }

  useEffect(() => {
    if (seconds === null) return

    if (seconds <= 0) {
      return
    }

    const timerId = setTimeout(() => {
      setSeconds(prevSeconds => (prevSeconds !== null ? prevSeconds - 1 : null))
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [seconds])

  return { seconds, start }
}

export default useCountdown
