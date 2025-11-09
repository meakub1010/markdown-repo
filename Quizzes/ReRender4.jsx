import * as React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function A({ children }) {
  console.log('A')
  const [state, setState] = useState(0)
  useEffect(() => {
    setState(state => state + 1)
  }, [])
  return children
}

function B() {
  console.log('B')
  return <C/>
}

function C() {
  console.log('C')
  return null
}

function D() {
  console.log('D')
  return null
}

function App() {
  console.log('App')
  return (
    <div>
      <A><B/></A>
      <D/>
    </div>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)


/*


App
A
B
C
D
A

 Thus there are two ways to 
  prevent child components from re-rendering.
    - wrapping them in `memeo`
    - passing them as `children` prop

since A receive B as children, even after state change in A will not trigger re-render for B -> C

if children is defined inside A, then B will re-render
if children is passed as prop (or wrap like <A><B /></A>), then B will not re-render


*/