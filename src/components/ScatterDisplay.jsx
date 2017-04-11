import React, { Component } from 'react'
import { Style } from 'radium'
import Scatter from './Scatter.jsx'
import ChartsDisplay from './ChartsDisplay.jsx'

class ScatterDisplay extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.params)
        this.state = {
            attrs: {
                attr2: "Age",
                attr1: "YearsSinceLastPromotion",
                attr3: "StockOptionLevel"
            }
        }
    }
    componentDidMount() {
        const { attr1, attr2, attr3 } = this.props.params
        if (attr1 && attr2 && attr3)
            this.state(
                {
                    attr1: attr1,
                    attr2: attr2,
                    attr3: attr3
                }
            )
    }
    handler(attr,val){
        var attrs = this.state.attrs
        attrs[attr] = val
        this.setState({
            attrs:attrs
        })
        console.log(this.state.attrs)
    }
    render() {
        const {attrs}=this.state
        return (
            <div>
                <ChartsDisplay attrs={this.state.attrs} handler={this.handler.bind(this)}>
                    <Scatter w={580} h={580} attr1={attrs.attr1} attr2={attrs.attr2} attr3={attrs.attr3}/>
                </ChartsDisplay>
            </div>
        )
    }
}

export default ScatterDisplay