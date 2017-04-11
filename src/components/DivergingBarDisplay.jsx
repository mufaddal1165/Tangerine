import React, {Component} from 'react'
import {Style} from 'radium'
import DivergingBar from './DivergingBar.jsx'
import ChartsDisplay from './ChartsDisplay.jsx'



class DivergingBarDisplay extends Component {
    render () {
        return (
            <div>
            <ChartsDisplay title="Attrition">
            <DivergingBar w={550} h={550} attr1="MaritalStatus" attr2="Attrition"/>
            </ChartsDisplay>                
            </div>
        )
    }
}

export default DivergingBarDisplay