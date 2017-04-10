import React, {Component} from 'react'
import {Style} from 'radium'

class Cell extends Component {
    render () {
        return (
            <div className="cell">
            <Style scopeSelector=".cell" rules={{
                
            }}>
            
            </Style>

            {this.props.name}
            </div>
        )
    }
}

export default Cell