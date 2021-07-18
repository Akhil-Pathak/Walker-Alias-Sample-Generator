import React, { Component } from "react";

class TitleBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-fixed-top navbar-dark main-nav">
        <div className="container">
          <h1 className="nav navbar-nav mx-auto text-black">
            Random Sample Generator
          </h1>
        </div>
      </nav>
    );
  }
}

export default TitleBar;
