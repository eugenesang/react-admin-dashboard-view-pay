import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SimpleReactLightbox from "simple-react-lightbox";
import ThemeContext from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SimpleReactLightbox>
        <BrowserRouter basename='/dashboard'>
          <ThemeContext>
            <App />
          </ThemeContext>
        </BrowserRouter>
      </SimpleReactLightbox>
    </Provider>
  </React.StrictMode>
);