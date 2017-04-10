import React, { Component } from 'react'
import Cell from './Cell.jsx'
import axios from 'axios'
import * as d3 from 'd3'
import {Style} from 'radium'

class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attributes: []
        }
    }
    componentDidMount() {
        axios.get('http://localhost:8000/api/attributes')
            .then(response => {

                const data = response.data[0].attributes
                this.setState({
                    attributes: data
                })
            })
    }

    render() {
        return (
            <div className="sidebar">
                <Style scopeSelector=".sidebar" rules={{
                    "ul":{
                        "listStyleType":"none"
                    },

                    "li": {
                        backgroundColor: "#4DB6AC",
                        padding: "0.3rem",
                        borderRadius: "20px",
                        color: "white",
                        marginTop: "0.5rem",
                        marginBottom: "0.5rem",
                        marginLeft:"0rem",
                        textAlign: "center",

                    },
                    "li:hover": {

                        backgroundColor: "#004D40"

                    }
                }}>


                </Style>
                <ul>    
                {this.state.attributes.map((attr, i) => {
                    return <li name={attr} key={`${i} attribute`} >{attr}</li>
                })
                }
                </ul>
            </div>
        )
    }
}

export default SideBar