import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css"
import TitleBar from "./components/Title";
import {InputForm} from "./components/Forms";




ReactDOM.render(
  <div>
    <div className = "row">
        <div className="container-fluid p-3 bg-dark text-white">
            <TitleBar />
        </div>
    </div>
    <div className="container-fluid">
        <InputForm /> 
    </div>
  </div>,
  document.getElementById("root")
  // <App />,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
