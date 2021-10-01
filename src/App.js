import React, {Component} from 'react';
import SocketIOClinet from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name : '',
      text : '',
      response : [],
      endpoint : 'http://localhost:4001'
    }
  }
  Socket;
  send;
  componentDidMount(){
    const {endpoint } = this.state;
    this.Socket = SocketIOClinet(endpoint);

    //connecting to socket
    this.Socket.on('connection',(messages)=>{
      this.setState({
        ...this.state,
        response : messages
      })
      console.log('connected',messages)});

    //implementing message receive action
    this.Socket.on('message', message=>{
      this.setState({
        ...this.state,
        response : message
      })
      console.log(message);
    });

//@implementing send function
    this.send = (e)=>{
      this.Socket.emit('message',{'name':this.state.name, 'message':this.state.text});
      this.setState({
        ...this.state,
        text : ''
      })
      }
  }

  //updating text area value to state
  typed = (e)=>{
    this.setState({
      ...this.state,
      text : e.target.value
    },()=>console.log(this.state.text))
    
  }

  render() {

    const messages = (data)=>{
      if(data == null){
        return <h6>Loading...</h6>
      }else{
      var list = data.map(element => {
        return (
        <div className='message'>
          <h6>{element['name']}</h6>
          <p>{element['message']}</p>
        </div>
        )
      });
      return list;
    }
    }
    //var demo = [{'name':'king','message':'not you'},{'name':'rook','message':'i make my way'}]
    return (
    <div className="App">
      <h5>Ping your people</h5>
      <div className='wrapper'>
        <div>
          <input type='text' className='namebox' placeholder='Type your name' value={this.state.name} onChange={(e)=>{
            this.setState({
              ...this.state,
              name : e.target.value
            },()=>console.log(this.state.name))
          }} />
          <textarea name='text' placeholder='Type your text' value={this.state.text} onChange={(e)=>this.typed(e)} className='messagebox'></textarea>
          <button className='send' onClick={(e)=>this.send(e)}>send</button>
        </div>
        <div>
          { messages(this.state.response) }
        </div>
      </div>
    </div>
    )
  }
}

export default App