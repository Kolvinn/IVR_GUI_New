const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const app = express();
const GoogleTts = require('google-tts.js');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

const directory = "C:/Users/jerem/ReactTest/finalapp/IVR_GUI_New/src/"

app.get('/', (req, res) => {
    res.send('Welcome to CORS server 😁');
});
app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" });
    });

app.listen(8080, () => {
    console.log('listening on port 8080');
});




/**
 * Write to the json file. Change the .json file to the filename or directory that is useful
 */
app.post('/writefile',(req, res,next) => {
    res.set('Access-Control-Allow-Origin', '*');
    //console.log(req.body);
    const data = JSON.stringify(req.body,null,2);
   // var data = JSON.stringify(req.body);
    if(data){
        try {
            fs.writeFileSync("lmao.json", data);
        } catch (err) {
            console.log("throwing error!");
            throw err;
        }
    }   

});







app.get('/fetchtext', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    var prompt = req.query.prompt;
    var fileName = directory +req.query.fileName;

    /**
     * This is the google call tts call. 
     * I haven't looked at what saveFile actually returns beyond the file.
     */

    GoogleTts.saveFile(prompt, "EN", fileName).then((vars)=> 
    {
        console.log(vars);
    });

    

});
