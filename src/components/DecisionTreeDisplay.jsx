import React, {Component} from 'react'
import DecisionTree from './DecisionTree.jsx'
import ChartsDisplay from './ChartsDisplay.jsx'

class DecisionTreeDisplay extends Component {
    render () {
        return (
            <div>
            <ChartsDisplay title="DecisionTree">
            <DecisionTree width={550} height={550}></DecisionTree>  
            </ChartsDisplay>  
            </div>        
            )
    }
}

export default DecisionTreeDisplay