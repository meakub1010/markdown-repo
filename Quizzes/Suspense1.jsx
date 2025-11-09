import * as React from 'react'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

const resource = (() => {
  let data = null
  let status = 'pending'
  let fetcher = null
  return {
    get() {
      if (status === 'ready') {
        return data
      }
      if (status === 'pending') {
        fetcher = new Promise((resolve, reject) => {
          setTimeout(() => {
            data = 1
            status = 'ready'
            resolve()
          }, 100)
        })
        status = 'fetching'
      }

      throw fetcher
    }
  }
})()

function A() {
  console.log('A1')
  const data = resource.get()
  console.log('A2')
  return <p>{data}</p>
}

function Fallback() {
  console.log('fallback')
  return null
}

function App() {
  console.log('App')
  return <div>
    <Suspense fallback={<Fallback/>}>
      <A/>
    </Suspense>
  </div>
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)

 /**
    
 App
 A1

 -> 
A calls resource.get().

status = 'pending' initially → so a Promise is created.

status is set to "fetching".

Then resource.get() does throw fetcher.
👉 Throwing a promise tells React “I’m not ready, suspend me”.

So React:

Aborts rendering <A/>.

Falls back to <Fallback/>.


fallback

After 100ms:
data = 1
status = ready
resolve()

- retry rendering A, fresh render it will print all the logs in that component
A1
A2


- Components inside Suspense always re-run from the top once the async resource resolves.

Final output:

App
A1
fallback
A1
A2



  *  */   