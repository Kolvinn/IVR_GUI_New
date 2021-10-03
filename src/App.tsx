import React, { useState,  MouseEvent, useCallback  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  useZoomPanHelper,
  Elements,
  OnLoadParams, Edge, Connection,Background, FlowElement,Node,BackgroundVariant
} from 'react-flow-renderer';
import localforage from 'localforage';
import { nodeTypes } from './CustomNodeComponent';
// import {customNodeStyles} from './Styles'
import { saveAs } from 'file-saver';

import './save.css';
import './App.css';
import {writeJsonFile} from 'write-json-file';


declare type Connect<T = any> = {
  source:string|null,
  target:string|null,
}

declare type ConnectionData<T = any> = Array<Connect<T>>;



const http = require("http");

localforage.config({
  name: 'react-flow-docs',
  storeName: 'flows',
});


const flowKey = 'example-flow';

/**
 * This is the node ID creation format which just adds the current date to node_
 */
const getNodeId = () => `node_${+new Date()}`;


const initialElements: Elements = [];









export const SaveRestore = () => {

  const state: ConnectionData = [];
  
// modal.connections.push(null);

  const [rfInstance, setRfInstance] = useState<OnLoadParams | null>(null);
  const [elements, setElements] = useState<Elements>(initialElements);

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => {
    
    setElements((els) => addEdge(params, els));
    
  }
  const onLoad = (reactFlowInstance: OnLoadParams) => setRfInstance(reactFlowInstance);

  const { transform } = useZoomPanHelper();


  /**
   * 
   * @param fileName the filename of the string you want the audio file to be (extension included - default is mp3)
   * @param prompt the string you want the TTS to translate
   */
  const createAudioFile = (fileName:string, prompt:string) =>{
    console.log(fileName, prompt);
    fetch('http://localhost:8080/fetchtext?fileName='+ fileName+'&prompt='+prompt,{mode: 'cors'});
  }


  /**
   * Saves the state of the current diagram and creates audio file if there is one.
   */
  const onSave = useCallback(() => {
    console.log("saving");
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localforage.setItem(flowKey, flow);

      var i = 0;

      /**
       * iterate over the final object and create audio files per prompt
       */
      flow.elements.forEach(element => {
        if(element.id != null && element.data != null){

          var audioFileName:string = element.id + '.mp3';

          element.data.audioFileLocation = audioFileName;
          //console.log(element.data.audioFileLocation);
          createAudioFile(audioFileName, element.data.prompt);          
        }
      });

      /**
       * now write the object to a file via node backend.
       * This will return a 500 for some reason, but it works.
       */
      fetch('http://localhost:8080/writefile',
          {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(flow)
        });

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

  
  /**
   * Used to add componenets on the screen
   * You can add things in the data {} section that will get passed around and can be updated if you want some data to persist. 
   * 
   * If you want to change box starting position, change the x and y vars to something more useful.
   */
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
        data: { 
          nodeId: id,
          text: id, 
          type: {type}, 
          x: {x}, 
          y:{y}, 
          trigger: "", 
          prompt:"", 
          connection:[], 
          audioFileLocation:""
        },
      };
    
    setElements((els) => els.concat(newNode));
  }, [setElements]);


  const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
  const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);

  // const nodeTypes = {
  //   special: CustomNodeComponent,
  // };
  
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

    // fetch('http://localhost:8080/fetchtext',{mode: 'cors'});
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
        
    </ReactFlowProvider>

    );
  }
};

