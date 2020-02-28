import * as React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from "history";
import {Component} from "react";
import {Controlled as CodeMirror} from 'react-codemirror2';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/dracula.css';
require('codemirror/mode/python/python');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');


const history = createBrowserHistory();
const url = "http://localhost:8080/pycode";

class Home extends Component{
    state = {
        code: "print('hello world')",
        output: ""
    };

    options ={
        mode: 'python',
        theme: 'material',
        lineNumbers: true
    };

    handleOutput(out){
     this.setState({output: out });
    }


    render() {
        return(
            <div id="message" >
                <h2 style={{textAlign: "center"}}>Welcome</h2>
                <h1 style={{textAlign: "center"}}>Try to run some code</h1>
                <h1 style={{marginTop: "30px"}}>Input</h1>
                <CodeMirror
                    value={this.state.code}
                    options={this.options}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({code: value});
                    }}
                    onChange={(editor, data, value) => {
                    }}
                />
                <button id={"submit"} className={"btn btn-success btn-lg btn-block"} onClick={event => { this.submit() }}>Run code</button>
                <h1 style={{marginTop: "30px"}}>Output</h1>
                <div style={{ height: "200px", overflow: "auto", backgroundColor: "black" }}>
                    {this.state.output.split("\n").map(line => (
                            <p style={{color: "green"}}>
                                {"coderunner> "+line}
                            </p>
                        )
                    )}
                </div>

            </div>
        )
    }

    submit(){
        console.log(this);
        let code = this.state.code;
        console.log(code);
        this.postCode(code)
            .then(result => {
                console.log(result);
                this.handleOutput(result);
            })
    }
    postCode(data) {
        console.log(data);
        return axios.post(url, {code: data})
            .then(res => res.data.body);
    }

}

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter history={history}>
        <Route exact path="/" component={Home}/>
    </BrowserRouter>,
root
);
