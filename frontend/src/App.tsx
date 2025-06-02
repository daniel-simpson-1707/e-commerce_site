import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Login from './pages/Login';
import Header from './components/Header';

const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE!;

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      audience={audience}
    >
      <Router>
        <Header />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/success" component={Success} />
          <Route path="/cancel" component={Cancel} />
          <Route path="/" exact>
            <div className="text-center mt-10">
              <h1 className="text-3xl">Welcome to Example Site</h1>
            </div>
          </Route>
        </Switch>
      </Router>
    </Auth0Provider>
  );
}

export default App;
