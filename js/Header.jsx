import React from 'react';
import { render } from 'react-dom';

const Header = () => (
    <header>
        <h1>code-arena</h1>
        <div>
            <i className="fas fa-cog fa-2x"></i>
            <div className="options">
                <ul>
                    {/* <li><button className="btn-danger">Delete</button></li> */}
                    <li><button className="btn-secondary">Reset to last save</button></li>
                    <li><button className="btn-primary">Save arena</button></li>
                </ul>
            </div>
        </div>
    </header>
);

export default Header;