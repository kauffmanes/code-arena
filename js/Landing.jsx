import React from 'react';
import { Link } from 'react-router-dom';
import {UnControlled as CodeMirror } from 'react-codemirror2';
import $ from 'jquery';
import Header from './Header';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('codemirror/mode/erlang/erlang');

class Arena extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            rev: null,
            arenaId: props.arena || null
        };
        this.save = this.save.bind(this);
    }

    componentDidMount () {

        //check the URL - if an arena ID is present, request that data. if not, create a new random ID
        if (this.state.arenaId) {
            
            var url = "http://localhost:4000/api/arena/" + this.state.arenaId;
            var self = this;

            $.ajax({
                url: url,
                method: "GET",
            }).done(function(data) {
                self.setState({
                    value: data && data.codeString || "",
                    rev: data._rev || null
                });
            })
            .fail(function(err) {
                console.debug(err);
            });
        } else {
            this.state.arenaId = new Date().getUTCMilliseconds();
        }
    }

    //save to the database
    save () {
        
        console.log("called", this.state.arenaId);
        var url = "http://localhost:4000/api/arena/" + this.state.arenaId;
        var self = this;

        $.ajax({
            url: url,
            method: "PUT",
            data: {
                "_rev": this.state.rev,
                "codeString": this.state.value
            }
        }).done(function(data) {
            self.setState({value: data && data.codeString || "", arenaId: data._id });
        })
        .fail(function(err) {
            //console.debug(err);
        });
    }

    //reset button (get's the last saved from db)
    reset() {}

    //new fresh one
    createNew () {}

    //delete
    deleteArena() {}

    render() {
        return (
            <div className="arena">
                <div className="share">
                    To share: <span>{this.state.arenaId ? location.host + "/" + this.state.arenaId : ""}</span>
                    <button onClick={this.save}>Save</button>
                </div>
                <CodeMirror
                    className="arena-mirror"
                    value={this.state.value}
                    options={{
                        mode: 'erlang',
                        theme: 'mdn-like',
                        lineNumbers: true,
                        autofocus: true,
                        lineWrapping: true
                    }}
                    onChange={(editor, data, value) => {
                        this.setState({value: value});
                        this.save(value);
                    }}>
                </CodeMirror>
            </div>
        );
    }
}

const OutMessage = (props) => (
    <div className="me"><small>{props.displayName}:</small><br/><span>{props.message}</span></div>
);

const InMessage = (props) => (
    <div><small>{props.displayName}:</small><br/><span>{props.message}</span></div>
);

const ChatBox = (props) => (
    <ul>
      {props.messageList.map((msg, index) =>
            <li key={index}>
                {props.displayName && props.displayName === msg.displayName
                    ? <OutMessage message={msg.message} displayName={props.displayName}></OutMessage>
                    : <InMessage displayName={msg.displayName} message={msg.message}></InMessage>}
            </li>
      )}
    </ul>
);

class ChatContainer extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            messageList: []
        };
        this.toggleChat = this.toggleChat.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getAllMessages = this.getAllMessages.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getAllMessages() {
        //api call to get all messages
        //replace [] with message array
        //return [];
        return  [
            { "displayName": "emk103", "message": "this is a test of our systems! this is a test of our systems! this is a test of our systems! this is a test of our systems!" },
            { "displayName": "benny990", "message": "HEY THERE how's it goin" },
            { "displayName": "lolol", "message": "some basic chat functionality" },
            { "displayName": "emk103", "message": "i got dis" },
            { "displayName": "lomotey", "message": "i am chatting here" }
        ];
    }

    sendMessage(event) {
        
       window.event = event;
        if (event.key === "Enter") {
            //format message
            const messageObject = {
                displayName: this.state.displayName,
                message: this.state.value
            };

            //api call
            this.setState({ messageList: [...this.state.messageList, messageObject], value: "" });

        }

    }

    handleChange(event) {
        console.log("event");
        this.setState({ value: event.target.value });
    }
    

    toggleChat() {
        if (this.state.joined) {
            this.setState({ joined: false, displayName: null });
        } else {
            let n = prompt("Enter a display name.");
            if (n) { this.setState({ joined: true, displayName: n }); }
        }
    }

    componentWillMount() {
        this.setState({ messageList: this.getAllMessages() });
    }

    render() {
        return (
            <div className="chat-container">
                <h2>Chat</h2>
                <ChatBox displayName={this.state.displayName} messageList={this.state.messageList}></ChatBox>
                <div className="btn-set">
                    <button className={ this.state.joined ? "leave" : "join"} onClick={this.toggleChat}>{this.state.joined ? "Leave chat" : "Join chat"}</button>
                    <textarea
                        disabled={!this.state.joined}
                        placeholder="Ask a question..."
                        onKeyPress={(e) => this.sendMessage(e)}
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e)}>
                    </textarea>
                </div>
            </div>
        );
    }
}

const Landing = (props) => (
    <div>
        {/* <Header arena={props.match.params.arena}></Header> */}
        <div className="landing">
            <Arena arena={props.match.params.arena}></Arena>
            <ChatContainer></ChatContainer>
        </div>
    </div>
);

export default Landing;