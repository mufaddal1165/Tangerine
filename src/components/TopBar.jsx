import React, { Component } from 'react'
import { Style } from 'radium'
class TopBar extends Component {
    render() {
        return (
            <div className="topbar">
                <Style scopeSelector=".topbar" rules={{
                    position: "relative",
                    height: "8rem",
                    backgroundColor: "#424242",
                    width: "100%",
                    display: "flex",
                    alignItems:"center",
                    justifyContent:"center",
                    ".search":{
                        width:"350px",
                        border:"none",
                        borderRadius:"40px",
                        height:"30px",
                        padding:"10px"

                    },
                    button:{
                        margin:"13px",
                        color:"white",
                        
                        border:"none",
                        backgroundColor:"#E53935",
                        padding:"8px",
                        borderRadius:"15px"
                    }
                   
                }}>

                </Style>
                <form action="get">
                    <input className="search" type="text" placeholder="Add data"/>
                    <button type="submit" onSubmit={(e)=>{
                        this.preventDefault(e)
                        }}>
                        Upload
                    </button>
                </form>
            </div>
        )
    }
}

export default TopBar