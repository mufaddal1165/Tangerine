import React, { Component } from 'react'
import { Style } from 'radium'
import {browserHistory} from 'react-router'

class Border extends Component {
    render() {
        return (
            <div className="componentborder" onClick={()=>{
                browserHistory.push(`/${this.props.type}`)
                }}>
                <Style scopeSelector=".componentborder" rules={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                width:"300px",
                height:"300px",
                borderRadius:"10px",
                boxShadow: "1px 1px 1px #888888",
                backgroundColor:"white",
                margin:"10px"
                }}></Style>
                {this.props.children}
            </div>
        )
    }
}

export default Border