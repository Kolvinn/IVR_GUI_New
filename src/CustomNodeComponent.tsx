import React from 'react';
import ReactFlow, { Handle, HandleProps, Position } from 'react-flow-renderer';
import {customNodeStyles} from './Styles';



export const CustomNodeComponent = ( {data} : {data:any})  => {



  


  const handleInputChange = (e:any, type:string, data:any) => {
    if(type == "prompt"){
      data.prompt = e.target.value;
    }
    else if (type =="trigger"){
      data.trigger = e.target.value;
    }
   console.log(e.target.value);
   console.log(data);

  };
  
    
    return (
      <div style={customNodeStyles}>
        
        <Handle type="target" position = {Position.Left} style={{ borderRadius: 0 }} />
        <div>{data.text}</div>
        <Handle
          type="source"
          position={Position.Right} 
          id="b"
          style={{ top: '20%', borderRadius: 0 }}
          onConnect = {(connection) => {
            data.connection.push(connection);
          }}
        />
        <Handle
          type="source"
          position={Position.Right} 
          id="b"
          style={{ top: '40%', borderRadius: 0 }}
          onConnect = {(connection) => {
            data.connection.push(connection);
          }}
        />
        <Handle
          type="source"
          position={Position.Right} 
          id="b"
          style={{ top: '60%', borderRadius: 0 }}
          onConnect = {(connection) => {
            data.connection.push(connection);
          }}
        />
        <Handle
          type="source"
          position={Position.Right} 
          id="b"
          style={{ top: '80%', borderRadius: 0 }}
          onConnect = {(connection) => {
            data.connection.push(connection);
          }}
        />
        <div className = "box-flex">
          <div className = "input-flex">
            <label>Trigger</label>
            <input className = "lbl" onChange = { (e) => {handleInputChange(e, "trigger",data)}}></input>
          </div>
          <div className = "input-flex">
            <label>Prompt</label>
            <input className = "lbl" onChange = { (e) => {handleInputChange(e, "prompt",data)}}></input>
          </div>
          {/* <div className = "input-flex">
            <label></label>
            <input></input>
          </div> */}
        </div>
        </div>
    );
  };

  export const nodeTypes = {
    special: CustomNodeComponent,
  };