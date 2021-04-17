import './index.css'
import 'antd/dist/antd.css'

import { GlobalState } from './globalState'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from './Router'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <GlobalState>
      <Router />
    </GlobalState>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
