import React from 'react';
import { render } from 'react-dom'
var classNames = require('classnames');

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <h1>code-arena</h1>
            </header>
        );
    }
}

export default Header;