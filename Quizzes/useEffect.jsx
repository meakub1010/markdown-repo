import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

function App() {
  const [state, setState] = useState(0)
  console.log(state)

  useEffect(() => {
    setState(state => state + 1)
  }, [])

  useEffect(() => {
    console.log(state)
    setTimeout(() => {
      console.log(state)
    }, 100)
  }, [])

  return null
}

ReactDOM.render(<App/>, document.getElementById('root'))


/*
first render print
0 <-- from state

now schedule useEffect 1 and useEffect 2

execute first useEffect
    - schedule re-render based on new state value 1

execute second useEffect
    - state still point to 0 and
    - print 0 in console
    - schedule timeout with state value 0 from closure

    re-render from first useEffect that was scheduled based on the state = 1

    print 1 in console from the body
    - at this point useEffect will not run as dep is []

    timeout fires
    - since timeout scheduled based on state = 0 it will print 
    
    0


  output:
  0
  0
  1
  0  

*/