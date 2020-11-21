import React from 'react';
import {Redirect, Route} from "react-router-dom";
import { isAuthenticated } from './API/authAPI';


const AdminRoute = ({ component: Component, ...rest })=> {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  export default AdminRoute;