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
    data: { text: 'A custom node', id:'6', type:'special' },
  },
];

function fun() {
  console.log('test');
}
export const SaveRestore = () => {
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
    const newNode = {
        id: getNodeId(),
        type: 'special',
        position: {
          x: Math.random() * window.innerWidth - 100,
          y: Math.random() * window.innerHeight,
        },
        data: { text: 'A custom node' },
      };

    setElements((els) => els.concat(newNode));
  }, [setElements]);

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

  const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
    width: 210,
    height: 100,
  };
  const CustomNodeComponent = ( {data} : {data:any})  => {
    //data.func;
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





function App() {
  return (
    <ReactFlowProvider >

        <SaveRestore/>
        
    </ReactFlowProvider>
  );
}

export default App;