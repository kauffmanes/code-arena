import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import Test from './Test';
import Header from './Header.jsx';

const FourOhFour = () => <h1>404</h1>;

const App = () => (
    <BrowserRouter>
        <div className="app">
            <Header></Header>
            <Switch>
                <Route exact path='/' component={Landing} />
                <Route exact path='/arena' component={Landing} />
                <Route path='/arena/:arena' component={Landing} />
                <Route path='/test' component={Test} />
                <Route component={FourOhFour} />
            </Switch>
        </div>
    </BrowserRouter>
);

render(<App />, document.getElementById('app'));