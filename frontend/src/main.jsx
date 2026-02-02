import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CommentsProvider } from "./context/commentscontext.jsx";
import { PostsProvider } from "./context/postscontext.jsx";
import { AuthProvider } from "./context/authcontext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <CommentsProvider>
              <PostsProvider>
                <App />
              </PostsProvider>
            </CommentsProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
