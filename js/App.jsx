import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import Header from './Header';
import FourOhFour from './404';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            date: new Date(),
            joined: false,
            displayName: null,
            value: ""
        };
    }

    render() {
        return(
            <BrowserRouter>
                <div className="app">
                    <Header></Header>
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/:arena' component={Landing} />
                        <Route component={FourOhFour} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

render(<App />, document.getElementById('app'));