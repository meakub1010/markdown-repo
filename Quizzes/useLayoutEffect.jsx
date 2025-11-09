// regular useEffect runs after DOM mutation and after browser paints

// useLayoutEffect runs after DOM mutation but before browser paint


import { useState, useEffect, useLayoutEffect} from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  console.log('App')
  const [state, setState] = useState(0)
  useEffect(() => {
    setState(state => state + 1)
  }, [])

  useEffect(() => {
    console.log('useEffect 1')
    return () => {
      console.log('useEffect 1 cleanup')
    }
  }, [state])

  useEffect(() => {
    console.log('useEffect 2')
    return () => {
      console.log('useEffect 2 cleanup')
    }
  }, [state])

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => {
      console.log('useLayoutEffect cleanup')
    }
  }, [state])

  return null
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)


/*
App
useLayoutEffect
useEffect1
useEffect2

=> state changed -> re-render

App
useLayoutEffect cleanup     // all useLayoutEffect is first to be cleand up then immediately executed after DOM mutation but before browser paint
useLayoutEffect

useEffect 1 cleanup         // useEffect are grouped and cleaned up
useEffect 2 cleanup         

useEffect 1
useEffect 2



*/