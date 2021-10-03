# Getting Started 

Download and install node.js

pull this repo

cd into cloned folder and run 'npm i' to install packages

Open another terminal and cd into src. Run 'node server.js' to start running the node js backend server. You should get "listening on port 8080" if it's working.

On the other terminal, run 'npm start' to run front end.

## Using the GUI.

Create new nodes and connect them together via the backend to the frontside.

Add a "prompt" if you want to create an mp3 file for that node.

Adding a "trigger" will not create a sound file, but will be stored as part of the object connection structure. See below image

![alt text](https://github.com/Kolvinn/IVR_GUI_New/blob/main/src/ScreenFlow.png?raw=true)

## Saving.

If you have the desired flow, click save. This will create an mp3 file per prompt and will also produce an JSON object structure of the flow.

You can have a look at an example .json file that will be printed via the above image here https://github.com/Kolvinn/IVR_GUI_New/blob/main/src/lmao.json. The JSON object is a list of node objects and edge objects. A node object, as below, will have a reference to all the nodes it is connected to via the connections section.

{
      "id": "node_1633267130695",
      "type": "special",
      "position": {
        "x": -513.9171660301502,
        "y": 324.96174169490223
      },
      "data": {
        "nodeId": "node_1633267130695",
        "text": "node_1633267130695",
        "type": {
          "type": "special"
        },
        "x": {
          "x": 915.0828339698498
        },
        "y": {
          "y": 955.9617416949022
        },
        "trigger": "",
        "prompt": "say 1 or 2",
        "connection": [
          {
            "source": "node_1633267130695",
            "sourceHandle": "b",
            "target": "node_1633267132893",
            "targetHandle": null
          },
          {
            "source": "node_1633267130695",
            "sourceHandle": "b",
            "target": "node_1633267157115",
            "targetHandle": null
          }
        ],
        "audioFileLocation": "node_1633267130695.mp3"
      }
    },

## Variables.

in src/server.js, you can 
- change the name of the .json file that is produced when you save.
- change the lanuage of Googletts in the /fetchtext method.
- You can also change ports that are used via app.listen. Though package.json has a proxy set up for localhost:8080 currently.
- **Change the directory where the mp3 and json files are stored via the directory object. Currently to set some C drive. You will have to change this**

in App.tsx you can
- Search for onAdd method. IN there is the newNode data structure that is passed around. The saved data is stored in the data section.
- Search for onSave method. You can change the name of the mp3 files created (it's currently the node id + .mp3)

Any styling is either in the App.css or index.css (though not really the latter). 
The node box styling is via .parent-box{}.



### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
