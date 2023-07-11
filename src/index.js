import React from 'react'
import ReactDOM from 'react-dom/client'
import './commons.css'
import './auth.css'
import './chat.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import Reducer from './redux/reducers'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}>
      <Router >
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
