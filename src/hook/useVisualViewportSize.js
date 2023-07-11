import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setVisualSize  as setReduxVisualSize } from '../redux/actions/size_action'

export default function useVisualViewportSize() {
  let dispatch = useDispatch()
  const [viewportSize, setViewportSize] = useState({
      width: undefined,
      height: undefined
  })

  useEffect(() => {
    function handleResize() {
      setViewportSize({
          width: window.visualViewport.width,
          height: window.visualViewport.height,
      })
    }
    window.visualViewport.addEventListener('resize', handleResize)
    handleResize()
    return () => window.visualViewport.removeEventListener('resize', handleResize)
  }, [])
  dispatch(setReduxVisualSize(viewportSize))
  return viewportSize
}