import { useEffect, useState, useCallback, RefObject } from 'react'

export const useSize = (ref: RefObject<HTMLElement>, callback?: (entry: DOMRectReadOnly) => void) => {
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const [{ contentRect }] = entries
      const { width, height } = contentRect

      setWidth(width)
      setHeight(height)

      if (callback) {
        callback(contentRect)
      }
    },
    [callback]
  )

  useEffect(() => {
    if (ref?.current) {
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => handleResize(entries))
      resizeObserver.observe(ref.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [ref, handleResize])

  return { width, height }
}
