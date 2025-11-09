import * as React from 'react'
import { useRef, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const ref = useRef(null)
  const [state, setState] = useState(1)

  useEffect(() => {
    setState(2)
  }, [])

  console.log(ref.current?.textContent)

  return <div>
    <div ref={state === 1 ? ref : null}>1</div>
    <div ref={state === 2 ? ref : null}>2</div>
  </div>
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)


/*
- initial render ref is null, hence will print nothing
after render, ref will be set to first div
after that useEffect will run and setState to 2
at that point ref is still holding previous ref
hence it will print 1 in console

"1"


*/