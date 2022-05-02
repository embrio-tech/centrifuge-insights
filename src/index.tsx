import React from 'react'
// import { createRoot } from 'react-dom/client'
import { render } from 'react-dom'
import './index.less'
import { App } from './components'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(document.getElementById('root')!)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
