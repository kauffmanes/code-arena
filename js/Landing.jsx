import React from 'react';
import { Link } from 'react-router-dom';
import {UnControlled as CodeMirror } from 'react-codemirror2';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

import ChatContainer from './ChatContainer';

require('codemirror/mode/erlang/erlang');

class Arena extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            codeString: "",
            lastSavedString: "",
            revisionId: null,
            arenaId: props.arena || null,
            subscriberId: null,
            publisherId: null,
            transmitting: false
        };
        this.save = this.save.bind(this);
        this.getCodeString = this.getCodeString.bind(this);
        this.deleteArena = this.deleteArena.bind(this);
        this.watch = this.watch.bind(this);
        this.stream = this.stream.bind(this);
        this.stopStreaming = this.stopStreaming.bind(this);
        this.stopWatching = this.stopWatching.bind(this);
    }

    componentDidMount () {
        
        //check the URL - if an arena ID is present, request that data. if not, create a new random ID
        if (this.state.arenaId) {
           this.getCodeString(this.state.arenaId);
        } else {
            const newId = new Date().getUTCMilliseconds();
            window.location.href = window.location.href + newId;
        }
    }

    getCodeString (arenaId) {

        var url = "http://localhost:4000/api/arena/" + arenaId;
        var self = this;

        $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            data = data || {};
            if (data.error && data.reason === "missing") {
                
                self.setState({
                    arenaId: arenaId
                });
                console.debug("not a thing yet!", self.state.arenaId);
            } else {
                self.setState({
                    codeString: data.codeString || "",
                    revisionId: data._rev || null //need _rev for initial GET
                });
            }
        
        }).fail(function(err) {
            //Add better error handling eventually
            alert("We've encountered an error...");
        });
    }

    //save to the database
    save () {
        
        if (this.state.transmitting) { return; }
        this.state.transmitting = true;

        console.log("called", this.state.arenaId);

        var url = "http://localhost:4000/api/arena/" + this.state.arenaId;
        var self = this;

        var data = {};
        data.codeString = this.state.codeString;
        if (this.state.revisionId) { data._rev = this.state.revisionId; }

        $.ajax({
            url: url,
            method: "PUT",
            data: JSON.stringify(data)
        }).done(function(data) {
            //console.debug("data", data);
            self.setState({
                revisionId: data.rev
            });
        })
        .fail(function(err) {
            console.debug(err);
        })
        .always(function () {
            self.setState({ transmitting: false });
        });
    }

    //new fresh one
    createNew () {}

    //delete
    deleteArena() {

        var url = "http://localhost:4000/api/arena/" + this.state.arenaId + "?rev=" + this.state.revisionId;
        var self = this;

        $.ajax({
            url: url,
            method: "DELETE"
        }).done(function(data) {
            console.debug("deleted", data);
            if (data.error) {
                console.log(data.reason);
            } else {
                //do things
                if (data.ok) {
                    console.debug("success");
                    location.href = "http://localhost:8080"
                }
            }
        }).fail(function(err) {
            //Add better error handling eventually
            console.debug("We've encountered an error...");
        });
    }

    stream() {
        const self = this;
        const intervalId = setInterval(function () {
            self.save();
        }, 1000);

        this.setState({
            publisherId: intervalId
        });
    }

    watch() {
        const self = this;
        const intervalId = setInterval(function () {
            self.getCodeString(self.state.arenaId);
        }, 1000);

        self.setState({
            subscriberId: intervalId
        });
    }

    stopStreaming() {
        clearInterval(this.state.publisherId);
        this.state.publisherId = null;
    }

    stopWatching() {
        clearInterval(this.state.subscriberId);
        this.state.subscriberId = null;
    }

    render() {
        return (
            <div className="arena">

                <div className="share">
                    <button onClick={this.save}>Save</button>
                    <button disabled={!this.state.revisionId} onClick={this.deleteArena}>Delete</button>
                    <button className={this.state.subscriberId ? "hidden" : "show"} onClick={this.watch}>Watch</button>
                    <button className={this.state.subscriberId ? "show" : "hidden"} className={this.state.subscriberId ? "show" : "hidden"} onClick={this.stopWatching}>Stop Watching</button>
                    <button className={this.state.publisherId ? "hidden" : "show"} onClick={this.stream}>Stream</button>
                    <button className={this.state.publisherId ? "show" : "hidden"} onClick={this.stopStreaming}>Stop Streaming</button>
                </div>

                <CodeMirror
                    className="arena-mirror"
                    value={this.state.codeString}
                    options={{
                        mode: 'erlang',
                        theme: 'mdn-like',
                        lineNumbers: true,
                        autofocus: true,
                        lineWrapping: true
                    }}
                    onChange={(editor, data, value) => {
                        this.state.codeString = value;
                    }}>
                </CodeMirror>
            </div>
        );
    }
}

const Landing = (props) => (
  <div className="landing">
      <Arena arena={props.match.params.arena}></Arena>
      {/* <ChatContainer></ChatContainer> */}
  </div>
);

export default Landing;