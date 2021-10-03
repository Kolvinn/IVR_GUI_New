import React, { useState,  MouseEvent, useCallback  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  useZoomPanHelper,
  Elements,
  OnLoadParams, Edge, Connection, Controls, updateEdge,Position, Handle,Background,isNode, FlowElement,Node,BackgroundVariant
} from 'react-flow-renderer';
import localforage from 'localforage';

import './save.css';
import './App.css';
import { idText } from 'typescript';
//const GoogleTts = require("google-tts.js") 
import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
import { saveAs } from "file-saver";


const http = require("http");

localforage.config({
  name: 'react-flow-docs',
  storeName: 'flows',
});

const flowKey = 'example-flow';

const getNodeId = () => `randomnode_${+new Date()}`;

const initialElements: Elements = [
  // { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  // { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  // { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  // { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  // { id: 'e1-3', source: '1', target: '3' },
  {
    id: '6',
    type: 'special',
    position: { x: 160, y: 200 },
    data: { idthing: 'lolololol', text: 'A custom node', id:'6', type:'special' },
  },
];

// function fun() {
//   console.log('test');
// }
export const SaveRestore = () => {
  
  
  //  add_header 'Access-Control-Allow-Origin' "*";
  //  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE, PUT';
  //  add_header 'Access-Control-Allow-Headers' 'appID,authorizationkey';
  //  //saveFile();
  //  fetch(url)
  //       .then(res => res.blob())
  //       .then((blob) => {
  //         console.log(blob);
  //           //saveAs(blob, 'my-file-label.pdf');
  //   });

  //   fetch(url, {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Token: "sfg999666t673t7t82",
  //       Access-Control-Allow-Origin: "*";
  //     },
  //     method: "POST"
  //   });
  

 //GoogleTts.saveFile("abc", "id", "./src/audio.mp3").then(console.log)

  const [rfInstance, setRfInstance] = useState<OnLoadParams | null>(null);
  const [elements, setElements] = useState<Elements>(initialElements);

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));
  const onLoad = (reactFlowInstance: OnLoadParams) => setRfInstance(reactFlowInstance);

  const { transform } = useZoomPanHelper();
  

  const onSave = useCallback(() => {
    console.log("saving");
    console.log(rfInstance);
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localforage.setItem(flowKey, flow);
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = await localforage.getItem<any>(flowKey);

      if (flow) {
        const [x = 0, y = 0] = flow.position;
        setElements(flow.elements || []);
        transform({ x, y, zoom: flow.zoom || 0 });
      }
    };

    restoreFlow();
  }, [setElements, transform]);

  
  const onAdd = useCallback(() => {
    var id = getNodeId();
    var type = 'special';
    var x = Math.random() * window.innerWidth - 100;
    var y =Math.random() * window.innerHeight;
    const newNode = {
        id: id,
        type: type,
        position: {
          x: x,
          y: y,
        },
        data: { text: 'A custom node', type: {type}, x: {x}, y:{y}},
      };

    setElements((els) => els.concat(newNode));
  }, [setElements]);



  const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
    width: 210,
    height: 100,
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
        <div className = "box-flex">
          <div className = "input-flex">
            <label>Trigger</label>
            <input className = "lbl"></input>
          </div>
          <div className = "input-flex">
            <label>Prompt</label>
            <input className = "lbl"></input>
          </div>
          <div className = "input-flex">
            <label></label>
            <input></input>
          </div>
        </div>
        </div>
    );
  };
  const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
  const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);

  const nodeTypes = {
    special: CustomNodeComponent,
  };
  
  return (
      <div className = "holder">
        <div className = "button-holder">
          <button onClick={onSave}>save</button>
          <button onClick={onRestore}>restore</button>
          <button onClick={onAdd}>add node</button>
        </div>
      <ReactFlow
        elements={elements}
        nodeTypes = {nodeTypes}
        onElementClick={onElementClick}
        onNodeDragStop={onNodeDragStop}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={setRfInstance}
        defaultZoom={1.5}
        minZoom={0.2}
        maxZoom={4}
      >
        <Background variant={BackgroundVariant.Lines} />
        {/* <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        { <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={toggleClassnames} style={{ marginRight: 5 }}>
          toggle classnames
        </button>
        <button onClick={logToObject}>toObject</button> 
      </div> */}
        
      </ReactFlow>
      <div className="save__controls">
      
    </div>
    </div>
      
  );
};



export default class App extends React.Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.callBackendAPI()
      .then(res => {
        this.setState({ data: res.express });
        console.log(res);
        
      })
      .catch(err => console.log(err));

      fetch('http://localhost:8080/fetchtext',{mode: 'cors'});
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:8080/cors', {mode: 'cors'});
    const body = await response.json();
    console.log('using cors',body);

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }
  render() {
    return (
      <ReactFlowProvider >

         <SaveRestore/>
         <p className="App-intro">{this.state.data}</p>
     </ReactFlowProvider>

    );
  }
}

// class App extends React.Component() {
//   Render() {}
//     return (
//     <ReactFlowProvider >

//         <SaveRestore/>
        
//     </ReactFlowProvider>
//   );
// }
// }

