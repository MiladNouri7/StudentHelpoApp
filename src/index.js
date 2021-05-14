import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-calendar/dist/Calendar.css'
import "./application/layout/styles.css"
import App from "./application/layout/App.jsx";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { storeConfiguration, history } from './application/storeConfiguration';
import ScrollUp from './application/layout/ScrollUp';
import {ConnectedRouter} from 'connected-react-router';

const store = storeConfiguration()


const rootEl = document.getElementById("root");

function render(){
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ScrollUp />
        <App />
      </ConnectedRouter>
    </Provider>
    , rootEl);
}

if(module.hot){
  module.hot.accept("./application/layout/App.jsx", function(){
    setTimeout(render);
  });
}

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
