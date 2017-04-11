import React, {Component} from 'react'
import {Style} from 'radium'
import BarChart from './Bar_d.jsx'
import ChartsDisplay from './ChartsDisplay.jsx'

class BarChartDisplay extends Component {
    render () {
        return (
            <div>
            <ChartsDisplay title="Job Satisfaction">
            <BarChart attr="JobSatisfaction" w={600} h={600}></BarChart>    
            </ChartsDisplay>                
            </div>
        )
    }
}
export default BarChartDisplay