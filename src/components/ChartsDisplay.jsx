import React,{Component} from 'react'
import {Style} from 'radium'

class ChartsDisplay extends Component{
    render(){
        return(
            <div className="chartparent">
                <Style scopeSelector=".chartparent" rules={{
                   display:"flex",
                   justifyContent:"space-between",
                   alignItems:"center",
                   flexDirection:"column",
                   minHeight:"100vh",
                   ".ControlPane":{
                       backgroundColor:"#424242",
                       width:"100%",
                       height:"9rem",
                       alignSelf:"flex-end",
                       display:"flex",
                       
                   },
                   ".ChartTitle":{
                       margin:"7px 5px 15px 10px",
                       color:"white",
                       fontSize:"30px",
                      
                   } 
                }}></Style>
            {this.props.children}
            <div className="ControlPane">
            <div>
                <div className="ChartTitle">
                    {this.props.title}
                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default ChartsDisplay