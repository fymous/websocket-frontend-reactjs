import React, { Component } from 'react';
import { Client } from '@stomp/stompjs';
import './App.css';

class App extends Component {

  state = {
    serverData: null,
  }

  componentDidMount() {
    console.log('Component did mount');
    // The compat mode syntax is totally different, converting to v5 syntax
    // Client is imported from '@stomp/stompjs'
    this.client = new Client();

    this.client.configure({
      brokerURL: 'ws://localhost:8080/stomp',
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/queue/schedule', message => {
          const schduleMessageDiv = document.getElementById('schedule-msg');
          schduleMessageDiv.innerHTML += message.body+"<br/>";
        });

        this.client.subscribe('/topic/greetings', message => {
          const customMessageDiv = document.getElementById('custom-msg');
          customMessageDiv.innerHTML += message.body+"<br/>";
        });
      },
      // Helps during debugging, remove in production
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.activate();
  }

  clickHandler = () => {
    let inputData = document.getElementById("name").value;
    this.client.publish({destination: '/app/greetings', 
                body: inputData});
    document.getElementById("name").value = "";        
  }

  render() {
    return (
    <div class="row">
      <div class="column">
        <input type="text" id="name"></input>
        <button className="send-button" onClick={this.clickHandler}>
          Send Info</button>
         <div id="custom-msg"><br/>
         {this.state.serverData ? this.state.serverData : ''}
          </div> 
      </div>
      <div class="column" id="schedule-msg">
        <h2>Schdules Messages</h2><hr/>
        {this.state.serverData ? this.state.serverData : ''}
      </div>
    </div>
    );
  }
}

export default App;
