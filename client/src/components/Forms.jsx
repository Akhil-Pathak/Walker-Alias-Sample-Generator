import React, { Component } from "react";
import { Form, Col, Button, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      totalNum: "",
      parts: "",
      submitted: false,
      generated: false,
      final_pckg: {},
    };
    this.data = {
      labels: [],
      datasets: [
        {
          label: "# Requested (Red)",
          data: [],
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "# Generated (Blue)",
          data: [],
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    };
    this.options = {
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
          },
        ],
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "top",
          display: true,
          color: "black",
        },
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSliderChange(event) {
    const target = event.target;
    const value = parseFloat(target.value);
    const name = target.name;
    var altered_pckg = this.state.final_pckg;
    altered_pckg.probMap[name] = value;
    this.setState({ final_pckg: altered_pckg });
  }

  handleGenerate(event) {
    //console.log(this.state.final_pckg);
    async function postData(url = "", data = {}) {
      //   console.log(JSON.stringify(data));
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData("/prob/uploaddata", this.state.final_pckg).then((data) => {
      //   console.log(this.state.final_pckg);
      this.setState({ final_pckg: data });
      this.setState({ submitted: true });
      this.setState({ generated: true });
      this.data.datasets[1].data = Object.values(
        this.state.final_pckg.finalResult
      );
    });

    this.data.labels = Object.keys(this.state.final_pckg.finalResult);
    const probabilty_requested = Object.values(this.state.final_pckg.probMap);

    const reducer = (accumulator, curr) => accumulator + curr;
    const sum = probabilty_requested.reduce(reducer);
    this.data.datasets[0].data = probabilty_requested.map((norm) =>
      ((norm * this.state.totalNum) / sum).toFixed(2)
    );
    //console.log(this.state.final_pckg);
    event.preventDefault();
  }

  handleSubmit(event) {
    // console.log("Number of parts", parseInt(this.state.parts));
    const classWidth = 100 / this.state.parts;

    var current = classWidth;
    var previous = 0;
    var prob_map_made = {};
    var final_map_made = {};
    for (var i = 1; i < parseInt(this.state.parts) + 1; i++) {
      prob_map_made[Math.round(previous) + "-" + Math.round(current)] = 0;
      final_map_made[Math.round(previous) + "-" + Math.round(current)] = 0;
      previous = current;
      current = current + classWidth;
    }

    const final_result_made = final_map_made;
    const final_pckg = {
      userid: this.state.userid,
      totalNum: this.state.totalNum,
      probMap: prob_map_made,
      finalResult: final_result_made,
    };
    this.setState({ final_pckg: final_pckg });
    this.setState({ submitted: true });
    // console.log(this.final_pckg);
    event.preventDefault();
  }

  render() {
    const items = [];
    if (this.state.submitted) {
      const prob_arr = Object.entries(this.state.final_pckg.probMap);
      for (var i = 0; i < parseInt(prob_arr.length); ++i) {
        items.push(
          <div key={i}>
            <label htmlFor="colFormLabel" className="col-sm-1 col-form-label">
              {prob_arr[i][0]}
            </label>
            <input
              style={{ width: "70%" }}
              type="range"
              className="form-control-range"
              id="formControlRange"
              min="0"
              max="100"
              step="0.1"
              name={prob_arr[i][0]}
              value={this.state.final_pckg.probMap[prob_arr[i][0]] || 0}
              onChange={this.handleSliderChange}
            />
            {/* <label for="colFormLabel" className="col-sm-2 col-form-label p-3"> */}
            <input
              style={{ width: 80, height: 10 }}
              type="Number"
              id="inputPassword6"
              className="col-1 form-control-sm m-2"
              name={prob_arr[i][0]}
              value={this.state.final_pckg.probMap[prob_arr[i][0]] || 0}
              onChange={this.handleSliderChange}
            />
            {/* {this.state.final_pckg.probMap[prob_arr[i][0]]} */}
            {/* </label> */}
          </div>
        );
      }
      if (!this.state.generated) {
        return (
          <div className="row">
            <div className="col p-3 m-2">
              <h4>Please enter the following details : </h4>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="userid">
                  <Form.Label column sm={2}>
                    Name
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="userid"
                      value={this.state.userid}
                      onChange={this.handleInputChange}
                      type="text"
                      placeholder="Name"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="totalNum">
                  <Form.Label column sm={2} size="lg">
                    Samples
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="totalNum"
                      value={this.state.totalNum}
                      onChange={this.handleInputChange}
                      type="number"
                      placeholder="Number of samples...."
                      min="0"
                      step="any"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="totalNum">
                  <Form.Label column sm={2}>
                    Partition
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="parts"
                      value={this.state.parts}
                      onChange={this.handleInputChange}
                      type="number"
                      placeholder="Division from 0-100"
                      min="0"
                      step="any"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit" size="lg">
                      Generate Bars
                    </Button>
                  </Col>
                </Form.Group>
              </Form>{" "}
            </div>
            <div className="col-8 p-3 m-2">
              <h4>Please input the % of each category : </h4>
              <form onSubmit={this.handleGenerate}>
                <div className="form-group row">{items}</div>
                <button type="submit" className="btn btn-primary my-1">
                  Generate Samples
                </button>
              </form>
            </div>
          </div>
        );
      } else {
        return (
          <div className="container-fluid">
            <div className="row">
              <div className="col p-3 m-2">
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group as={Row} className="mb-3" controlId="userid">
                    <Form.Label column sm={2}>
                      Name
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="userid"
                        value={this.state.userid}
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="Name"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="totalNum">
                    <Form.Label column sm={2} size="lg">
                      Samples
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="totalNum"
                        value={this.state.totalNum}
                        onChange={this.handleInputChange}
                        type="number"
                        placeholder="Number of samples...."
                        min="0"
                        step="any"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="totalNum">
                    <Form.Label column sm={2}>
                      Partition
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="parts"
                        value={this.state.parts}
                        onChange={this.handleInputChange}
                        type="number"
                        placeholder="Division from 0-100"
                        min="0"
                        step="any"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }}>
                      <Button type="submit" size="lg">
                        Generate Bars
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>{" "}
              </div>
              <div className="col-8">
                <form onSubmit={this.handleGenerate}>
                  <div className="form-group row">{items}</div>
                  <button type="submit" className="btn btn-primary my-1">
                    Generate Samples
                  </button>
                </form>
              </div>
            </div>
            <div className="row p-3 m-2">
              <h4 className="text-center">
                Graph showing the Expected and Returned samples{" "}
              </h4>
              <p className="text-center">
                (Please refresh to make new samples)
              </p>
              <Bar
                plugins={ChartDataLabels}
                data={this.data}
                options={this.options}
              />
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="row">
          <div className="col p-3 m-2">
            <h4>Please enter the following details : </h4>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="userid">
                <Form.Label column sm={1}>
                  Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    name="userid"
                    value={this.state.userid}
                    onChange={this.handleInputChange}
                    type="text"
                    placeholder="Name"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="totalNum">
                <Form.Label column sm={1} size="lg">
                  Samples
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    name="totalNum"
                    value={this.state.totalNum}
                    onChange={this.handleInputChange}
                    type="number"
                    placeholder="Number of samples...."
                    min="0"
                    step="any"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="totalNum">
                <Form.Label column sm={1}>
                  Partition
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    name="parts"
                    value={this.state.parts}
                    onChange={this.handleInputChange}
                    type="number"
                    placeholder="Division from 0-100"
                    min="0"
                    step="any"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 1 }}>
                  <Button type="submit" size="lg">
                    Generate Bars
                  </Button>
                </Col>
              </Form.Group>
            </Form>{" "}
          </div>
        </div>
      );
    }
  }
}

export { InputForm };
