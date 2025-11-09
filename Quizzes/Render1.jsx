function A({state}){
  console.log('A');
  return <B/>
}
function B(){
  console.log('B')
  return <C/>
}
function C(){
  console.log('C')
  return null;
}
function D(){
  console.log('D')
  return null;
}



function App() {
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    setState(state => state+1);
  }, []);

  return (
    <>
      {/* <DragDrop /> */}
      <h1>Hello</h1>
      <A state={state}/>
      <D />
    </>
  )
}

export default App


/*
OUTPUT:

A
B
C
D
A
B
C
D

*/