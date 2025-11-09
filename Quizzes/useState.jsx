import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { screen, fireEvent } from "@testing-library/dom";

function A() {
  console.log('render A')
  return null
}

function App() {
  const [_state, setState] = useState(false)
  console.log('render App')
  return <div>
    <button onClick={() => {
      console.log('click')
      setState(true)
    }}>click me</button>
    <A />
  </div>
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

(async function () {
  const action = await screen.findByText("click me"); 
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
})();

function wait(duration = 100) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/*

render app
render A

click               // state changed to true, so full re-render
render app
render A

click               // state not changed, react enter into render phase and try to prevent child re-render
render app

click               // next click it bails out complete re-render

*/