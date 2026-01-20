import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {CommentsProvider} from "./context/commentscontext.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
  <CommentsProvider>
    <App />
  </CommentsProvider>
  </BrowserRouter>
  </React.StrictMode>
)