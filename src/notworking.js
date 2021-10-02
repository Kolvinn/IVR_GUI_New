import React, { useState, MouseEvent, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
//import localforage from 'localforage';
//import SaveRestore from './SaveRestore';
import './save.css';

import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  isNode,
  Background,
  Elements,
  BackgroundVariant,
  FlowElement,
  Node,
  Edge,
  Connection,
  OnLoadParams,
  Position,
  Handle,
  useZoomPanHelper,
} from 'react-flow-renderer';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);

const initialElements: Elements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: '6',
    type: 'special',
    position: { x: 160, y: 200 },
    data: { text: 'A custom node' },
  },
];

const BasicFlow = () => {
  const [rfInstance, setRfInstance] = useState<OnLoadParams | null>(null);
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));
  const onLoad = (reactFlowInstance: OnLoadParams) => setRfInstance(reactFlowInstance);

  const updatePos = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          el.position = {
            x: Math.random() * 400,
            y: Math.random() * 400,
          };
        }

        return el;
      });
    });
  };

  const logToObject = () => console.log(rfInstance?.toObject());
  const resetTransform = () => rfInstance?.setTransform({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          el.className = el.className === 'light' ? 'dark' : 'light';
        }

        return el;
      });
    });
  };

  // const elements1 = [
  //   {
  //     id: '2',
  //     type: 'special',
  //     position: { x: 100, y: 100 },
  //     data: { text: 'A custom node' },
  //   },
  // ];
  
  const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
    width: 300,
    height: 150,
  };
  const CustomNodeComponent = ( {data} : {data:any})  => {
    return (
      <div style={customNodeStyles}>
        
        <Handle type="target" position = {Position.Left} style={{ borderRadius: 0 }} />
        <div>{data.text}</div>
        <Handle
          type="source"
          position={Position.Right} 
          id="a"
          style={{ top: '30%', borderRadius: 0 }}
        />
        <Handle
          type="source"
          position={Position.Right} 
          id="b"
          style={{ top: '70%', borderRadius: 0 }}
        />
        <div>
          <input></input>
        </div>
        <div>
          <input></input>
        </div>
        <div>
          <input></input>
        </div>
      </div>
    );
  };
  
  const nodeTypes = {
    special: CustomNodeComponent,
  };
  return (
    <ReactFlow
      elements={elements}
      nodeTypes = {nodeTypes}
      onLoad={onLoad}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      className="react-flow-basic-example"
      defaultZoom={1.5}
      minZoom={0.2}
      maxZoom={4}
    >
      <Background variant={BackgroundVariant.Lines} />

      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={toggleClassnames} style={{ marginRight: 5 }}>
          toggle classnames
        </button>
        <button onClick={logToObject}>toObject</button>
      </div>
    </ReactFlow>
  );
};



// const getNodeId = () => `randomnode_${+new Date()}`;
// const SaveRestore = () => {
//   const [rfInstance, setRfInstance] = useState(null);
//   const [elements, setElements] = useState(initialElements);
//   const onElementsRemove = ({elementsToRemove} : {elementsToRemove: any}) =>
//     setElements((els) => removeElements(elementsToRemove, els));
//   const onConnect = ({params}:{params:any}) => setElements((els) => addEdge(params, els));

//   const { transform } = useZoomPanHelper();

//   const onSave = useCallback(() => {
//     if (rfInstance) {
//       const flow = rfInstance.toObject();
//       localforage.setItem(flowKey, flow);
//     }
//   }, [rfInstance]);

//   const onRestore = useCallback(() => {
//     const restoreFlow = async () => {
//       var flow: any = await localforage.getItem(flowKey);

//       if (flow) {
//         const [x = 0, y = 0] = flow.position;
//         setElements(flow.elements || []);
//         transform({ x, y, zoom: flow.zoom || 0 });
//       }
//     };

//     restoreFlow();
//   }, [setElements, transform]);

//   const onAdd = useCallback(() => {
//     const newNode = {
//       id: getNodeId(),
//       data: { label: 'Added node' },
//       position: {
//         x: Math.random() * window.innerWidth - 100,
//         y: Math.random() * window.innerHeight,
//       },
//     };
//     setElements((els) => els.concat(newNode));
//   }, [setElements]);


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopene  noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <BasicFlow/>
    </div>
  );
}

export default App;