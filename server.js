var express = require('express');
var http = require('http');
var socketIO = require('socket.io');
var cors = require('cors');
var path = require('path');
//var React = require('react');
var fs = require('fs');
/*var ReactDOMServer = require('react-dom/server');
var App = require('./src/App');*/

const port = process.env.PORT || 4001;
const app = express();

const server = http.createServer(app);
const io = socketIO(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

var messages = [{'name':'king','message':'I move one step at a time'},{'name':'rook','message':'i make my way'}];
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

io.on("connection",( socket )=>{
    console.log('new connection !');
    socket.emit('connection',messages);
    socket.on("disconnect", () => console.log("Client disconnected"));

    socket.on('message',(message)=>{
        messages.push(message);
        console.log(message);
        io.emit('message',messages);
    })
})

app.get('/',(req,res)=>{
    /*var APP = ReactDOMServer.renderToString(App);
    
    var indexfile = path.resolve('./build/index.html');
    fs.readFile(indexfile, 'utf-8',(err,data)=>{
        if(err){
            return res.status(500)
        }

        return res.send(data.replace('<div id="root"></div>',`<div id="root">${APP}</div>`));
    })*/
    res.sendFile(path.join(__dirname,'./build','index.html'));
})
app.use(express.static('./build'));
server.listen(port, ()=>{
    console.log(`server listening ${port}`);
})