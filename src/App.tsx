  import React, { useState,  MouseEvent, useCallback  } from 'react';
  import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    useZoomPanHelper,
    Elements,
    OnLoadParams, Edge, Connection,Position, Handle,Background, FlowElement,Node,BackgroundVariant
  } from 'react-flow-renderer';
  import localforage from 'localforage';
  import { nodeTypes } from './CustomNodeComponent';
  // import {customNodeStyles} from './Styles'

  import './save.css';
  import './App.css';

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

  const getNodeId = () => `node_${+new Date()}`;


  const initialElements: Elements = [];


  
 












  export const SaveRestore = () => {


    // const checkNodeExists= (data:any)=>{
    //   state.forEach(element =>{
    //     console.log(element.id, data.nodeId);
    //      if(element.id = data.id){
    //        console.log('node exists');
    //      }
    //   });
    // };

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
        flow.elements.forEach(element => {
          if(element.id != null && element.data != null){
            var audioFile:string = element.id + '.mp3';
            console.log("ELEMENTAL DATA: ", element.data);
            element.data.audioFileLocation = audioFile;
            //console.log(element.data.audioFileLocation);
            createAudioFile(audioFile, element.data.prompt);
          }
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


    // const CustomNodeComponent = ( {data} : {data:any})  => {






    // const handleInputChange = (e:any, type:string, data:any) => {
    //   if(type == "prompt"){
    //     data.prompt = e.target.value;
    //   }
    //   else if (type =="trigger"){
    //     data.trigger = e.target.value;
    //   }
    //  console.log(e.target.value);
    //  console.log(data);

    // };
    
      
    //   return (
    //     <div style={customNodeStyles}>
          
    //       <Handle type="target" position = {Position.Left} style={{ borderRadius: 0 }} />
    //       <div>{data.text}</div>
    //       <Handle
    //         type="source"
    //         position={Position.Right} 
    //         id="b"
    //         style={{ top: '20%', borderRadius: 0 }}
    //         onConnect = {(connection) => {
    //           data.connection.push(connection);
    //         }}
    //       />
    //       <Handle
    //         type="source"
    //         position={Position.Right} 
    //         id="b"
    //         style={{ top: '40%', borderRadius: 0 }}
    //         onConnect = {(connection) => {
    //           data.connection.push(connection);
    //         }}
    //       />
    //       <Handle
    //         type="source"
    //         position={Position.Right} 
    //         id="b"
    //         style={{ top: '60%', borderRadius: 0 }}
    //         onConnect = {(connection) => {
    //           data.connection.push(connection);
    //         }}
    //       />
    //       <Handle
    //         type="source"
    //         position={Position.Right} 
    //         id="b"
    //         style={{ top: '80%', borderRadius: 0 }}
    //         onConnect = {(connection) => {
    //           data.connection.push(connection);
    //         }}
    //       />
    //       <div className = "box-flex">
    //         <div className = "input-flex">
    //           <label>Trigger</label>
    //           <input className = "lbl" onChange = { (e) => {handleInputChange(e, "trigger",data)}}></input>
    //         </div>
    //         <div className = "input-flex">
    //           <label>Prompt</label>
    //           <input className = "lbl" onChange = { (e) => {handleInputChange(e, "prompt",data)}}></input>
    //         </div>
    //         {/* <div className = "input-flex">
    //           <label></label>
    //           <input></input>
    //         </div> */}
    //       </div>
    //       </div>
    //   );
    // };



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

  // class App extends React.Component() {
  //   Render() {}
  //     return (
  //     <ReactFlowProvider >

  //         <SaveRestore/>
          
  //     </ReactFlowProvider>
  //   );
  // }
  // }

