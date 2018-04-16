import React from 'react';
import { render } from 'react-dom'
var classNames = require('classnames');

class Header extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     toggleStatus: false,
        //     isNew: !!(!props.arena)
        // };
        //this.toggleOptions = this.toggleOptions.bind(this);
        //this.saveArena = this.saveArena.bind(this);
        //console.log(props);
    }

    // toggleOptions () {
    //     console.debug("test");
    //     this.setState({toggleStatus: !this.state.toggleStatus});
    // }

    // saveArena () {

    //     var _id = this.state.arenaId ? this.state.arenaId : new Date().getUTCMilliseconds();
    //     var url = "http://localhost:4000/api/arena/" + _id;
    //     var self = this;

    //     $.ajax({
    //         url: url,
    //         method: "PUT",
    //         params: {
    //             _rev: window.arenaData._rev || null
    //         }
    //     }).done(function(data) {
    //         self.setState({value: data && data.codeString || ""});
    //     })
    //     .fail(function(err) {
    //         console.debug(err);
    //     });
    // }

    render() {
        // var classes = classNames({
        //     'options': true,
        //     'block': false,
        //     'hidden': true
        // });

        return (
            <header>
                <h1>code-arena</h1>
            </header>
        );
    }
}

export default Header;