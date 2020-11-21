import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Home from './Home/Home';
import SignIn from './SignIn/SignIn';
import Room from './Room/Room';
import End from './End/End';
import AdminRoute from './AdminRoute';

const Routes = () => {
    return <BrowserRouter>
        <Switch>
        <AdminRoute path="/" exact component={Home}></AdminRoute>

            <Route path='/end' exact component={End}></Route>
            <Route path='/signin' exact component={SignIn}></Route>
            <AdminRoute path='/:roomId' exact component={Room}></AdminRoute>





        </Switch>
    </BrowserRouter>
}

export default Routes;