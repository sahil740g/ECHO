import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CommentsProvider } from "./context/commentscontext.jsx";
import { PostsProvider } from "./context/postscontext.jsx";
import { AuthProvider } from "./context/authcontext.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CommentsProvider>
        <PostsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PostsProvider>
      </CommentsProvider>
    </BrowserRouter>
  </React.StrictMode>
)