import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setWindowSize  as setReduxWindowSize } from '../redux/actions/size_action'


export default function useWindowSize() {
  let dispatch = useDispatch()

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)

    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  dispatch(setReduxWindowSize(windowSize))
  return windowSize
}