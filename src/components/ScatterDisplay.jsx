import React, { Component } from 'react'
import { Style } from 'radium'
import Scatter from './Scatter.jsx'
import ChartsDisplay from './ChartsDisplay.jsx'

class ScatterDisplay extends Component {
    render() {
        return (
            <div>
                <ChartsDisplay>
                <Scatter w={550} h={550} attr2="Age" attr1="YearsAtCompany" attr3="Attrition" />
                </ChartsDisplay>
            </div>
        )
    }
}

export default ScatterDisplay